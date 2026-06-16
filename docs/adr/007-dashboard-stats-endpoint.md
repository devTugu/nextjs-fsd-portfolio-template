# ADR 007: Dashboard Stats Endpoint

## Status

Accepted

## Context

The admin dashboard overview previously issued 7+ parallel list requests (`page=1&limit=1`) to derive totals for users, roles, projects, skills, experiences, and contact messages by status. This increased latency and load on list endpoints.

## Decision

Add a dedicated backend endpoint:

```
GET /api/v1/admin/dashboard/stats
```

Implemented as `GetDashboardStatsUseCase` with parallel repository count queries. The use case filters returned fields based on the caller's `permissionCodes` (e.g. `USER_READ`, `PROJECT_READ`, `CONTACT_READ`).

Frontend consumes a single `useDashboardStats()` TanStack Query hook (`staleTime: 30s`).

## Consequences

### Positive

- One round-trip for dashboard cards and charts
- Permission-aware payload — no leaking counts for forbidden modules
- Clear separation between list pagination and aggregate stats

### Negative

- Stats endpoint must be updated when new admin modules are added
- Count logic duplicates list repository `total` semantics (acceptable for template scope)

## Related

- Backend: `src/application/dashboard/use-cases/get-dashboard-stats.use-case.ts`
- Frontend: `src/entities/dashboard/api/queries.ts`
