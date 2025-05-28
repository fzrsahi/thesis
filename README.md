# Fazrul Thesis Project

This is a [Next.js 15](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), serving as the frontend for an **AI Competition Recommendation Tool**. Powered by advanced Large Language Model (LLM) technology, it recommends tailored competitions, providing intuitive interfaces for students, advisors, and administrators.

## Project Overview

The **Fazrul Thesis Project** enhances users' competitive edge by delivering AI-driven competition recommendations. Key features include:
- **Student Interface**: Discover and join competitions aligned with skills and interests.
- **Advisor Interface**: Provide guidance with personalized analytics and recommendations.
- **Admin Interface**: Manage competitions, users, and system configurations.

The project prioritizes modern web development practices, scalability, and a seamless user experience, leveraging a robust tech stack and trunk-based development with strict quality controls.

## Tech Stack & Tools

- **Framework**: [Next.js v15.3.2](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) for accessible, customizable UI
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API (via NextAuth.js SessionProvider and component state)
- **Authentication**: NextAuth.js v4.24.11
- **Database ORM**: Prisma v6.7.0
- **Database**: PostgreSQL (via Docker)
- **Linting & Formatting**: ESLint (Airbnb, Prettier, TypeScript configs), Prettier
- **API Documentation**: Swagger UI (OpenAPI)
- **Animations**: Framer Motion
- **Testing**: Jest, React Testing Library (90% coverage for use cases)
- **Environment**: Node.js v20, npm

## Getting Started

### Prerequisites
- **Node.js v20** (includes npm)
- **Docker** (for PostgreSQL)
- A code editor (e.g., VS Code)

### Installation & Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/fzrsahi/thesis.git
   cd thesis
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add variables like `NEXTAUTH_SECRET`, `DATABASE_URL`, and `SALT_ROUNDS` (refer to `src/app/server/utils/bcrypt/bcrypt.constants.ts` and `src/app/api/auth/[...nextauth]/route.ts`).
   - Use `.env.example` as a template if available.

4. **Start PostgreSQL via Docker**:
   ```bash
   docker-compose up -d
   ```
   This starts a PostgreSQL container with the `thesis` database (default credentials: `root/root`).

5. **Apply Prisma Migrations**:
   ```bash
   npx prisma db push
   ```
   Or, for development with migration history:
   ```bash
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

7. **Create Initial Accounts (Optional)**:
   ```bash
   npm run create:account
   ```
   Runs `src/script/create-account.ts` to initialize default admin and student accounts.

8. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Folder Structure

```
├─ .github/                     # GitHub configurations
│   └─ workflows/              # CI/CD pipelines
│       └─ ci.yml              # Automated testing/deployment pipeline
├─ docker/                     # Docker configurations
│   └─ db/                     # PostgreSQL setup
│       └─ Dockerfile          # Database container config
├─ prisma/                     # Prisma ORM configurations
│   └─ migrations/             # Database migrations
│       └─ 20230501_init.sql  # Initial migration script
├─ public/                     # Static assets
│   └─ favicon.ico             # Application favicon
├─ src/                        # Main source code
│   ├─ app/                    # Next.js 15 App Router
│   │   ├─ (dashboard)/        # Dashboard pages for admins/advisors
│   │   │   └─ page.tsx        # Main dashboard page
│   │   ├─ (home)/             # User-facing pages
│   │   │   └─ page.tsx        # Home page for students
│   │   ├─ api/                # API routes
│   │   │   └─ auth/[...nextauth]/route.ts # NextAuth.js route
│   │   ├─ auth/               # Authentication pages
│   │   │   └─ login/page.tsx  # Login page
│   │   └─ server/             # Server-side logic
│   │       └─ utils/bcrypt/bcrypt.constants.ts # Bcrypt constants
│   ├─ components/             # Reusable React components
│   │   ├─ animations/         # Framer Motion components
│   │   │   └─ fade-in.tsx     # Fade-in animation component
│   │   └─ ui/                 # shadcn/ui and custom components
│   │       └─ button.tsx      # Reusable button component
│   ├─ hooks/                  # Custom React hooks
│   │   └─ use-auth.ts        # Authentication hook with NextAuth.js
│   ├─ lib/                    # Utility functions
│   │   └─ cn.ts               # ClassName utility for shadcn/ui
│   └─ tests/                  # Test files for use cases
│       └─ auth.test.ts        # Tests for authentication use cases
├─ components.json             # shadcn/ui configuration
├─ docker-compose.yml          # Docker Compose for PostgreSQL
├─ next.config.ts              # Next.js 15 configuration
├─ package.json                # Project dependencies
├─ postcss.config.mjs          # Tailwind CSS configuration
├─ tsconfig.json               # TypeScript configuration
└─ README.md                   # Project documentation
```

## Trunk-Based Development Workflow

The project employs **trunk-based development** with strict rules to ensure a stable, high-quality codebase.

1. **Main Branch**:
   - The `main` branch is the central integration point, kept in a production-ready state.
2. **Branch Naming Rules**:
   - Feature branches: `feature/<short-description>` (e.g., `feature/add-recommendation-api`)
   - Bug fixes: `fix/<short-description>` (e.g., `fix/login-error-handling`)
   - Hotfixes: `hotfix/<short-description>` (e.g., `hotfix/auth-token-expiry`)
   - Use lowercase, hyphens, and concise names (e.g., `feature/user-profile-page`).
3. **Short-Lived Feature Branches**:
   - Branches are created from `main` for specific tasks and last hours to 2 days.
   - Small scope minimizes merge conflicts and speeds up reviews.
4. **Conventional Commits**:
   - All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
     - `feat`: New feature (e.g., `feat: add login page UI`)
     - `fix`: Bug fix (e.g., `fix: resolve auth token refresh issue`)
     - `chore`: Maintenance tasks (e.g., `chore: update dependencies`)
     - `test`: Add or update tests (e.g., `test: add auth use case tests`)
     - `docs`: Documentation updates (e.g., `docs: update README`)
     - Format: `<type>(<scope>): <description>` (e.g., `feat(auth): implement login endpoint`).
   - Commits are enforced via CI checks (e.g., using `commitlint`).
5. **Use Case Testing with 90% Coverage**:
   - All use cases (e.g., authentication, recommendation logic) in `src/app/server/` and `src/app/api/` must have corresponding tests in `src/tests/`.
   - Tests use Jest and React Testing Library, targeting **90% code coverage** (enforced via CI with tools like `jest --coverage`).
   - Example: `src/tests/auth.test.ts` covers login, logout, and token refresh use cases.
6. **Frequent Commits and Pull Requests**:
   - Developers commit changes frequently and create small pull requests (PRs) for review.
   - PRs are reviewed promptly to maintain workflow efficiency.
7. **Automated CI/CD**:
   - The `.github/workflows/ci.yml` pipeline runs:
     - ESLint, Prettier, and TypeScript checks.
     - Unit and integration tests with 90% coverage verification.
     - Conventional commit validation.
     - Build and deployment scripts for `main`.
   - Successful `main` builds trigger staging/production deployments.
8. **Database Synchronization**:
   - Prisma migrations in `prisma/migrations/` are applied via `npx prisma db push` or `npx prisma migrate dev` to sync the PostgreSQL database (via `docker-compose.yml`).
   - Scripts like `src/script/create-account.ts` initialize accounts post-migration.
9. **Continuous Feedback**:
   - CI pipeline provides immediate feedback on code quality, test coverage, and commit format.
   - Developers address issues quickly to keep `main` stable.
