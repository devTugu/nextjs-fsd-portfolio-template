# ADR 006: BFF httpOnly Cookie Authentication

## Status

Accepted

## Context

Storing JWT access tokens in `localStorage` exposes sessions to XSS. The portfolio admin template pairs a Next.js frontend with a NestJS API and needs enterprise-grade session handling without exposing tokens to client JavaScript.

## Decision

Implement a **Backend-for-Frontend (BFF)** layer in Next.js App Router:

| Route | Purpose |
|-------|---------|
| `POST /api/auth/login` | Proxy Nest login; set `httpOnly` `accessToken` + `refreshToken` cookies |
| `POST /api/auth/refresh` | Rotate access token from refresh cookie |
| `POST /api/auth/logout` | Revoke tokens and clear cookies |
| `GET /api/auth/me` | Hydrate session for client stores |
| `/api/backend/[...path]` | Same-origin API proxy; attaches Bearer from access cookie |

Additional cookies:

- `session=1` — non-httpOnly hint for Next.js middleware (not a JWT)

Browser Axios client uses `baseURL: '/api/backend'` with `withCredentials: true`. Server-only `API_INTERNAL_URL` points to Nest.

## Security headers

`next.config.ts` sets CSP: `default-src 'self'; connect-src 'self'` so the browser cannot call Nest directly.

## Consequences

### Positive

- JWTs never touch `localStorage`
- Single origin for admin API calls simplifies CORS
- Refresh flow centralized in BFF routes

### Negative

- Next.js server required for auth (not static-only hosting)
- Multipart uploads must flow through BFF proxy
- Local dev needs `API_INTERNAL_URL` in `.env.local`

## Related

- [docs/SECURITY.md](../SECURITY.md)
- [docs/adr/002-api-client-and-auth.md](./002-api-client-and-auth.md)
