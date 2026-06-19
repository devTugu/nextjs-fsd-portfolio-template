# Multi-brand RE Admin + Marketing (Next.js + FSD)

[![CI](https://github.com/devTugu/nextjs-fsd-portfolio-template/actions/workflows/ci.yml/badge.svg)](https://github.com/devTugu/nextjs-fsd-portfolio-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FSD](https://img.shields.io/badge/Architecture-FSD-8B5CF6)](docs/ARCHITECTURE.md)
[![Author](https://img.shields.io/badge/Author-devTugu-181717?logo=github)](https://github.com/devTugu)

Production-ready **Next.js 16** multi-brand **marketing site + admin dashboard** for restaurant/event conglomerates — **Feature-Sliced Design**, **BFF httpOnly auth**, **CSRF**, **MFA/OAuth**, **GDPR flows**, and **RBAC admin UI**.

Pairs with [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) **v3.0.0** (NestJS Clean Architecture API).

![Dashboard overview](docs/gallery/dashboard-overview.png)

---

## Why this template?

| Use case | What you get |
|----------|--------------|
| Restaurant / event group | Multi-brand marketing pages + CMS admin |
| Regulated / enterprise starter | BFF cookies, CSRF, MFA, audit UI, GDPR |
| Client project kickoff | Fork, connect API, white-label in hours |
| Learning FSD + BFF patterns | Real admin — not a toy dashboard demo |

**Security model:** browser never stores JWT in `localStorage`; admin API calls go through `/api/backend/*` with allowlist + httpOnly session cookies.

---

## Quick start

### Backend

```bash
git clone https://github.com/devTugu/nestjs-fsd-portfolio-template.git
cd nestjs-fsd-portfolio-template && npm ci && cp .env.example .env
npm run migration:run && npm run seed && npm run start:dev
```

### Frontend

```bash
git clone https://github.com/devTugu/nextjs-fsd-portfolio-template.git
cd nextjs-fsd-portfolio-template && npm ci && cp .env.example .env.local
```

`.env.local`:

```env
API_INTERNAL_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_BRAND_NAME=Your Company Group
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — **Seed admin:** `admin@example.com` / `Admin123!`

Full setup: [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md) · Full-stack fork: [docs/FORK-GUIDE.md](docs/FORK-GUIDE.md)

---

## Routes (v3)

### Marketing

| Path | Description |
|------|-------------|
| `/` | Hero + About + Brands + News + Contact CTA |
| `/about/us`, `/about/history`, `/about/leadership`, `/about/team` | About pages |
| `/brands`, `/brands/[slug]` | Restaurant/event brands |
| `/news`, `/news/[slug]` | News |
| `/contact` | Contact form |

Legacy redirects: `/blog` → `/news`, `/projects` → `/brands`, `/pricing` → `/contact`

### Admin

| Path | Description |
|------|-------------|
| `/sign-in` | Login (BFF httpOnly cookies) |
| `/dashboard` | Overview stats |
| `/dashboard/brands` | Brands, menu items, events |
| `/dashboard/history` | Company timeline |
| `/dashboard/leadership`, `/dashboard/team` | People |
| `/dashboard/news` | News CRUD |
| `/dashboard/navigation` | Header/footer nav tree |
| `/dashboard/site-settings` | Hero, about, brandColor, SEO |
| `/dashboard/users`, `/roles`, `/permissions` | RBAC |
| `/dashboard/audit-logs`, `/dashboard/security` | Audit + MFA |

---

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Auth | BFF + httpOnly cookies + CSRF |
| Data | TanStack Query v5 |
| Forms | react-hook-form + Zod |
| UI | shadcn/ui + Tailwind CSS 4 |
| Tests | Vitest + Playwright |

---

## Documentation

Start at **[docs/README.md](docs/README.md)**

| Guide | Description |
|-------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | FSD + BFF pattern |
| [Site Guide](docs/SITE-GUIDE.md) | Marketing routes |
| [Admin Guide](docs/ADMIN-GUIDE.md) | Dashboard CRUD |
| [Security](docs/SECURITY.md) | BFF, CSRF, cookies |
| [Deployment](docs/DEPLOYMENT.md) | Production deploy |
| [White Label](docs/WHITE-LABEL.md) | Brand configuration |
| [Fork Guide](docs/FORK-GUIDE.md) | Full-stack fork |
| [ADR](docs/adr/) | Architecture decisions |

---

## Pairing

| Frontend | Backend |
|----------|---------|
| [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) | [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) |
| Port `3000` | Port `3001` |
| **v3.0.0** | **v3.0.0** |

---

## Releases

| Version | Highlights |
|---------|------------|
| **[v3.0.0](CHANGELOG.md)** (current) | Multi-brand marketing + admin CMS (brands, news, history, team) |
| v2.3.0 | Portfolio CMS UI — removed in v3 |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright |
| `bash scripts/fork-check.sh` | Smoke check |

---

## Author

**[devTugu](https://github.com/devTugu)** — Tuguldur Unurtsetseg (`oz.toogii@gmail.com`)

---

## License

[MIT](LICENSE) — Copyright (c) 2026 Tuguldur Unurtsetseg (`devTugu`).
