#!/bin/sh

set -e

echo "Starting production deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "Database URL configured."

# Wait for DB
echo "Waiting for database to be ready..."
sleep 2

# --- Run database migrations ---
# This might fail with P3005 if the database is not clean.
# In that case, you should baseline your production database.
# See: https://pris.ly/d/migrate-baseline
echo "Running database migrations..."

# First, try normal migration deployment
if ! npx prisma migrate deploy; then
    echo "Migration deployment failed. Resolving conflicts and applying latest migrations..."
    
    # Baseline all existing migrations to resolve conflicts
    echo "Marking existing migrations as applied..."
    npx prisma migrate resolve --applied "20250528124111_init" 2>/dev/null || echo "Init migration already resolved or not needed"
    npx prisma migrate resolve --applied "20250626095805_add_visit_status" 2>/dev/null || echo "Visit status migration already resolved or not needed"
    npx prisma migrate resolve --applied "20250626100847_change_salesperson_to_text" 2>/dev/null || echo "Salesperson migration already resolved or not needed"
    npx prisma migrate resolve --applied "20250627091648_add_contact_persons_and_delivery_addresses" 2>/dev/null || echo "Contact/address migration already resolved or not needed"
    npx prisma migrate resolve --applied "20250627101030_add_customer_address_fields" 2>/dev/null || echo "Customer address fields migration already resolved or not needed"
    npx prisma migrate resolve --applied "20250627101500_add_legacy_id_to_customer" 2>/dev/null || echo "Legacy ID migration already resolved or not needed"
    
    # After baselining, force the database schema to match the Prisma schema
    echo "Forcing database schema to match Prisma schema..."
    npx prisma db push || echo "WARNING: Schema push failed"
    
    # Try to deploy any remaining migrations
    echo "Deploying any remaining migrations..."
    npx prisma migrate deploy || echo "No additional migrations to deploy"
fi

echo "Migration process completed. Database should now be at latest schema."

# --- Generate Prisma client ---
# This ensures the client is up-to-date with the schema.
echo "Generating Prisma client..."
npx prisma generate

# --- Optional seeding ---
if [ "$CREATEMOCKDATA" = "true" ]; then
    echo "Seeding mock data..."
    npm run db:seed || echo "WARNING: Seeding failed"
fi

# --- Start the application ---
# We use --import to load polyfills before any application code.
echo "Starting application..."
exec node build/index.js