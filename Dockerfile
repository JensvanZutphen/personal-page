# Use specific Node.js version for consistency
FROM node:22-alpine AS base

# Install security updates and required tools only once
RUN apk update && apk upgrade && apk add --no-cache \
    dumb-init \
    mysql-client \
    && rm -rf /var/cache/apk/*

# Create app user for security
RUN addgroup -g 1001 -S nodejs && adduser -S sveltekit -u 1001

WORKDIR /app

# Dependencies stage - optimized for caching
FROM base AS deps

# Copy package files first for better caching
COPY package*.json ./
COPY prisma/ ./prisma/

# Install all dependencies in one go and generate Prisma client
RUN npm ci --frozen-lockfile && \
    npm run prisma:generate && \
    npm cache clean --force

# Build stage
FROM base AS build

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy source code (this layer changes most often, so it's last)
COPY . .

# Generate Prisma client (already generated in deps, but needed here for type safety)
RUN npm run prisma:generate

# Build the application
ARG BUILD_ID=dev
ENV BUILD_ID=${BUILD_ID}

# Update package.json version if BUILD_ID is provided and build
RUN if [ "$BUILD_ID" != "dev" ]; then \
        node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); pkg.version = process.env.BUILD_ID; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"; \
    fi && \
    npm run build

# Production dependencies stage - separate for better caching
FROM base AS prod-deps

COPY package*.json ./
COPY prisma/ ./prisma/

# Install only production dependencies
RUN npm ci --frozen-lockfile --only=production && \
    npm install -g tsx && \
    npm run prisma:generate && \
    npm cache clean --force

# Production stage
FROM base AS production

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./

# Copy built application and necessary files
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma/
COPY --from=build /app/scripts ./scripts/

# Install tsx globally (must run as root before switching user)
RUN npm install -g tsx && npm cache clean --force

# Copy startup script
COPY start-production-robust.sh ./start.sh
RUN chmod +x /app/start.sh

# Change ownership to nodejs user
RUN chown -R sveltekit:nodejs /app
USER sveltekit

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Optional mock data seeding
# Set CREATEMOCKDATA=true at container runtime to seed the database with mock data (npm run db:seed)
ENV CREATEMOCKDATA=false

# Start the application
CMD ["sh", "/app/start.sh"]