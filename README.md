# DevTasks Manager

A full-stack task management application built with Next.js, TypeScript, and a modern React ecosystem. This project was designed as a portfolio piece to demonstrate real-world development patterns — not just a simple CRUD demo, but a structured, scalable app with authentication, a Kanban workflow, and a data-driven dashboard.

## Project Overview

DevTasks Manager is a productivity platform where users can create, organize, and track their tasks through a Kanban-style board. It supports tag-based categorization, priority levels, status workflows, and an overview dashboard that surfaces task statistics at a glance. The app is fully authenticated, so each user has their own workspace.

## Key Features

- **User authentication** — sign up and log in with secure credential-based auth
- **Task management** — create, edit, delete, and organize tasks with priority and status
- **Tag system** — color-coded tags for flexible task categorization
- **Kanban board** — drag-and-drop columns to move tasks through workflow stages
- **Dashboard overview** — stat cards, progress bars, and breakdowns by status and priority
- **Form validation** — schema-based validation with real-time feedback using Zod and React Hook Form
- **Responsive layout** — clean interface that works across screen sizes
- **Toast notifications** — contextual feedback for user actions via Sonner

## Tech Stack

### Frontend

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/) — animations and transitions
- [Lucide React](https://lucide.dev/) — icon library
- [Radix UI](https://www.radix-ui.com/) — accessible primitives (dialog, dropdown, select, toast, tooltip)
- [dnd-kit](https://dndkit.com/) — drag-and-drop for the Kanban board

### Backend

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma ORM](https://www.prisma.io/) (v5.22)

### Database

- [PostgreSQL](https://www.postgresql.org/)

### Authentication

- [Auth.js / NextAuth v5](https://next-auth.js.org/) with the Prisma adapter

### Validation

- [Zod](https://zod.dev/) — schema validation
- [React Hook Form](https://react-hook-form.com/) — form state management
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers) — Zod integration

### Styling

- [Tailwind CSS v4](https://tailwindcss.com/)
- [class-variance-authority](https://cva.style/) — variant-based component styling
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) — conditional class merging
- [clsx](https://github.com/lukeed/clsx) — utility for className composition

### Tooling

- ESLint + Prettier
- PostgreSQL + Prisma migrations

## What I Focused On

This project was an opportunity to practice building something with intention rather than speed. A few things I kept in mind throughout:

- **Project structure** — feature-based organization (`features/tasks`, `features/tags`, `features/dashboard`) instead of grouping by file type. Each feature owns its components and hooks, which keeps things modular as the codebase grows.
- **Reusable components** — a shared `ui/` layer with generic, composable pieces (Button, Dialog, Input, Badge) built on top of Radix primitives. Components are variant-driven through CVA so they stay flexible without becoming bloated.
- **Professional Git workflow** — each phase of development was built on its own feature branch and merged cleanly into main. Commit messages are descriptive and scoped.
- **Real-world patterns** — server/client component boundaries in Next.js App Router, API route validation with Zod, Prisma schema design with relations, and authenticated API endpoints.
- **Incremental development** — the project was built in deliberate phases, starting from foundation and layering features on top. This mirrors how real products evolve.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # REST endpoints (tasks, tags, auth)
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/
│   ├── common/           # Shared components (task-card, etc.)
│   ├── layout/           # App shell, sidebar, header
│   └── ui/               # Generic UI primitives (button, dialog, input, badge)
├── features/
│   ├── dashboard/        # Dashboard components and data visualization
│   ├── tags/             # Tag CRUD components and hooks
│   └── tasks/            # Task CRUD, Kanban board, and hooks
├── lib/                  # Prisma client, auth config, utilities
├── providers/            # React context providers
├── types/                # Shared TypeScript types
└── validators/           # Zod schemas for form and API validation
prisma/
└── schema.prisma         # Database schema with User, Task, Tag models
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance (local or remote)

### Setup

```bash
# Clone the repository
git clone https://github.com/ArthurCavalcanti/DevTaskManager.git
cd DevTaskManager

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

> Do not commit your `.env` file. It is already included in `.gitignore`.

## Development Workflow

This project was built incrementally across feature branches:

1. **Project Foundation** — Next.js setup, Prisma schema, auth configuration, base layout
2. **Task & Tag Management** — full CRUD for tasks and tags, form validation, API routes
3. **Kanban Workflow** — drag-and-drop board using dnd-kit, task reordering, column-based status flow
4. **Dashboard Overview** — stat cards, progress bars, breakdowns by status and priority
5. **UI/UX Polish** — upcoming: animations, responsive refinements, visual consistency pass

Each phase was developed on a dedicated branch, reviewed, and merged into `main` before moving on.

## Roadmap

- [ ] UI/UX polish — animations, transitions, and responsive refinements
- [ ] Advanced filtering — filter tasks by tag, priority, status, and date range
- [ ] Dashboard charts — richer data visualizations for task trends
- [ ] Task search — full-text search across tasks
- [ ] Deployment — production deployment with environment configuration
- [ ] Testing — unit and integration test coverage

## Screenshots

> Screenshots will be added after the UI polish phase.

## Status

This project is currently in **active development**. Core functionality is complete and working. The next phase focuses on visual polish and deployment preparation.

## Author

**Arthur Cavalcanti**
[GitHub](https://github.com/ArthurCavalcanti)

## License

This project is for portfolio and educational purposes.
