# API Contract — Envelope, Errors, Permissions

Shared contract between **nestjs-fsd-portfolio-template** (API) and **nextjs-fsd-portfolio-template** (BFF admin).

Canonical source: [nestjs-fsd-portfolio-template/docs/contracts/api-envelope.md](https://github.com/devTugu/nestjs-fsd-portfolio-template/blob/main/docs/contracts/api-envelope.md)

When forking, copy `docs/contracts/api-envelope.md` into both repos and keep in sync.

## Frontend-specific notes

- Browser never calls Nest directly; all API traffic goes through `/api/backend/*` (allowlisted BFF proxy).
- Auth routes: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/me`.
- Server env: `API_INTERNAL_URL` must end with `/api/v1`.

## Permission codes (mirror)

See `src/shared/config/permissions.ts` — must match backend `permissions.const.ts`.

## BFF allowlist

Only paths derived from `src/shared/config/api.config.ts` are proxied. See `src/shared/config/bff-allowlist.ts`.
