# Fazrul Thesis Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It serves as the frontend for a thesis project focused on an AI Competition Recommendation Tool.

## Project Overview

The application leverages cutting-edge LLM technology to help users find the best competitions to participate in, enhancing their competitive edge. It features distinct interfaces for students, advisors, and administrators.

## Tech Stack & Tools

* **Framework**: Next.js (v15.3.2)
* **Language**: TypeScript
* **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
* **Styling**: Tailwind CSS (v4)
* **State Management**: React Context API (implicitly via NextAuth.js SessionProvider and component state)
* **Authentication**: NextAuth.js (v4.24.11)
* **Database ORM**: Prisma (v6.7.0)
* **Database**: PostgreSQL (via Docker)
* **Linting**: ESLint with Airbnb, Prettier, and TypeScript configurations
* **Formatting**: Prettier
* **API Documentation**: Swagger UI (OpenAPI)
* **Animations**: Framer Motion
* **Development Environment**: Node.js v20, npm

## Development Workflow

This project follows **Trunk Based Development**. All developers commit to a single branch (typically `main`). Feature development and bug fixes are done in short-lived branches that are frequently merged into the main trunk.

## Getting Started

### Prerequisites

* Node.js v20
* npm (comes with Node.js)
* Docker (for running the PostgreSQL database)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd thesis-fe
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add the necessary environment variables. Refer to `.env.example` if available, or set up based on `src/app/server/utils/bcrypt/bcrypt.constants.ts` for `SALT_ROUNDS` and `src/app/api/auth/[...nextauth]/route.ts` for `NEXTAUTH_SECRET` and database connection string if needed.

4.  **Start the PostgreSQL database using Docker:**
    ```bash
    docker-compose up -d
    ```
    This will start a PostgreSQL container with the database named `thesis` and credentials `root/root`.

5.  **Apply Prisma migrations:**
    Ensure your database schema is up to date.
    ```bash
    npx prisma db push
    ```
    Or for development with migration history:
    ```bash
    npx prisma migrate dev
    ```

6.  **Generate Prisma Client:**
    This is usually done automatically post-install, but can be run manually.
    ```bash
    npx prisma generate
    ```

7.  **Create initial accounts (optional):**
    A script is provided to create default admin and student accounts.
    ```bash
    npm run create:account
    ```

### Running the Development Server

First, run the development server:
```bash
npm run dev

This document provides a simplified folder structure for the `thesis` project, built with Node.js 20, npm, trunk-based development, and shadcn/ui for UI components. It also explains how trunk-based development is implemented.

## Folder Structure

```
├─ .github/                  # GitHub configurations
│   └─ workflows/           # CI/CD pipelines
│       └─ ci.yml           # Pipeline for automated testing/deployment
├─ docker/                  # Docker configurations
│   └─ db/                  # Database Docker setup
│       └─ Dockerfile       # Database container configuration
├─ prisma/                  # Prisma ORM setup
│   └─ migrations/          # Database migration files
│       └─ init.sql         # Initial migration script
├─ public/                  # Static assets
│   └─ favicon.ico          # Application favicon
├─ src/                     # Main source code
│   ├─ app/                 # Next.js App Router
│   │   ├─ (dashboard)/     # Dashboard pages
│   │   │   └─ page.tsx     # Dashboard main page
│   │   ├─ (home)/          # User-facing pages
│   │   │   └─ page.tsx     # Home page
│   │   ├─ api/             # API routes
│   │   │   └─ route.ts     # API route handler
│   │   ├─ auth/            # Authentication pages
│   │   │   └─ login/page.tsx # Login page
│   │   └─ server/          # Server-side logic
│   │       └─ auth.service.ts # Authentication logic
│   ├─ components/          # Reusable React components
│   │   └─ ui/              # shadcn/ui and custom components
│   │       └─ button.tsx   # Reusable button component
│   ├─ hooks/               # Custom React hooks
│   │   └─ use-auth.ts     # Authentication hook
│   └─ lib/                 # Utility functions
│       └─ cn.ts            # ClassName utility for shadcn/ui
├─ components.json          # shadcn/ui configuration
├─ next.config.ts          # Next.js configuration
├─ package.json             # Project dependencies
└─ tsconfig.json           # TypeScript configuration
```

## Trunk-Based Development Workflow

The project uses **trunk-based development**, a streamlined approach to version control that emphasizes frequent integration and minimal branching.

1. **Main Branch**: The `main` branch is the central integration point, always production-ready or near production-ready.
2. **Short-Lived Feature Branches**:
   - Developers create short-lived branches (e.g., `feature/login-page`) from `main` for specific tasks.
   - Branches are kept small, typically lasting a few hours to a couple of days.
3. **Frequent Commits and Merges**:
   - Developers commit changes frequently and merge them back to `main` via pull requests (PRs) after code review.
   - PRs are small to ensure quick reviews and reduce merge conflicts.
4. **CI/CD Integration**:
   - The `.github/workflows/ci.yml` file defines automated pipelines that run tests, linting, and builds on each PR and `main` branch update.
   - Successful builds on `main` trigger deployments to staging or production environments.
5. **Continuous Feedback**:
   - Automated tests and checks in the CI pipeline provide immediate feedback, ensuring code quality.
   - Developers resolve issues quickly to maintain a stable `main` branch.

This workflow supports rapid development, minimizes conflicts, and ensures a reliable codebase, with shadcn/ui components integrated seamlessly for consistent UI development.
