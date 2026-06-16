# Next.js Portfolio Admin Template

[![CI](https://github.com/devTugu/nextjs-fsd-portfolio-template/actions/workflows/ci.yml/badge.svg)](https://github.com/devTugu/nextjs-fsd-portfolio-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/devTugu/nextjs-fsd-portfolio-template)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

Production-ready **Next.js 16** portfolio CMS admin with **Feature-Sliced Design (FSD)**, **httpOnly BFF auth**, and the companion [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) API.

---

## Architecture

```
src/
├── app/                 # Next.js App Router + BFF routes (/api/auth, /api/backend)
├── widgets/             # Composite UI (sidebar, data-table, dashboard charts)
├── features/            # Auth, CRUD flows, site settings
├── entities/            # Domain models, TanStack Query hooks
├── shared/              # API client, UI kit, config
└── processes/           # Providers, middleware helpers
```

**Import rule:** `app → widgets, features, entities, shared` · `features → entities, shared` (widgets allowed via documented ESLint exception for admin sheets).

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [ADR 006 BFF auth](docs/adr/006-bff-httponly-auth.md), [ADR 007 Dashboard stats](docs/adr/007-dashboard-stats-endpoint.md).

Guides: [Production](docs/PRODUCTION.md) · [Security](docs/SECURITY.md) · [Contributing](docs/CONTRIBUTING.md)

---

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Auth | BFF + httpOnly cookies |
| Data | TanStack Query v5 |
| Tables | TanStack Table v8 |
| Forms | react-hook-form + Zod |
| UI | shadcn/ui + Tailwind CSS 4 |
| Tests | Vitest + Playwright |

---

## Prerequisites

- Node.js 18+
- Running [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) (MySQL + Redis recommended)

---

## Local setup

### 1. Backend

```bash
git clone https://github.com/devTugu/nestjs-fsd-portfolio-template.git
cd nestjs-fsd-portfolio-template
cp .env.example .env
npm install
npm run migration:run
npm run seed
npm run start:dev
```

Default API: `http://localhost:3001/api/v1`

### 2. Frontend

```bash
git clone https://github.com/devTugu/nextjs-fsd-portfolio-template.git
cd nextjs-fsd-portfolio-template
cp .env.local.example .env.local
npm install
npm run dev
```

`.env.local`:

```env
API_INTERNAL_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=Portfolio Admin
```

Open [http://localhost:3000](http://localhost:3000)

**Seed admin:** `admin@example.com` / `Admin123!`

---

## Environment

| Variable | Example | Required |
|----------|---------|----------|
| `API_INTERNAL_URL` | `http://localhost:3001/api/v1` | Yes (server) |
| `NEXT_PUBLIC_APP_NAME` | `Portfolio Admin` | No |

E2E: `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `PLAYWRIGHT_BASE_URL`

---

## Routes

| Path | Description |
|------|-------------|
| `/sign-in` | Login (BFF sets httpOnly cookies) |
| `/dashboard` | Overview stats (single `/admin/dashboard/stats` query) |
| `/dashboard/users` | Users CRUD |
| `/dashboard/roles` | Roles + permission picker |
| `/dashboard/permissions` | Permissions CRUD |
| `/dashboard/projects` | Projects CRUD + media |
| `/dashboard/skills` | Skills CRUD |
| `/dashboard/experiences` | Experiences CRUD |
| `/dashboard/site-settings` | Site settings tabs |
| `/dashboard/contact-messages` | Contact inbox |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint + FSD boundaries |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright (API + Next required) |

---

## CI

GitHub Actions:

1. **quality** — lint, typecheck, vitest, build
2. **e2e** — Playwright on `main` with portfolio backend checkout

---

## Pairing

| Frontend | Backend |
|----------|---------|
| [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) | [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) |
| Port `3000` | Port `3001` (local) |
| BFF httpOnly cookies | JWT issuer |

---

## License

[MIT](LICENSE)
