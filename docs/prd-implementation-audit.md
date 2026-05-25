# PRD Implementation Audit

This audit maps `docs/prd.md` requirements to current repository evidence.

## 1) Project Foundation
- Status: Implemented
- Evidence: `src/`, `server/`, `db/`, `public/`, `.github/workflows/`

## 2) Tech Stack Alignment
- React + TypeScript + Vite: Implemented
- TanStack Router: Implemented (`src/router.tsx`)
- TanStack Start runtime: Pending
- Tailwind + shadcn/ui: Pending full adoption (custom CSS system currently active)
- Turso/LibSQL + Drizzle: Implemented (`db/schema.ts`, `server/db.ts`, `drizzle.config.ts`)
- Vitest + Playwright + ESLint + Prettier: Implemented

## 3) Public Routes
- Implemented: `/`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`, `/status`
- Evidence: `src/router.tsx`, `src/pages/pages.tsx`

## 4) Auth + Session + Roles
- Credential signup/login/logout/me: Implemented
- Cookie sessions (HTTP-only): Implemented
- CSRF for unsafe methods: Implemented
- Role-based route access (user/admin): Implemented
- Evidence: `server/index.ts`, `src/lib/auth.tsx`, `src/lib/permissions.ts`

## 4.1) Feature-Flag Enforcement
- End-to-end gating now enforced for `AI_ASSISTANT`, `ADMIN_PANEL`, `AUDIT_LOGS`, `EXAMPLE_CRUD`, and `USER_SETTINGS`.
- Frontend route protection + nav visibility now respects enabled flags.
- Backend API endpoints for AI, admin, user settings, and CRUD modules now reject access when related flags are disabled.
- E2E verification now covers runtime gating for `AUDIT_LOGS`, `USER_SETTINGS`, and `EXAMPLE_CRUD` (including nav visibility for CRUD).
- Evidence: `src/context/feature-flags.tsx`, `src/router.tsx`, `src/components/layout/Shell.tsx`, `server/index.ts`, `tests/feature-flags.spec.ts`

## 5) User Module
- Dashboard: Implemented with DB-backed metrics/activity
- Profile: Implemented (read)
- Settings: Implemented (write)
- CRUD example items: Implemented
- Notes/saved items workspace: Implemented (dedicated user-scoped notes module with pin/update/delete)
- Activity history: Implemented (dedicated user activity endpoint + profile timeline)
- Loading/error/empty states: Implemented
- Confirmation dialogs for destructive/state-changing actions: Implemented
- Toast notifications: Implemented
- Evidence: `src/pages/dashboard.tsx`, `src/pages/profile.tsx`, `src/pages/settings.tsx`, `src/pages/items.tsx`, `src/pages/notes.tsx`, `src/components/shared/ConfirmDialog.tsx`, `server/index.ts`, `db/schema.ts`, `tests/settings-ai.spec.ts`, `tests/notes.spec.ts`

## 6) Admin Module
- Admin dashboard: Implemented
- View users: Implemented
- Change user role: Implemented
- View audit logs: Implemented
- Manage app settings: Implemented
- Manage/publish content: Implemented
- Evidence: `src/pages/admin/*`, `server/index.ts`

## 7) AI Module
- AI route + chat action + history persistence: Implemented baseline
- Prompt templates + editable prompt workspace: Implemented
- Provider adapters (OpenAI/Claude/Gemini/local fallback): Implemented baseline
- Provider capability contract endpoint + configurable default provider/model selection: Implemented
- Prompt safety baseline (normalization + length policy): Implemented
- Guardrail enforcement: implemented (prompt-injection pattern blocking, sensitive token redaction, configurable policy toggles)
- Provider allow-list policy (`AI_ALLOWED_PROVIDERS`) enforced and exposed in provider metadata/UI: Implemented
- Moderation category policy (`AI_MODERATION_BLOCK_CATEGORIES`) enforced with category-specific block reasons and metadata exposure: Implemented
- Policy escalation webhook hook (`AI_POLICY_WEBHOOK_URL`) implemented for blocked AI events: Implemented
- Usage logging: Implemented via `audit_logs` + `ai_messages`
- Guardrail unit tests: implemented
- Provider policy unit tests: implemented
- E2E verification for blocked unsafe prompt feedback: implemented
- Evidence: `src/pages/ai/assistant.tsx`, `server/index.ts`, `server/ai/provider.ts`, `server/ai/guardrails.ts`, `server/ai/policy.ts`, `src/__tests__/ai-guardrails.test.ts`, `src/__tests__/ai-provider-policy.test.ts`, `src/__tests__/ai-policy.test.ts`, `db/schema.ts`
  - Runtime safety test: `tests/ai-safety.spec.ts`

## 8) SEO / Metadata Files
- Implemented: `robots.txt`, `sitemap.xml`, `manifest.json`, `humans.txt`, `llms.txt`, `llms-full.txt`
- Evidence: `public/`

## 9) Repo Docs / Agent Files
- Required files exist: Implemented
- Evidence: root docs + `.cursor/` + `.github/copilot-instructions.md`

## 10) CI / Quality
- CI workflows present: Implemented
- Lint/build/unit/e2e pass locally: Implemented
- E2E coverage includes landing smoke, signup auth, protected-route redirect, admin guard, settings save, AI action, AI safety block feedback, feature-flag runtime gates, admin role-change action, CRUD/admin-content confirmation flows, and CSRF regression: Implemented
- Security headers e2e verification added for API hardening baseline.
- CSRF e2e suite now verifies both block path (missing token) and success path (valid token).
- Evidence: `.github/workflows/*.yml`, local command runs

## 11) Database Coverage
- Required tables present in Drizzle schema: Implemented
- Seed script present: Implemented
- Migration file present + idempotent create: Implemented
- Evidence: `db/schema.ts`, `db/seed.ts`, `db/migrations/0001_init.sql`

## 12) Remaining High-Impact Gaps
- TanStack Start runtime migration
- Tailwind utility layer + shadcn-style primitives are now adopted across core surfaces; full component-library parity still expandable
- Richer policy workflows (per-tenant policy profiles, external moderation provider orchestration)
- Optional production hardening: stricter distributed abuse controls

## 12.1) Rate-Limit Store Hardening
- Auth and AI limiters now use DB-backed `rate_limit_events` instead of process-memory counters.
- This improves limiter durability and cross-process consistency compared to memory-only behavior.
- Evidence: `db/migrations/0001_init.sql`, `db/schema.ts`, `server/bootstrap.ts`, `server/index.ts`

## 12.2) Session Store Hardening (Closed)
- Sessions are persisted in the database (`sessions` table) and validated server-side on each request.
- This enables multi-instance consistency as long as instances share the same backing database.
- Evidence: `db/schema.ts`, `db/migrations/0001_init.sql`, `server/index.ts`

### TanStack Start Migration Note
- Official TanStack Start docs confirm `createServerFn` as the intended server-function boundary for Start runtime workloads.
- Current codebase remains Router + Express runtime, but backend contracts have been moved toward a server-function-friendly shape (typed provider metadata endpoint + explicit server-side prompt policy), reducing migration risk.
- References:
  - https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
  - https://tanstack.com/start/docs

## 13) UX Baseline Upgrade (May 24, 2026)
- Public marketing pages upgraded from placeholder empty states to reusable premium starter sections (`pricing`, `about`, `contact`, `privacy`, `terms`, `status`).
- Unified utility styles for raw class-based surfaces (`.btn`, `.input`, `.badge`) to keep non-primitive usage consistent.
- Evidence: `src/pages/pages.tsx`, `src/styles/globals.css`

## 14) Authenticated Surface Polish (May 24, 2026)
- Dashboard redesigned into an operator cockpit with stronger hierarchy (spotlight hero, metric cards, activity timeline).
- Admin root redesigned into actionable operational tiles for users/audit/settings/content flows.
- Shared style layer expanded with spotlight/timeline/stat-card/motion classes while preserving responsiveness.
- Evidence: `src/pages/dashboard.tsx`, `src/pages/admin/index.tsx`, `src/styles/globals.css`

## 15) UX Consistency + Test Reliability (May 24, 2026)
- Profile/settings/admin users/audit surfaces aligned with shared section-head/pill/meta/table visual patterns for a more cohesive premium baseline.
- Settings form refined with textarea bio and standardized input styling.
- Security e2e test hardened against startup race by using configurable API port + short retry loop.
- Evidence: `src/pages/profile.tsx`, `src/pages/settings.tsx`, `src/components/admin/UserTable.tsx`, `src/pages/admin/audit-logs.tsx`, `src/styles/globals.css`, `tests/security.spec.ts`

## 16) Guarded Flow Polish (May 24, 2026)
- Protected and admin-only route auth-loading states now use the shared `LoadingState` component instead of plain text cards.
- Admin settings/content and CRUD items pages aligned with consistent section headers and count pills.
- Evidence: `src/router.tsx`, `src/pages/admin/settings.tsx`, `src/pages/admin/content.tsx`, `src/pages/items.tsx`, `src/styles/globals.css`

## 17) Interactive Reliability Pass (May 24, 2026)
- Added busy-state locking and explicit failure toasts for role changes, admin settings/feature-flag toggles, and content/CRUD mutations.
- Confirm dialogs now receive busy state during destructive or publish/unpublish actions, reducing double-submit risk.
- Evidence: `src/pages/admin/users.tsx`, `src/components/admin/UserTable.tsx`, `src/pages/admin/settings.tsx`, `src/pages/admin/content.tsx`, `src/pages/items.tsx`

## 18) Form UX Quality Pass (May 24, 2026)
- Login/signup now include client-side validation (email format, name/password minimums), submit busy states, and inline error feedback.
- User settings save flow now validates name/bio limits client-side, adds save busy state, and shows inline save errors with character counter.
- Evidence: `src/pages/pages.tsx`, `src/pages/settings.tsx`, `src/styles/globals.css`

## 19) Public Surface Premium Baseline (May 24, 2026)
- Landing page upgraded with a stronger hero layout, operator-loop panel, trust tags, and launch-checklist content blocks.
- Pricing/About/Contact/Status pages expanded into richer, reusable marketing sections with stronger hierarchy and clearer conversion-oriented copy.
- Shared visual system expanded with dedicated hero/checklist/pricing classes for a more intentional base-template look and responsive behavior.
- Evidence: `src/pages/pages.tsx`, `src/styles/globals.css`

## 20) Component-System Depth Pass (May 24, 2026)
- Expanded shared UI primitives to include `Textarea`, `Select`, `SectionHeader`, and `Pill`, and introduced card tone variants for reusable layout semantics.
- Refactored notes, settings, items, and AI assistant pages to consume shared primitives instead of ad-hoc raw class-based controls.
- Reduced styling drift and improved maintainability by centralizing interaction components under `src/components/ui/primitives.tsx`.
- Test-stability hardening added by making auth/AI limiter thresholds environment-configurable and using high limits in Playwright runtime only.
- Evidence: `src/components/ui/primitives.tsx`, `src/pages/notes.tsx`, `src/pages/settings.tsx`, `src/pages/items.tsx`, `src/pages/ai/assistant.tsx`, `server/index.ts`, `playwright.config.ts`, `.env.example`

## 21) Operator Surface Consistency Pass (May 24, 2026)
- Dashboard and admin surfaces now use shared primitives (`Card` tone variants, `SectionHeader`, `Button`) for consistent hierarchy and interaction patterns.
- Replaced remaining ad-hoc section header and action-button markup on core authenticated pages to tighten the visual system.
- Evidence: `src/pages/dashboard.tsx`, `src/pages/admin/index.tsx`, `src/pages/admin/settings.tsx`, `src/pages/admin/content.tsx`, `src/pages/admin/audit-logs.tsx`, `src/components/ui/primitives.tsx`

## 22) Runtime-Agnostic Service Slice (May 24, 2026)
- Extracted the production notes domain (`list/create/update/delete`) into a dedicated backend service module to reduce route-layer coupling.
- Express notes endpoints now delegate to `server/services/notes.service.ts`, creating a clean contract that can be reused by future TanStack Start server-function adapters.
- This is a concrete migration-readiness step: business logic is no longer embedded only in HTTP handlers for the notes vertical.
- Evidence: `server/services/notes.service.ts`, `server/index.ts`

## 23) Auth/Feature Guard Service Extraction (May 24, 2026)
- Extracted session lifecycle helpers (`getSessionUser`, `issueSession`) into `server/services/auth.service.ts`.
- Extracted feature-flag resolution (`isFeatureEnabled`) into `server/services/feature-flags.service.ts`.
- Express guards continue enforcing the same route behavior, but now consume reusable service contracts instead of embedding all authorization-resolution logic inline.
- Evidence: `server/services/auth.service.ts`, `server/services/feature-flags.service.ts`, `server/index.ts`

## 24) AI Service Layer Extraction (May 24, 2026)
- Extracted AI provider metadata resolution into `getAIProviderMetadata()` and AI message workflow orchestration into `processAIMessage()` in a dedicated service module.
- AI route handlers now delegate to `server/services/ai.service.ts`, keeping HTTP handlers thinner while preserving guardrails, provider policy checks, and persistence behavior.
- This adds a second high-impact runtime-agnostic slice (after notes/auth/feature-flags) and further reduces coupling to Express-only request handlers.
- Evidence: `server/services/ai.service.ts`, `server/index.ts`

## 25) Admin Service Layer Extraction (May 24, 2026)
- Extracted admin workflows (users, role changes, audit-log reads, app settings, feature flags) into `server/services/admin.service.ts`.
- Admin route handlers now delegate to this service module while preserving existing response shapes and audit side effects.
- This provides a full runtime-agnostic contract for the admin route group and further reduces HTTP-handler coupling.
- Evidence: `server/services/admin.service.ts`, `server/index.ts`

## 26) Runtime Bootstrap Boundary (May 24, 2026)
- Split API process startup from API app definition by moving runtime bootstrapping into a thin `server/index.ts` and exporting reusable `createApiApp()` / `startApiServer()` from `server/app.ts`.
- This introduces a cleaner adapter seam for future TanStack Start runtime integration while preserving existing Express behavior.
- Evidence: `server/app.ts`, `server/index.ts`

## 27) Runtime-Agnostic Handler Contract Pilot (May 24, 2026)
- Introduced a runtime-agnostic HTTP result contract (`status` + `body`) and a thin Express bridge via `sendHttpResult`.
- Migrated the full notes route group to handler modules (`server/handlers/notes.handlers.ts`) that return transport-neutral results, with Express only handling session/audit envelope concerns.
- This is the first explicit handler-adapter boundary that can be mapped to TanStack Start server functions with minimal business-logic churn.
- Evidence: `server/runtime/http.ts`, `server/handlers/notes.handlers.ts`, `server/app.ts`

## 28) Multi-Slice Handler-Adapter Coverage (May 24, 2026)
- Extended the runtime-agnostic handler pattern to AI routes via `server/handlers/ai.handlers.ts`, including metadata and message execution flows.
- Express AI routes now bridge handler outputs through `sendHttpResult` while preserving route-level audit log and policy webhook side effects.
- With both Notes and AI on transport-neutral handlers, the migration pattern is validated across multiple functional surfaces rather than a single pilot.
- Evidence: `server/handlers/ai.handlers.ts`, `server/runtime/http.ts`, `server/app.ts`, `server/services/ai.service.ts`

## 29) Admin Config Handler-Adapter Coverage (May 24, 2026)
- Added runtime-agnostic handlers for admin configuration operations (`settings` and `feature flags`) under `server/handlers/admin-config.handlers.ts`.
- Express admin configuration routes now use handler results via `sendHttpResult`, while preserving route-layer audit logging side effects.
- This extends adapter coverage into a third domain slice and further de-risks migration to TanStack Start server-function boundaries.
- Evidence: `server/handlers/admin-config.handlers.ts`, `server/runtime/http.ts`, `server/app.ts`, `server/services/admin.service.ts`

## 30) User Module Handler-Adapter Coverage (May 24, 2026)
- Added transport-neutral handlers for user profile and activity endpoints in `server/handlers/user.handlers.ts`.
- Extracted user profile/activity persistence logic to `server/services/user.service.ts` and bridged Express routes through `sendHttpResult`, preserving audit side effects for profile updates.
- This extends runtime-agnostic coverage into another core authenticated domain, further reducing Express-specific coupling ahead of TanStack Start migration.
- Evidence: `server/handlers/user.handlers.ts`, `server/services/user.service.ts`, `server/runtime/http.ts`, `server/app.ts`

## 31) Full Admin Handler-Adapter Coverage (May 24, 2026)
- Added runtime-agnostic handlers for admin users and audit-log routes in `server/handlers/admin-core.handlers.ts`.
- Bridged `/api/admin/users`, `/api/admin/users/:id/role`, and `/api/admin/audit-logs` through `sendHttpResult` while preserving route-layer audit logging side effects for role changes.
- This completes handler-adapter coverage across the full admin surface (core + config), significantly reducing remaining Express-specific route logic.
- Evidence: `server/handlers/admin-core.handlers.ts`, `server/handlers/admin-config.handlers.ts`, `server/runtime/http.ts`, `server/app.ts`, `server/services/admin.service.ts`

## 32) Items CRUD Handler-Adapter Coverage (May 24, 2026)
- Added `server/services/items.service.ts` for item persistence operations and `server/handlers/items.handlers.ts` for transport-neutral CRUD handler results.
- Bridged `/api/items` (GET/POST/PATCH/DELETE) through `sendHttpResult`, with audit side effects preserved using handler-provided metadata.
- This extends runtime-agnostic coverage into the example CRUD domain, further shrinking Express-specific route logic.
- Evidence: `server/services/items.service.ts`, `server/handlers/items.handlers.ts`, `server/runtime/http.ts`, `server/app.ts`

## 33) Dashboard + Feature Flags Handler Coverage (May 24, 2026)
- Added `server/services/dashboard.service.ts` and runtime-agnostic `server/handlers/dashboard.handlers.ts` for `/api/dashboard`.
- Added `listFeatureFlags()` service + `server/handlers/feature-flags.handlers.ts` and bridged `/api/feature-flags` through `sendHttpResult`.
- This further reduces inline route logic for non-admin authenticated surfaces.
- Evidence: `server/services/dashboard.service.ts`, `server/handlers/dashboard.handlers.ts`, `server/services/feature-flags.service.ts`, `server/handlers/feature-flags.handlers.ts`, `server/app.ts`

## 34) E2E Strict-Locator Hardening (May 24, 2026)
- Hardened a duplicate-toast assertion in CRUD/admin confirmation e2e by targeting the first matching toast button.
- This prevents false negatives under repeated identical success notifications without changing product behavior.
- Evidence: `tests/admin-crud-actions.spec.ts`

## 35) Auth Handler-Adapter Coverage (May 24, 2026)
- Added runtime-agnostic auth handlers for `signup`, `login`, `logout`, and `me` in `server/handlers/auth.handlers.ts`.
- Expanded `server/services/auth.service.ts` with credential-auth and session revoke utilities, and bridged auth routes in `server/app.ts` through `sendHttpResult`.
- Cookie/session side effects remain in the Express bridge layer, while auth decision logic is now transport-neutral.
- Evidence: `server/handlers/auth.handlers.ts`, `server/services/auth.service.ts`, `server/runtime/http.ts`, `server/app.ts`

## 36) Start-Style Bridge Export (May 24, 2026)
- Added `server/start-bridge.ts` exposing a typed, runtime-agnostic server boundary grouped by domain (`auth`, `system`, `user`, `items`, `notes`, `ai`, `admin`).
- Bridge methods delegate directly to transport-neutral handlers, providing a practical adapter surface for future TanStack Start `createServerFn` wiring.
- This is the first consolidated cross-domain interface intended specifically for Start-runtime migration.
- Evidence: `server/start-bridge.ts`, `server/handlers/*.ts`

## 37) Bridge-First Runtime Wiring (May 24, 2026)
- Refactored `server/app.ts` to invoke `startBridge` methods across major route groups instead of importing many domain handlers directly.
- This makes the Start-style bridge the effective orchestration layer for the live Express runtime, not just a passive export.
- Result: lower migration friction for replacing Express route glue with Start server-function adapters over the same boundary.
- Evidence: `server/app.ts`, `server/start-bridge.ts`

## 38) Legacy Mock Layer Cleanup (May 24, 2026)
- Removed stale prototype modules under `src/server/*` and `src/services/*` that were no longer part of runtime execution.
- Canonical backend is now fully represented under `server/*` (services, handlers, bridge, and runtime bootstrap), reducing architecture ambiguity during migration work.
- Evidence: `docs/ARCHITECTURE.md`, `server/`, removal of `src/server/*.ts` and `src/services/*.ts`

## 39) Loading Skeleton + Not-Found UX Pass (May 24, 2026)
- Added richer loading skeleton components for dashboard and profile flows (`DashboardSkeleton`, `ProfileSkeleton`) instead of generic placeholder-only loading.
- Added a router-level not-found surface wired through `rootRoute.notFoundComponent` and a dedicated user-facing 404 page.
- Added Playwright coverage for unknown-route behavior to protect the not-found UX baseline.
- Evidence: `src/components/shared/States.tsx`, `src/pages/dashboard.tsx`, `src/pages/profile.tsx`, `src/pages/pages.tsx`, `src/router.tsx`, `src/styles/globals.css`, `tests/smoke.spec.ts`

## 40) Start Function Context Layer (May 24, 2026)
- Added `server/start-functions.ts`, a Start-oriented function layer over `startBridge` with explicit context/effects primitives (session, audit, policy hooks).
- This introduces a concrete invocation model that can map directly to TanStack Start `createServerFn` wrappers while preserving side-effect orchestration semantics.
- Evidence: `server/start-functions.ts`, `server/start-bridge.ts`

## 41) Mobile Dock Navigation Upgrade (May 24, 2026)
- Added a mobile-first bottom dock navigation for authenticated flows while preserving the collapsible menu pattern.
- Dock uses feature-flag-aware visibility and path-aware active states, improving mobile ergonomics and perceived template polish.
- Enhanced sticky topbar readability and mobile safe-area spacing to avoid overlap with primary content.
- Evidence: `src/components/layout/Shell.tsx`, `src/styles/globals.css`

## 42) Skeleton Coverage Expansion (May 24, 2026)
- Expanded loading UX from generic placeholders to page-specific skeletons on settings, items, AI assistant, and admin surfaces.
- Added reusable skeleton variants (`FormSkeleton`, `TableSkeleton`, `AIAssistantSkeleton`) and integrated them into core authenticated routes.
- This closes a remaining UX requirement gap around loading skeleton patterns and improves perceived responsiveness of the base template.
- Evidence: `src/components/shared/States.tsx`, `src/pages/settings.tsx`, `src/pages/items.tsx`, `src/pages/ai/assistant.tsx`, `src/pages/admin/users.tsx`, `src/pages/admin/audit-logs.tsx`, `src/pages/admin/settings.tsx`, `src/styles/globals.css`

## 43) Start-Function Contract Test Coverage (May 24, 2026)
- Added direct unit tests for `server/start-functions.ts` to validate migration-critical behavior instead of relying on scaffold assumptions.
- Coverage now verifies unauthorized gating, session-based user resolution, login side effects (session + audit), feature-flag enforcement for AI, and policy/audit side-effect emission on blocked AI paths.
- This strengthens confidence in the Start-oriented server-function contract before full TanStack Start runtime cutover.
- Evidence: `src/__tests__/start-functions.test.ts`

## 44) Swappable API Adapter Boundary (May 24, 2026)
- Refactored `src/lib/api.ts` from a hardwired HTTP utility into a typed `ApiAdapter` contract with a default HTTP adapter plus runtime `setApiAdapter`/`resetApiAdapter` switching.
- Exported `api` as a stable delegating facade so existing UI call sites remain unchanged while future TanStack Start server-function adapters can be introduced without widespread page refactors.
- Added unit coverage proving runtime adapter swapping behavior.
- Evidence: `src/lib/api.ts`, `src/__tests__/api-adapter.test.ts`

## 45) Live Start-Function Runtime Slice (May 24, 2026)
- Rewired selected production API routes to execute through `startFunctions` (not only `startBridge`): auth (`signup/login/logout/me`), app read endpoints (`feature-flags`, `dashboard`), notes list, and AI message create.
- Added an Express-side Start effects bridge (`setSessionId`, `clearSessionId`, `logAudit`, `notifyPolicy`) so cookie/session behavior and governance side effects are preserved while using the Start-oriented contract.
- This makes the Start-function layer part of the live runtime path, reducing the remaining gap to full TanStack Start `createServerFn` cutover.
- Evidence: `server/app.ts`, `server/start-functions.ts`

## 46) Start-Function Runtime Coverage Expansion (May 24, 2026)
- Expanded `startFunctions` domain coverage to user profile/activity, items CRUD, notes mutations, AI reads, and admin operations (users, audit logs, settings, feature flags).
- Rewired corresponding Express routes so most API surfaces now execute through `startFunctions` with centralized auth/feature/admin guards and effect-based side effects.
- Result: Start-style contract is now the dominant live backend execution path, further reducing migration delta to TanStack Start server functions.
- Evidence: `server/start-functions.ts`, `server/app.ts`

## 47) Start-Function Coverage Tests + E2E Locator Hardening (May 24, 2026)
- Added `startFunctions` tests for non-admin rejection on admin routes and audit-side-effect emission for successful note creation.
- Hardened duplicate-toast e2e assertion (`Item created`) to use deterministic first-match targeting, eliminating strict-locator flakiness.
- Evidence: `src/__tests__/start-functions.test.ts`, `tests/admin-crud-actions.spec.ts`

## 48) Operator Command Bar UX Upgrade (May 24, 2026)
- Added a global command bar (`Cmd/Ctrl+K`) with quick actions for core operator routes and session controls, including feature-flag-aware action visibility.
- Integrated a polished command surface (search input, action list, keyboard enter/escape behavior) to improve both template quality and execution speed.
- Added e2e coverage to verify shortcut-triggered command panel visibility after auth flow.
- Evidence: `src/components/layout/Shell.tsx`, `src/styles/globals.css`, `tests/auth.spec.ts`

## 49) Command Bar Intelligence Refinement (May 24, 2026)
- Added recent-action ranking persisted in `localStorage` so frequently used quick actions float to the top of command-bar results.
- Added platform-aware shortcut label rendering (`⌘K` on macOS, `Ctrl+K` otherwise) for clearer interaction affordance.
- Evidence: `src/components/layout/Shell.tsx`

## 50) Command Bar Keyboard Navigation + Test Hardening (May 24, 2026)
- Added keyboard-first command navigation with arrow-key selection, highlighted active action row, and enter-to-run for selected action.
- Hardened command-bar e2e flow to target action by search query (`notes`) before execution, avoiding recency-order coupling.
- Hardened settings e2e assertion from transient toast visibility to stable post-save field-value verification.
- Evidence: `src/components/layout/Shell.tsx`, `src/styles/globals.css`, `tests/auth.spec.ts`, `tests/settings-ai.spec.ts`

## 51) Command Bar Recent-State Transparency (May 24, 2026)
- Added visible recent-action cues on top command results and a clear-history control within the command palette.
- This makes recency prioritization explicit and user-manageable, improving predictability of keyboard-driven operator workflows.
- Evidence: `src/components/layout/Shell.tsx`, `src/styles/globals.css`

## 52) Theme Customization Leverage Upgrade (May 24, 2026)
- Added dual premium light themes (`forest`, `paper`) with runtime toggle control and persisted preference in `localStorage`.
- Exposed theme switching as both a direct topbar control and command-bar actions, improving template customizability for fast brand/style iteration.
- Evidence: `src/components/layout/Shell.tsx`, `src/styles/globals.css`

## 53) Real TanStack Start ServerFn Bridge (May 24, 2026)
- Added `@tanstack/react-start` dependency and introduced concrete `createServerFn` bridge module under `server/`.
- Implemented an initial vertical slice of Start server functions (`auth me`, `dashboard`, `feature flags`, `notes list/create`, `ai prompt`) that delegate to existing `startFunctions`.
- Added explicit JSON-serializable return normalization to satisfy Start server-function serialization constraints in strict TypeScript mode.
- Evidence: `package.json`, `server/start-serverfns.ts`

## 54) Start ServerFn Surface Parity Expansion (May 24, 2026)
- Expanded `server/start-serverfns.ts` from initial slice to near-complete domain parity: auth mutations, user profile/activity, items CRUD, notes update/delete, AI reads, and admin users/audit/settings/feature-flag operations.
- Each server function uses typed input validators and delegates to the existing `startFunctions` execution contract, keeping behavior consistent while making the Start migration surface explicit.
- Evidence: `server/start-serverfns.ts`

## 55) Theme Persistence Reliability + E2E Verification (May 24, 2026)
- Fixed theme hydration sequencing bug where default theme could overwrite stored preference on reload before persistence state was hydrated.
- Added smoke e2e coverage for theme toggle persistence across page reloads.
- Evidence: `src/components/layout/Shell.tsx`, `tests/smoke.spec.ts`
