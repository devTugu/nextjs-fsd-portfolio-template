# ADR 008: Regulated Enterprise Roadmap

## Status

Accepted

## Context

The portfolio template pair (NestJS API + Next.js admin) reached production-ready starter quality (~72% enterprise). To serve regulated environments (SOC2-ready foundation) and be reusable across client projects, a phased upgrade was defined.

## Decision

Implement six phases:

| Phase | Focus | Outcome |
|-------|-------|---------|
| 0 | Foundation | Env fail-closed, doc sync, shared API contract |
| 1 | P0 Security | BFF allowlist, RBAC/cache fixes, audit read API |
| 2 | P1 Quality | OTEL observability, test pyramid, CI hardening |
| 3 | P2 Platform | K8s/Helm, CD pipeline, container scanning, runbooks |
| 4 | P2 Identity | Generic OIDC SSO + TOTP MFA |
| 5 | P2 Global | i18n, CSRF, GDPR export/erasure, prompt pack |

**Deploy standard:** Docker + Kubernetes/Helm (cloud-agnostic).

**Identity standard:** Generic OIDC/OAuth2 + TOTP MFA (Keycloak/Auth0/Azure AD compatible).

## Consequences

### Positive

- Fork-once, deploy-anywhere platform
- Compliance artifacts (audit read, retention docs, SOC2 mapping)
- Single source of truth for API envelope and permission codes

### Negative

- Increased operational complexity (Helm, OTEL collector)
- Identity phase adds migration and UX steps (MFA enroll)

## Verification gate

```bash
npm ci && npm run lint && npm run typecheck && npm run test && npm run build
npm run test:e2e  # requires backend
```

See `docs/contracts/api-envelope.md` and backend `docs/ENTERPRISE-PROMPT-PACK.md` (after Phase 5).

## Related

- Backend mirror: `nestjs-fsd-portfolio-template/docs/adr/008-regulated-enterprise-roadmap.md`
- [ADR 006 — BFF httpOnly auth](006-bff-httponly-auth.md)
- [SECURITY.md](../SECURITY.md)
