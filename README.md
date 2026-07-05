# MangaNarrator AI Monorepo

Production-grade monorepo setup for MangaNarrator AI, managed with **pnpm workspaces** and **Turborepo**.

## Project Structure

```
manga-narrator-ai/
├── apps/
│   ├── frontend/         # Next.js App Router placeholder
│   └── backend/          # NestJS Web Gateway placeholder
│
├── packages/
│   ├── tsconfig/         # Shared TypeScript compiler configurations
│   ├── eslint-config/    # Shared linting rule structures
│   └── types/            # Shared TS model types
│
├── docs/                 # System and API specifications
├── package.json          # Root orchestration package
├── pnpm-workspace.yaml   # Workspace registry
└── turbo.json            # Turborepo task pipeline rules
```

## Running Dev Server

To run all apps in development mode:

```bash
pnpm install
pnpm dev
```

## Core Task Pipelines

- Build all workspaces: `pnpm build`
- Lint all code: `pnpm lint`
- Format files: `pnpm format`
