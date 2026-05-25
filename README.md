# VibeStack OS

Mobile-responsive full-stack starter for shipping SaaS and AI products faster — auth, admin, CRUD, AI assistant, and guardrails out of the box.

## Live links

| Resource | URL |
|----------|-----|
| **Deployed template (app)** | https://vibestack-starter-01.vercel.app/ |
| **Vibe coding workshop (slides)** | https://presentation-vibestack-starter-01.vercel.app |

**Demo logins** (on the deployed app):

| Role | Email | Password |
|------|-------|----------|
| User | `user@vibestack.dev` | `user12345` |
| Admin | `admin@vibestack.dev` | `admin12345` |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, TypeScript, Vite, TanStack Router, Tailwind |
| Backend | Express, server functions / handlers |
| Database | Drizzle ORM + Turso (LibSQL) |
| Hosting | Vercel |

---

## Quick start

```bash
git clone https://github.com/sayyidkhan/vibestack-starter-01.git
cd vibestack-starter-01
npm install
cp .env.example .env   # add DATABASE_URL, DATABASE_AUTH_TOKEN, etc.
npm run dev
```

`npm run dev` runs the full stack locally (API + Vite). Default: http://localhost:5174 (or the port Vercel dev assigns).

---

## What’s included

**Public** — landing, pricing, about, contact, privacy, terms, status  

**Auth** — signup, login, logout, session cookies, hashed passwords (scrypt)  

**User (protected)** — dashboard, profile, settings, notes (`/notes`)  

**CRUD example** — items with publish/unpublish (`/items`)  

**Admin** — users (search + role change), audit logs, settings, content, feature flags  

**AI** — feature-flagged assistant with history, provider policy, guardrails  

**UX** — loading/empty/error states, toasts, mobile-first shell with Public / User / Admin nav modes  

---

## Project layout

```
src/pages/          Route screens
src/components/     UI + layout (Shell, admin, shared)
src/lib/            Auth, API client, permissions
server/services/    Business logic
server/handlers/    HTTP handlers
db/                 Schema, migrations, seed
presentation/       Vibe coding Slidev deck (separate deploy)
docs/               Architecture, guardrails, PRD, security
```

---

## Commands

```bash
npm run lint          # ESLint
npm run build         # Production build
npm run test          # Vitest unit tests
npm run test:e2e      # Playwright (auth, admin, security)
npm run db:seed       # Seed Turso with demo users + flags
```

---

## Environment variables

Copy `.env.example` → `.env`. Minimum for local dev:

- `DATABASE_URL` — Turso/libSQL URL (or `file:local.db` for local SQLite)
- `DATABASE_AUTH_TOKEN` — Turso token (empty for local file)
- `SESSION_SECRET` — session signing secret
- `APP_URL` — e.g. `http://localhost:5174`

See `.env.example` for AI keys and optional tuning (`AI_ENABLED`, rate limits, etc.).

---

## Database

1. Create a [Turso](https://turso.tech) database or use `file:local.db` locally.
2. API bootstraps migrations on startup (`db/migrations/0001_init.sql`).
3. Seed demo data:

```bash
npm run db:seed
```

Optional Drizzle CLI:

```bash
npm run db:generate
npm run db:migrate
```

Passwords in the DB are **hashed** (not plain text). Demo accounts use a fixed salt; signups use per-user salts.

---

## Deployment (Vercel)

**Main app** — root of repo, already wired:

- Build: `npm run build`
- Output: `dist` + server bundle
- Config: `vercel.json`

**Presentation slides** — separate Vercel project, root directory `presentation/`:

```bash
cd presentation
npm install
vercel --prod
```

See [presentation/README.md](./presentation/README.md).

---

## Workshop slides

Eight-slide, hands-on **vibe coding** deck for teaching this template:

- **Live:** https://presentation-vibestack-starter-01.vercel.app
- **Edit:** `presentation/slides.md`
- **Present locally:** `cd presentation && npm run dev`

---

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/README.md](./docs/README.md) | Doc index |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System overview |
| [docs/GUARDRAILS.md](./docs/GUARDRAILS.md) | Agent & safety rules |
| [docs/SECURITY.md](./docs/SECURITY.md) | Security notes |
| [docs/prd.md](./docs/prd.md) | PRD + implementation audit |

Agent entry points: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`

---

## Customizing the template

1. Replace example CRUD (`src/pages/items.tsx`, `server/services/*`) with your domain.
2. Keep route guards in `src/router.tsx` (`Protected`, `AdminOnly`, `FeatureFlagGate`).
3. Extend `db/schema.ts` + add migrations.
4. Update docs when boundaries change.

---

## PRD & audit

Full product spec and evidence matrix: [docs/prd.md](./docs/prd.md) (section 16 — Implementation Audit Log).
