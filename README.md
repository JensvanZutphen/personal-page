# SvelteKit Superforms Template

This is a comprehensive template for building SvelteKit applications with a focus on a great developer experience and a modern, visually appealing UI. It comes pre-configured with user authentication, form handling with Superforms, and a beautiful UI built with Shadcn/ui and Tailwind CSS.

## Features

- **SvelteKit**: A powerful and flexible framework for building web applications of all sizes.
- **Superforms**: A SvelteKit library that makes form handling a breeze, with server-side validation, type-safety, and a great developer experience.
- **Prisma**: A next-generation ORM for Node.js and TypeScript that makes database access easy and safe.
- **MySQL**: A popular and reliable open-source relational database.
- **Shadcn/ui for Svelte**: A collection of beautifully designed, accessible, and customizable UI components.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Authentication**: A complete and secure authentication system with login, registration, and session management.
- **Dark Mode**: A built-in dark mode toggle for a comfortable user experience.
- **Custom Components**: Includes custom components like `StreamingContent` and `AnimatedGradient` to create visually appealing loading experiences.
- **Dockerized**: Comes with a Docker Compose setup for easy development and deployment.

## Getting Started

### Prerequisites

- Node.js 22+
- Docker and Docker Compose

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/JensvanZutphen/svelte-superforms-template.git
    cd svelte-superforms-template
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your database credentials.

4.  **Start the database**

    ```bash
    npm run db:start
    ```

5.  **Run database migrations**

    ```bash
    npm run db:migrate
    ```

6.  **Start the development server**

    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Database Management

- **Start database**: `npm run db:start`
- **Create migration**: `npm run db:migrate`
- **Push schema changes**: `npm run db:push`
- **Open Prisma Studio**: `npm run db:studio`

## Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable Svelte components
│   │   ├── custom/          # Custom components
│   │   └── ui/              # Shadcn/ui components
│   ├── server/           # Server-side utilities
│   │   ├── auth.ts       # Authentication logic
│   │   └── db/           # Database connection
│   └── schemas.ts        # Zod validation schemas
├── routes/               # SvelteKit routes
│   ├── (app)/           # Protected application routes
│   └── (auth)/            # Authentication routes
prisma/
├── schema.prisma         # Database schema
└── migrations/          # Database migrations
```

## Authentication

Authentication is handled via a session-based system. The core logic is located in `src/lib/server/auth.ts`. The authentication routes are in `src/routes/(auth)`.

## Form Handling with Superforms

This template uses [Superforms](https://superforms.rocks/) to handle forms. Superforms provides a simple and powerful way to create forms with server-side validation and a great developer experience.

The "Settings" page (`src/routes/(app)/settings`) provides an example of how to use Superforms to create a form for updating user data.

## Styling

Styling is done with [Tailwind CSS](https://tailwindcss.com/) and [Shadcn/ui for Svelte](https://www.shadcn-svelte.com/). The Tailwind CSS configuration is in `tailwind.config.ts`.

## Deployment

### Using Docker Compose (Recommended)

1.  **Build and start the production environment**

    ```bash
    docker-compose -f docker-compose.prod.yml up -d
    ```

### Manual Docker Build

1.  **Build the Docker image**

    ```bash
    docker build -t svelte-superforms-template .
    ```

2.  **Run the container**

    ```bash
    docker run -d \
      --name svelte-superforms-template \
      -p 3000:3000 \
      -e DATABASE_URL="mysql://user:password@host:port/database" \
      svelte-superforms-template
    ```

## Custom Components

### `StreamingContent`

The `StreamingContent` component (`src/lib/components/custom/StreamingContent.svelte`) allows you to easily handle streaming data from your `+page.server.ts` files. It displays a skeleton loader while the data is being fetched and then smoothly transitions to the content when it's available.

### `AnimatedGradient`

The `AnimatedGradient` component (`src/lib/components/custom/AnimatedGradient.svelte`) creates a beautiful, animated gradient background that you can use to add a modern touch to your pages.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
