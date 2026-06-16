# ADR 010: Internationalization (i18n)

## Status

Accepted (scaffold)

## Context

Enterprise deployments may require multiple locales.

## Decision

- Use **next-intl** dependency with message catalogs in `src/shared/i18n/messages/`.
- Supported locales: `en` (default), `mn` (proof of second locale).
- Full `[locale]` route migration is incremental — catalogs and config are ready; UI strings migrate feature-by-feature.

## Consequences

- New features should add keys to `en.json` first, then translate.
- Middleware locale detection can be added when routes move under `app/[locale]/`.
