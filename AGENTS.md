# AGENTS

## Project Architecture
- `src/pages`: route-level UI pages.
- `src/components`: reusable UI and domain components.
- `src/lib`: cross-cutting helpers (`auth`, `feature-flags`, `permissions`, `env`, `utils`).
- `server/services`: backend domain service layer for business logic.
- `server/handlers`: backend request handlers.
- `server/start-functions.ts` + `server/start-serverfns.ts`: Start-style server function boundary.
- `db`: schema, migrations, and seed artifacts.

## Coding Standards
- Keep TypeScript-safe code and avoid `any`.
- Never expose secrets in client code.
- Keep protected and admin-only route checks intact.
- Preserve loading, empty, and error states.
- Keep every page mobile-responsive.

## Safe Extension Rules
- Add routes in `src/pages` and wire in `src/router.tsx`.
- Add role-sensitive features with `permissions.ts` checks.
- Add new backend modules via `server/services` first, then connect through `server/handlers`/`server/start-functions`.
- Add DB models in `db/schema.ts`, mirror in migrations.

## Pre-Completion Checklist
- `npm run lint`
- `npm run build`
- `npm run test`
- Update `README.md` and architecture docs if core structure changes.
