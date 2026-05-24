# VibeStack OS

VibeStack OS is a mobile-responsive full-stack starter template for shipping SaaS and AI products faster, with a strong baseline for auth, admin, docs, and modular architecture.

## Stack
- React, TypeScript, Vite + TanStack Router + Tailwind utility layer
- Express API + Drizzle ORM + LibSQL/Turso
- Route-based app shell with protected/admin guards
- ESLint, Prettier, Vitest, Playwright

## Current Feature Coverage
- Public pages: landing, pricing, about, contact, privacy, terms, status
- Auth pages: credential signup/login/logout with backend sessions (`sessions` table)
- Protected pages: dashboard, profile, settings (DB-backed)
- Notes workspace: user-scoped saved notes with pin/update/delete workflows (`/notes`)
- Example CRUD page: create, rename, delete, publish/unpublish (`/items`) via API
- Admin pages: dashboard, users (including role change), audit logs, settings (persisted), content publish/unpublish
- AI page: feature-flagged assistant with persisted history (`ai_messages`)
- AI provider metadata endpoint with configurable provider/model defaults and prompt length policy
- AI guardrails with prompt-policy blocking and sensitive-token redaction
- AI provider allow-list policy (`AI_ALLOWED_PROVIDERS`) enforced server-side and reflected in UI
- AI policy escalation webhook hook for blocked events (`AI_POLICY_WEBHOOK_URL`)
- UX states: loading, empty, error boundary fallback, toast notifications
- Shared UI component primitives (`Card`, `Button`, `Input`, `Textarea`, `Select`, `SectionHeader`, `Pill`) used across core modules
- SEO/public metadata files and core project governance docs

## Quick Start
```bash
npm install
npm run dev:full
```

Demo credentials:
- User: `user@vibestack.dev` / `user12345`
- Admin: `admin@vibestack.dev` / `admin12345`

## Quality Commands
```bash
npm run lint
npm run build
npm run test
npm run test:e2e  # includes landing smoke + signup auth flow
```

## Database Workflow
1. Set `.env` from `.env.example` with `DATABASE_URL` and `DATABASE_AUTH_TOKEN` if using hosted Turso.
2. Migrations are in `db/migrations/0001_init.sql` and auto-bootstrapped by API server on startup.
3. Seed demo data:
```bash
npm run db:seed
```

Optional Drizzle tasks:
```bash
npm run db:generate
npm run db:migrate
```

## Environment Variables
Required baseline keys in `.env`:
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN`
- `SESSION_SECRET`
- `APP_URL`
- `AI_ENABLED`
- `AI_PROVIDER`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`

## Deployment
Vercel is the default deployment target.
- `vercel.json` contains baseline config.
- Build command: `npm run build`
- Start local production preview: `npm run preview`
- Ensure production env vars are configured before first deploy.

## Customizing This Template
- Replace `src/pages/items.tsx` and related CRUD handlers to map your core domain model.
- Keep route protection gates in `src/router.tsx` (`Protected`, `AdminOnly`, `FeatureFlagGate`).
- Extend schema in `db/schema.ts` and migrations in `db/migrations/`.
- Add/adjust backend behavior in `server/services/*` and route handlers in `server/handlers/*`.
- Keep docs current when architecture or module boundaries change.

## PRD Audit
- Full live audit trail and evidence matrix: `docs/prd.md` (section `16. Implementation Audit Log`).
