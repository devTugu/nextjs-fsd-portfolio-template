# ADR 002: API Client and Authentication

## Status

**Superseded by [ADR 006 — BFF httpOnly auth](006-bff-httponly-auth.md)**

## Context

The NestJS API returns a wrapped envelope (`{ success, data, message }`), uses JWT access/refresh tokens, and enforces RBAC on the server. The frontend needs a consistent HTTP layer and session handling.

Originally this ADR described direct browser-to-API calls with localStorage token storage.

## Decision (historical)

This approach was replaced by the BFF pattern documented in ADR 006:

- Browser calls `/api/backend/*` (same-origin BFF proxy)
- JWT stored in **httpOnly cookies** only
- `API_INTERNAL_URL` is server-only (never `NEXT_PUBLIC_*`)
- Axios uses `withCredentials: true`; no manual Bearer header

For current implementation details, see:

- [ADR 006 — BFF httpOnly auth](006-bff-httponly-auth.md)
- [docs/ARCHITECTURE.md](../ARCHITECTURE.md)
- [docs/SECURITY.md](../SECURITY.md)

## Consequences

See ADR 006 for current trade-offs.
