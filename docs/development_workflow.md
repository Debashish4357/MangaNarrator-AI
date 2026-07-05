# Local Development Workflow Guide

## MangaNarrator AI: Monorepo Architecture & Environments Guide

| Attribute            | Details          |
| :------------------- | :--------------- |
| **Product Name**     | MangaNarrator AI |
| **Document Version** | 1.0.0            |
| **Date**             | June 19, 2026    |

---

## 1. Installation Steps

To initialize your development workspace, execute the following commands in order:

1. **Install pnpm globally (if not already installed):**
   ```bash
   npm install -g pnpm
   ```
2. **Install monorepo package workspaces and link dependencies:**
   ```bash
   pnpm install
   ```
3. **Verify Turborepo configuration:**
   ```bash
   pnpm exec turbo --version
   ```

---

## 2. First-Time Setup Steps

Before launching the applications for the first time, you must initialize the database and execute local schema migrations.

### Step 2.1: Open Docker Desktop

Ensure that the **Docker Desktop** application is running on your Windows host. The command line tools will fail if the background Docker service daemon is inactive.

### Step 2.2: Launch the Database Container

Run this command from the monorepo root to launch PostgreSQL and pgAdmin:

```bash
docker-compose up -d
```

### Step 2.3: Execute Database Migrations

Create your database tables using Prisma:

```bash
pnpm --filter backend exec prisma migrate dev --name init
```

### Step 2.4: Seed the Database

Populate your database with core mock datasets (Default User, Manga titles, and initial StoryEvents):

```bash
pnpm --filter backend exec prisma db seed
```

---

## 3. Daily Development Workflow

Our monorepo uses **Turborepo** to launch both NestJS and Next.js in parallel.

1. **Ensure Docker Daemon is active and PostgreSQL is running:**
   ```bash
   docker-compose up -d
   ```
2. **Launch the development workspace:**
   ```bash
   pnpm dev
   ```
   - _Next.js Frontend:_ Accessible on [http://localhost:3000](http://localhost:3000)
   - _NestJS Backend API:_ Accessible on [http://localhost:3001/api](http://localhost:3001/api)
3. **Shutdown database services at the end of the day:**
   ```bash
   docker-compose down
   ```

---

## 4. Build Workflow

Before deploying or checking production readiness, compile all assets:

1. **Run build check across workspaces:**
   ```bash
   pnpm build
   ```
   - Turborepo builds `@manga-narrator/types`, the backend bundle, and the Next.js static files sequentially, using caching outputs to speed up compile cycles.
2. **Run lint verification across packages:**
   ```bash
   pnpm lint
   ```

---

## 5. Prisma Migration Workflow

Whenever you change the database layout inside [schema.prisma](file:///c:/Users/DELL/OneDrive/Desktop/MangaNarrator%20Ai/apps/backend/prisma/schema.prisma):

1. **Apply the change and create a migration file:**
   ```bash
   pnpm --filter backend exec prisma migrate dev --name <migration_name>
   ```
2. **Open the Prisma Studio GUI client to check data records visually:**
   ```bash
   pnpm --filter backend exec prisma studio
   ```

---

## 6. Troubleshooting Guide

### 6.1 `Error: Environment variable not found: DATABASE_URL`

- **Cause:** The Prisma CLI does not read variables loaded in NestJS modules. It reads directly from `.env` files located inside the working directory.
- **Resolution:** Ensure a `.env` file exists at [apps/backend/.env](file:///c:/Users/DELL/OneDrive/Desktop/MangaNarrator%20Ai/apps/backend/.env) containing `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/manga_narrator?schema=public"`.

### 6.2 `failed to connect to the docker API`

- **Cause:** Docker Desktop is not running.
- **Resolution:** Double-click the Docker Desktop icon on your desktop, wait for the taskbar indicator to turn green, and try running `docker-compose up -d` again.

### 6.3 Port Conflicts (e.g. Address already in use)

- **Cause:** Another service is already using port `3000` (Next.js) or `3001` (NestJS).
- **Resolution:** Stop active processes running on those ports, or override the default port in your environment:
  - In [apps/backend/.env](file:///c:/Users/DELL/OneDrive/Desktop/MangaNarrator%20Ai/apps/backend/.env): Change `PORT=3002`.
  - In [apps/frontend/package.json](file:///c:/Users/DELL/OneDrive/Desktop/MangaNarrator%20Ai/apps/frontend/package.json): Update the dev script line to: `"dev": "next dev -p 3005"`.
