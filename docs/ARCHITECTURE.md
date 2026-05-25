# Architecture

## System Overview
VibeStack OS is a modular starter: route-driven frontend, replaceable auth pattern, service/server separation, and Turso/Drizzle-ready data layer.

## Frontend
- React + TypeScript + Vite.
- Route map in `src/App.tsx`.
- Shared layout in `src/components/layout/Shell.tsx`.
- Reusable primitives in `src/components/ui`.

## Backend/Service Shape
- `server/services/*`: domain logic modules.
- `server/handlers/*`: transport-neutral handler contracts (`status` + `body`).
- `server/start-bridge.ts`: Start-style boundary grouped by domain.
- `server/app.ts` + `server/index.ts`: app definition and runtime bootstrap.

## Auth and Roles
- Session mock in `src/lib/auth.tsx`.
- Route guards use `isAuthenticated` and `hasRole` from `src/lib/permissions.ts`.

## Data Layer
- Placeholder Turso/Drizzle artifacts in `db/schema.ts`, `db/migrations`, `db/seed.ts`.
- Required tables listed and ready for real migration wiring.

## AI Module
- Feature flag in `src/lib/feature-flags.ts`.
- Provider-agnostic orchestration in `server/services/ai.service.ts`.
- Assistant route at `/ai/assistant`.

## Deployment
- `vercel.json` configured for Vite deployment baseline.
