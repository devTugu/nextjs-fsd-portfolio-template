# Production Deployment Guide

## Overview

Deploy the **Next.js frontend** (e.g. Vercel) separately from the **NestJS Portfolio API** ([nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template)). The frontend uses a **BFF layer** — the browser never calls Nest directly.

## Prerequisites

- Node.js 18+
- Production NestJS API with HTTPS (reachable from Next server)
- Redis enabled on API for multi-instance deployments (`REDIS_ENABLED=true`)

## Environment variables

| Variable | Production example | Scope |
|----------|-------------------|-------|
| `API_INTERNAL_URL` | `https://api.yourdomain.com/api/v1` | **Server only** — BFF → Nest |
| `NEXT_PUBLIC_APP_NAME` | `Portfolio Admin` | Browser |

> Never expose JWT secrets or `API_INTERNAL_URL` via `NEXT_PUBLIC_*`.

## Backend requirements

On the API:

```
CORS_ORIGIN=https://your-app.vercel.app
REDIS_ENABLED=true
REDIS_URL=redis://...
SWAGGER_ENABLED=false
NODE_ENV=production
```

Redis is required for shared rate limiting, token blacklist, and permission cache across API replicas. See backend `docs/PRODUCTION.md`.

## Vercel deployment

```bash
npm i -g vercel
vercel link
vercel env add API_INTERNAL_URL
vercel env add NEXT_PUBLIC_APP_NAME
vercel --prod
```

### Build settings

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build command | `npm run build` |
| Node version | 20.x |

## Auth and cookies

- JWTs in **httpOnly** cookies (`accessToken`, `refreshToken`).
- `session=1` cookie for middleware route protection.
- All admin API traffic: browser → `/api/backend/*` → Nest with Bearer from cookie.

## Security headers

[`next.config.ts`](../next.config.ts) sets CSP (`default-src 'self'; connect-src 'self'`) plus standard hardening headers.

## Pre-release checklist

- [ ] `API_INTERNAL_URL` reachable from Vercel/server runtime
- [ ] API `CORS_ORIGIN` matches Next origin
- [ ] API Redis enabled in production
- [ ] `npm run build` succeeds with production env
- [ ] Smoke: login → dashboard stats → portfolio CRUD
- [ ] CI green: lint, typecheck, test, build

## Verification

```bash
npm ci
npm run lint
npm run typecheck
npm run test
API_INTERNAL_URL=https://api.yourdomain.com/api/v1 npm run build
```

## E2E (recommended)

```bash
npm run test:e2e
```

Requires API + Next running (see `scripts/ci-e2e.sh`).
