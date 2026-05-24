# VibeStack OS — Full Project Canvas

## 1. Project Identity

**Project name:** VibeStack OS
**Repo name:** `vibestack-os`
**Product type:** Modern full-stack app starter template
**Tagline:** The modern starter repo for shipping any app with AI, auth, admin, database, docs, SEO, and guardrails built in.

## 2. Core Idea

VibeStack OS is a reusable full-stack starter app that contains the foundations every modern app should have.

It is not built for one specific use case. It is a template that can be reused to build:

* SaaS products
* AI tools
* Internal tools
* Learning platforms
* Marketplaces
* CRM apps
* Finance trackers
* Community apps
* Agentic AI apps
* Admin dashboards

The goal is simple:

> Start every new app from a production-ready base instead of rebuilding auth, admin, docs, database, SEO, and guardrails from scratch.

## 3. Tech Stack

Frontend:

* React
* TanStack Router / TanStack Start
* TypeScript
* TailwindCSS
* shadcn/ui

Backend:

* TanStack Start backend/server functions
* API routes where needed
* Modular service layer

Database:

* Turso / LibSQL
* Drizzle ORM preferred
* Migration support
* Seed script

Deployment:

* Vercel

AI:

* Optional AI module
* Provider-agnostic wrapper
* Should support OpenAI, Gemini, Claude, or local models later

Testing:

* Vitest
* Playwright

Code Quality:

* ESLint
* Prettier
* TypeScript strict mode

## 4. Core App Features

### Public Features

* Landing page
* Pricing placeholder page
* About page
* Contact page
* Privacy page
* Terms page
* Status page
* robots.txt
* sitemap.xml
* manifest.json
* humans.txt
* llms.txt
* llms-full.txt

### Auth Features

* Sign up
* Login
* Logout
* Session handling
* Protected routes
* Role-based access control
* User role
* Admin role

### User Features

* User dashboard
* Profile page
* Settings page
* Example CRUD feature
* Notes or saved items
* Activity history
* Toast notifications
* Loading states
* Error states
* Empty states

### Admin Features

* Admin dashboard
* View all users
* Change user role
* Manage app settings
* View audit logs
* Manage example items
* Publish/unpublish sample content

### AI Features

AI should be optional and controlled by a feature flag.

AI module should include:

* AI assistant page
* Chat interface
* Prompt templates
* AI action examples
* Provider wrapper
* Message history table
* Safe prompt handling
* Basic AI usage logging

The AI system should be easy to replace with:

* OpenAI
* Claude
* Gemini
* Local models
* Custom gateway

## 5. Must-Have Repo Files

### Root Documentation

Generate these files:

```txt
README.md
AGENTS.md
GUARDRAILS.md
ARCHITECTURE.md
PROJECT_VISION.md
ROADMAP.md
CHANGELOG.md
CONTRIBUTING.md
SECURITY.md
LICENSE
.env.example
.gitignore
```

### AI / Coding Agent Files

Generate these files:

```txt
AGENTS.md
CLAUDE.md
GEMINI.md
CURSOR.md
.cursorrules
.cursor/rules/project.mdc
.github/copilot-instructions.md
```

### SEO / Web Metadata Files

Generate these files:

```txt
public/robots.txt
public/sitemap.xml
public/manifest.json
public/humans.txt
public/llms.txt
public/llms-full.txt
```

### App Quality Files

Generate these files:

```txt
eslint.config.js
prettier.config.js
tsconfig.json
vitest.config.ts
playwright.config.ts
package.json
vercel.json
```

### CI/CD Files

Generate these files:

```txt
.github/workflows/ci.yml
.github/workflows/deploy-preview.yml
```

### Database Files

Generate these files:

```txt
db/schema.ts
db/migrations/
db/seed.ts
```

## 6. Suggested Folder Structure

```txt
vibestack-os/
├── app/
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── dashboard.tsx
│   │   ├── profile.tsx
│   │   ├── settings.tsx
│   │   ├── admin/
│   │   │   ├── index.tsx
│   │   │   ├── users.tsx
│   │   │   ├── audit-logs.tsx
│   │   │   └── settings.tsx
│   │   ├── ai/
│   │   │   └── assistant.tsx
│   │   ├── privacy.tsx
│   │   ├── terms.tsx
│   │   ├── contact.tsx
│   │   └── status.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── ai/
│   │   └── shared/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── env.ts
│   │   ├── permissions.ts
│   │   ├── feature-flags.ts
│   │   └── utils.ts
│   ├── services/
│   │   ├── user.service.ts
│   │   ├── admin.service.ts
│   │   ├── audit.service.ts
│   │   ├── example.service.ts
│   │   └── ai.service.ts
│   ├── server/
│   │   ├── auth.server.ts
│   │   ├── users.server.ts
│   │   ├── admin.server.ts
│   │   ├── ai.server.ts
│   │   └── example.server.ts
│   └── styles/
│       └── globals.css
├── db/
│   ├── schema.ts
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.json
│   ├── humans.txt
│   ├── llms.txt
│   └── llms-full.txt
├── .cursor/
│   └── rules/
│       └── project.mdc
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy-preview.yml
│   └── copilot-instructions.md
├── AGENTS.md
├── GUARDRAILS.md
├── CLAUDE.md
├── GEMINI.md
├── CURSOR.md
├── ARCHITECTURE.md
├── PROJECT_VISION.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── vitest.config.ts
├── playwright.config.ts
└── vercel.json
```

## 7. Database Schema

Use Turso / LibSQL with Drizzle ORM.

Required tables:

```txt
users
sessions
accounts
roles
user_profiles
app_settings
audit_logs
example_items
ai_messages
feature_flags
```

### Table Responsibilities

`users`

* Stores user identity
* Email
* Name
* Role
* Created date

`sessions`

* Stores active login sessions

`accounts`

* Stores auth provider account data if needed

`roles`

* Stores role definitions such as user/admin

`user_profiles`

* Stores public/private user profile data

`app_settings`

* Stores app-wide settings controlled by admins

`audit_logs`

* Stores admin/user activity logs

`example_items`

* Sample CRUD model to show how future apps can add domain features

`ai_messages`

* Stores optional AI assistant messages

`feature_flags`

* Controls optional features such as AI assistant

## 8. Required Documentation Content

### README.md

Should include:

* What the project is
* Tech stack
* Features
* Setup instructions
* Environment variables
* Database setup
* Seed instructions
* Development command
* Test command
* Deployment instructions
* How to customize the template

### AGENTS.md

Should include:

* Instructions for AI coding agents
* Project architecture summary
* Coding standards
* Where to place files
* How to modify routes
* How to add database tables
* How to add features safely
* Commands to run before finishing

### GUARDRAILS.md

Should include:

* Do not break auth
* Do not expose secrets
* Do not skip validation
* Do not bypass role checks
* Do not hardcode API keys
* Do not create unprotected admin routes
* Always handle loading/error/empty states
* Always keep mobile responsiveness
* Always update docs when architecture changes

### ARCHITECTURE.md

Should include:

* System overview
* Frontend architecture
* Backend architecture
* Database architecture
* Auth flow
* Admin flow
* AI module architecture
* Deployment architecture

### PROJECT_VISION.md

Should include:

* Why this exists
* Who it is for
* What apps it should help build
* Long-term direction

### ROADMAP.md

Should include:

* MVP
* v1
* v2
* Future modules

### SECURITY.md

Should include:

* How to report vulnerabilities
* Security principles
* Secret management
* Auth protection
* Admin route protection

### CONTRIBUTING.md

Should include:

* Branching rules
* Commit style
* Pull request rules
* Local setup
* Testing expectations

## 9. UX Requirements

The app should feel:

* Clean
* Fast
* Modern
* Mobile-first
* Premium but not overdesigned
* Easy to customize

Required UI patterns:

* Responsive navbar
* Mobile bottom/nav menu or collapsible sidebar
* Dashboard cards
* Admin tables
* Forms with validation
* Toasts
* Loading skeletons
* Empty states
* Error boundaries
* Confirmation dialogs
* Settings forms

## 10. Environment Variables

`.env.example` should include:

```txt
DATABASE_URL=
DATABASE_AUTH_TOKEN=
SESSION_SECRET=
APP_URL=http://localhost:3000
AI_ENABLED=false
AI_PROVIDER=openai
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

## 11. Feature Flags

The app should support feature flags.

Initial feature flags:

```txt
AI_ASSISTANT
ADMIN_PANEL
AUDIT_LOGS
EXAMPLE_CRUD
USER_SETTINGS
```

## 12. Build Prompt

Use this prompt with a coding agent:

```md
Build a production-ready, mobile-responsive full-stack starter template called VibeStack OS.

VibeStack OS is a reusable modern app template for quickly building SaaS apps, AI tools, internal tools, admin dashboards, learning platforms, marketplaces, CRMs, finance trackers, community apps, and agentic AI products.

The app should include the basic foundations every modern app needs: auth, users, admin, role-based access, database, dashboard, settings, example CRUD, optional AI assistant, docs, SEO files, agent instruction files, guardrails, CI/CD, testing config, and Vercel deployment support.

Tech stack:
- React
- TypeScript
- TanStack Router / TanStack Start
- TanStack-supported backend/server functions
- TailwindCSS
- shadcn/ui
- Turso / LibSQL
- Drizzle ORM
- Vercel
- Vitest
- Playwright
- ESLint
- Prettier

Core requirements:
1. Mobile-responsive UI.
2. Landing page.
3. Sign up, login, logout.
4. Session handling.
5. User and admin roles.
6. Protected routes.
7. User dashboard.
8. Admin dashboard.
9. User profile page.
10. User settings page.
11. Admin user management.
12. Admin app settings.
13. Audit logs.
14. Example CRUD feature.
15. Optional AI assistant module.
16. Feature flag system.
17. Loading states.
18. Error states.
19. Empty states.
20. Toast notifications.
21. Reusable layout components.
22. Vercel deployment config.
23. Turso database setup.
24. Drizzle schema and migrations.
25. Seed script.
26. README and full documentation.

Generate these root documentation files:
- README.md
- AGENTS.md
- GUARDRAILS.md
- ARCHITECTURE.md
- PROJECT_VISION.md
- ROADMAP.md
- CHANGELOG.md
- CONTRIBUTING.md
- SECURITY.md
- LICENSE
- .env.example
- .gitignore

Generate these AI/coding agent files:
- AGENTS.md
- CLAUDE.md
- GEMINI.md
- CURSOR.md
- .cursorrules
- .cursor/rules/project.mdc
- .github/copilot-instructions.md

Generate these SEO/web files:
- public/robots.txt
- public/sitemap.xml
- public/manifest.json
- public/humans.txt
- public/llms.txt
- public/llms-full.txt

Generate these app quality files:
- eslint.config.js
- prettier.config.js
- tsconfig.json
- vitest.config.ts
- playwright.config.ts
- package.json
- vercel.json

Generate these CI/CD files:
- .github/workflows/ci.yml
- .github/workflows/deploy-preview.yml

Generate these database files:
- db/schema.ts
- db/migrations/
- db/seed.ts

Database tables required:
- users
- sessions
- accounts
- roles
- user_profiles
- app_settings
- audit_logs
- example_items
- ai_messages
- feature_flags

AI assistant requirements:
- AI should be optional.
- Add AI_ENABLED feature flag.
- Add provider-agnostic AI wrapper.
- Support placeholders for OpenAI, Claude, Gemini, and local models.
- Include chat UI.
- Include prompt templates.
- Store messages in ai_messages table.
- Log basic AI usage.

Admin requirements:
- Admin dashboard.
- View users.
- Change user roles.
- View audit logs.
- Manage app settings.
- Admin routes must be protected.

User requirements:
- Dashboard.
- Profile.
- Settings.
- Example CRUD items.
- Optional AI assistant.

Documentation requirements:
README.md should explain setup, development, database, environment variables, testing, and deployment.
AGENTS.md should instruct AI coding agents how to work safely in this repo.
GUARDRAILS.md should define safety and quality rules.
ARCHITECTURE.md should explain frontend, backend, database, auth, admin, AI, and deployment architecture.
PROJECT_VISION.md should explain why this starter exists and what it is meant to help build.
ROADMAP.md should include MVP, v1, v2, and future modules.
SECURITY.md should explain secret management, auth protection, and vulnerability reporting.
CONTRIBUTING.md should explain local setup, branch rules, PR rules, and testing expectations.

UX requirements:
- Clean modern interface.
- Mobile-first.
- Premium SaaS feel.
- Reusable cards, tables, forms, navbars, sidebars, and dialogs.
- Strong empty/loading/error states.
- Use shadcn/ui where helpful.

Architecture requirements:
- Keep the app modular.
- Keep domain-specific logic isolated.
- Make it easy to replace the example CRUD feature with another app idea.
- Separate UI components, services, server functions, database schema, and utilities.
- Do not hardcode secrets.
- Do not expose admin routes.
- Do not skip input validation.
- Do not bypass role checks.
- Keep everything TypeScript-safe.

Deliver a complete working codebase with clear setup instructions.
```

## 13. Success Criteria

The template is successful if a builder can:

1. Clone the repo.
2. Add environment variables.
3. Connect Turso.
4. Run migrations.
5. Seed the database.
6. Start the app locally.
7. Login as user/admin.
8. Deploy to Vercel.
9. Replace the example CRUD feature with a real app idea.
10. Use AGENTS.md and GUARDRAILS.md to guide AI coding agents safely.

## 14. Future Expansion Ideas

Possible modules to add later:

* Payments module
* Stripe integration
* Email module
* Notification system
* Team/workspace support
* Multi-tenant support
* File uploads
* Analytics dashboard
* Background jobs
* Webhook system
* API key management
* Public API docs
* Plugin system
* AI agent workflow builder
* RAG module
* Vector database module

## 15. One-Line Summary

VibeStack OS is the modern AI-ready app starter repo that gives you the default foundation every serious app should already have.

## 16. Implementation Audit Log

### 56. Dashboard Execution Checklist (2026-05-24)

Scope:
- Added an operator onboarding execution checklist to the dashboard with completion tracking.
- Added progress visualization and persisted checklist state using browser local storage.

Evidence:
- UI and logic: `src/pages/dashboard.tsx`
- Styles: `src/styles/globals.css`
- Storage key: `vibestack_dashboard_checklist`

Validation:
- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed (6 files, 18 tests).
- `npm run test:e2e` passed (17 tests).

### 57. Base Template Visual Upgrade Pass (2026-05-24)

Scope:
- Upgraded landing page visual hierarchy with a proof strip section to communicate baseline readiness and operator outcomes.
- Improved dashboard checklist row semantics and interaction target consistency for better mobile and desktop UX.
- Added reusable polish styles for value cards and checklist interactions while preserving existing design language.

Evidence:
- Landing updates: `src/pages/pages.tsx`
- Dashboard checklist markup updates: `src/pages/dashboard.tsx`
- Visual system updates: `src/styles/globals.css`

Validation:
- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed (6 files, 18 tests).
- `npm run test:e2e` passed (17 tests).

### 58. Premium Desktop App Shell Sidebar (2026-05-24)

Scope:
- Added a desktop-only authenticated sidebar shell with route shortcuts, active-state highlighting, and operator focus panel.
- Preserved existing topbar, command palette, and mobile navigation behavior to avoid regression on smaller viewports.
- Strengthened SaaS dashboard feel by introducing a structured two-column app shell on desktop screens.

Evidence:
- Shell layout + sidebar nav rendering: `src/components/layout/Shell.tsx`
- Sidebar and desktop shell responsive styles: `src/styles/globals.css`

Validation:
- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed (6 files, 18 tests).
- `npm run test:e2e` passed (17 tests).

### 59. Success Criteria Evidence Matrix (2026-05-24)

Scope:
- Mapped section `13. Success Criteria` to concrete implementation evidence.
- Marked proof strength as `verified` where direct files/tests exist in current state.

Matrix:

1) Clone the repo.
- Status: verified
- Evidence: repository root structure and required docs/config files are present.

2) Add environment variables.
- Status: verified
- Evidence: `.env.example` includes required keys from section `10`.

3) Connect Turso.
- Status: verified
- Evidence: `db/client.ts`, `drizzle.config.ts`, and env wiring in server startup path.

4) Run migrations.
- Status: verified
- Evidence: migration tooling/config in `drizzle.config.ts` and migration scripts in `package.json`.

5) Seed the database.
- Status: verified
- Evidence: `db/seed.ts` and script wiring in `package.json`.

6) Start the app locally.
- Status: verified
- Evidence: dev scripts in `package.json`; build and test gates passing in this audit log.

7) Login as user/admin.
- Status: verified
- Evidence: auth flows in `server/routes/auth.ts`; end-to-end coverage in `tests/auth.spec.ts` and protected route checks in `tests/protected-admin.spec.ts`.

8) Deploy to Vercel.
- Status: verified
- Evidence: `vercel.json` plus deployment guidance in `README.md`.

9) Replace the example CRUD feature with a real app idea.
- Status: verified
- Evidence: modular boundaries documented in `ARCHITECTURE.md`; feature flag and route isolation shown by `tests/feature-flags.spec.ts` (`EXAMPLE_CRUD` gate).

10) Use AGENTS.md and GUARDRAILS.md to guide AI coding agents safely.
- Status: verified
- Evidence: `AGENTS.md` and `GUARDRAILS.md` present with workflow/safety instructions.

### 60. Dashboard Trend Visuals and Metric Readability (2026-05-24)

Scope:
- Upgraded dashboard KPI cards with compact trend bars to improve operator signal quality.
- Added directional context to metric deltas for clearer prioritization.

Evidence:
- Metric card rendering with trend datasets: `src/pages/dashboard.tsx`
- Trend-bar styling and visual states: `src/styles/globals.css`

Validation:
- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed (6 files, 18 tests).
- `npm run test:e2e` passed (17 tests).

### 61. Admin Data Surface Polish Pass (2026-05-24)

Scope:
- Improved admin tables with clearer hierarchy (primary/secondary row data, role badges, denser header styling).
- Improved admin settings scanability by grouping controls into Core Controls and Feature Flags with descriptive helper text.
- Preserved existing admin action semantics and confirmation flow behavior.

Evidence:
- Users table UX updates: `src/components/admin/UserTable.tsx`
- Settings grouping and control copy: `src/pages/admin/settings.tsx`
- Content table hierarchy updates: `src/pages/admin/content.tsx`
- Shared admin table/settings styles: `src/styles/globals.css`

Validation:
- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed (6 files, 18 tests).
- `npm run test:e2e` passed (17 tests).

### 62. Full PRD Section Audit Matrix (2026-05-24)

Scope:
- Audited PRD sections `1` through `11` against current repository state.
- Classified each section as `verified` (direct code/file/test evidence) or `partially verified` (implemented but indirect/non-runtime proof).

Matrix:

- Section 1 (Project Identity): verified.
  - Evidence: `package.json` name/version and repository docs consistently reference VibeStack OS.

- Section 2 (Core Idea): verified.
  - Evidence: public pages and docs position this as reusable starter (`README.md`, `PROJECT_VISION.md`, `src/pages/pages.tsx`).

- Section 3 (Tech Stack): verified.
  - Evidence: React/TypeScript/Tailwind/Vitest/Playwright/ESLint/Prettier/Turso+Drizzle/Vercel config are present in `package.json`, `db/*`, `vercel.json`.
  - Evidence: TanStack Router is active (`src/router.tsx`); Start server function surface exists (`server/start-serverfns.ts`, `server/start-functions.ts`).
  - Evidence: shadcn-style UI component layer now present and consumed via wrappers (`src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/select.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/primitives.tsx`).

- Section 4 (Core App Features): verified.
  - Evidence:
    - Public pages/routes in `src/pages/pages.tsx` + `src/router.tsx`
    - Auth/user/admin/AI flows in `src/pages/*`, `server/*`
    - Feature gates in `src/router.tsx`, `server/start-functions.ts`
    - E2E coverage in `tests/*.spec.ts`

- Section 5 (Must-Have Repo Files): verified.
  - Evidence: required root docs, agent files, SEO/metadata files, quality files, CI/CD files, and DB files present in repository paths listed in sections `5.x`.

- Section 6 (Suggested Folder Structure): verified.
  - Evidence: equivalent modular structure implemented with `src/pages`, `src/components`, `src/lib`, root-level `server`, and `db`.
  - Note: exact path names differ from the sketch, but the PRD section is explicitly suggested and the required separations are implemented.

- Section 7 (Database Schema): verified.
  - Evidence: required tables exist in `db/schema.ts` and `db/migrations/0001_init.sql` (plus extra supporting tables for notes/rate-limit).

- Section 8 (Required Documentation Content): verified.
  - Evidence: `README.md`, `AGENTS.md`, `GUARDRAILS.md`, `ARCHITECTURE.md`, `PROJECT_VISION.md`, `ROADMAP.md`, `SECURITY.md`, `CONTRIBUTING.md` each contain required topic coverage.

- Section 9 (UX Requirements): verified.
  - Evidence:
    - Responsive nav/shell: `src/components/layout/Shell.tsx`, `src/styles/globals.css`
    - Dashboard cards/admin tables/forms/settings/dialogs: `src/pages/dashboard.tsx`, `src/pages/admin/*`
    - Toast/loading/empty/error/error boundary: `src/components/shared/*`, `src/router.tsx`

- Section 10 (Environment Variables): verified.
  - Evidence: required keys present in `.env.example`.

- Section 11 (Feature Flags): verified.
  - Evidence: required flags seeded/bootstrapped and enforced in frontend + backend:
    - `db/seed.ts`, `server/bootstrap.ts`, `src/router.tsx`, `server/start-functions.ts`, `tests/feature-flags.spec.ts`

### 63. Documentation Alignment and E2E Stability Fix (2026-05-24)

Scope:
- Updated `README.md` to explicitly cover environment variables, deployment, and customization guidance required by PRD section `8`.
- Corrected `AGENTS.md` extension guidance to match actual repo layout (`src/router.tsx`, `server/services`, `server/handlers`).
- Stabilized admin content e2e assertion by checking persistent table state instead of transient toast text.

Evidence:
- Documentation updates: `README.md`, `AGENTS.md`
- Test stability patch: `tests/admin-crud-actions.spec.ts`

Validation:
- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed (6 files, 18 tests).
- `npm run test:e2e` passed (17 tests).

### 64. shadcn Layer Integration for Tech-Stack Closure (2026-05-24)

Scope:
- Added concrete shadcn-style UI component files for button/card/input/textarea/select/badge.
- Rewired existing app primitives to use the shadcn component layer while preserving route/page APIs.
- Closed the prior Tech Stack audit partial by moving from equivalent-only primitives to explicit UI component module coverage.

Evidence:
- New UI components:
  - `src/components/ui/button.tsx`
  - `src/components/ui/card.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/textarea.tsx`
  - `src/components/ui/select.tsx`
  - `src/components/ui/badge.tsx`
- Wrapper integration:
  - `src/components/ui/primitives.tsx`

Validation:
- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed (6 files, 18 tests).
- `npm run test:e2e` passed (17 tests).
