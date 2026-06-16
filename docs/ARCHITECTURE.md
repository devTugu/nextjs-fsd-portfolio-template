# Architecture

## Overview

This template is a **Feature-Sliced Design (FSD)** admin console. It consumes a versioned NestJS RBAC API through a **Backend-for-Frontend (BFF)** layer. JWT tokens never reach browser JavaScript.

## Layer responsibilities

| Layer | Responsibility | Examples |
|-------|----------------|----------|
| `app/` | Routing, layouts, BFF API routes | `app/dashboard/users/page.tsx`, `app/api/auth/login/route.ts` |
| `widgets/` | Reusable composite blocks | `data-table`, `admin-form-sheet`, `app-sidebar` |
| `features/` | User scenarios and flows | `auth`, `users`, `roles`, `permissions` |
| `entities/` | Business nouns + API | `user`, `role`, `permission` hooks and types |
| `shared/` | Framework-agnostic utilities | API client, UI kit, config, hooks |
| `processes/` | App-wide cross-cutting | providers, route constants, middleware |

## Data flow

```
Page (app)
  → Feature UI (table, sheet)
    → Entity hook (TanStack Query)
      → shared/api (Axios → /api/backend/*)
        → BFF proxy (allowlisted paths)
          → NestJS /api/v1/* (Bearer from httpOnly cookie)
```

Auth routes bypass the backend proxy:

```
Browser → /api/auth/login|refresh|logout|me → NestJS /auth/*
```

## Key widgets

### `AdminFormSheet`

Right-side sheet shell with sticky header, scrollable body, and footer (Cancel / Save). Used by all create/edit flows.

### `PermissionPicker`

Grouped permission selector (Users / Roles / Permissions) with search, select-all per group, and selection summary.

### `DataTable`

Server-driven pagination via URL search params (`?page&limit&search`). Toolbar debounces search without navigation loops.

## Auth flow

1. User signs in via `POST /api/auth/login` (BFF) → Nest validates credentials → BFF sets **httpOnly** `accessToken` + `refreshToken` cookies and a non-httpOnly `session=1` hint.
2. Axios calls `/api/backend/*` with `withCredentials: true` — no Bearer header in JavaScript.
3. BFF proxy attaches `Authorization: Bearer` from the httpOnly access cookie server-side.
4. On `401`, client calls `/api/auth/refresh` once; on failure, redirect to `/sign-in`.
5. `TokenRefreshScheduler` proactively refreshes before expiry.
6. `AuthGuard` wraps dashboard layout; loads `/api/auth/me` for `permissionCodes`.
7. Next.js middleware checks `session=1` for route redirects; real auth enforced by AuthGuard + API.

See [ADR 006 — BFF httpOnly auth](adr/006-bff-httponly-auth.md).

## RBAC gating

`useAuthPermissions().can(code)` checks:

1. User has `SUPER_ADMIN` role → allow all
2. Else `permissionCodes` from `/auth/me` must include the code

## File naming

- Components: `PascalCase.tsx` (`user-manage-sheet.tsx` exports `UserManageSheet`)
- Hooks/utils: `kebab-case.ts`
- One primary export per file where possible

## Related ADRs

- [001 — Feature-Sliced Design](adr/001-feature-sliced-design.md)
- [002 — API client and auth](adr/002-api-client-and-auth.md) (superseded by 006)
- [006 — BFF httpOnly auth](adr/006-bff-httponly-auth.md)
- [007 — Dashboard stats](adr/007-dashboard-stats-endpoint.md)
- [008 — Regulated enterprise roadmap](adr/008-regulated-enterprise-roadmap.md)
