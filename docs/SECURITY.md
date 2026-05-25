# Security

## Reporting
Report vulnerabilities privately to project maintainers.

## Current Protections
- Credential auth with password hashing (`scrypt`) and timing-safe verification.
- HTTP-only session cookies (`vibestack_session_id`) for auth state.
- CSRF protection for mutating routes using double-submit token pattern:
  - `GET /api/csrf` issues token + cookie.
  - Unsafe methods (`POST/PATCH/PUT/DELETE`) require matching `x-csrf-token`.
- Role-based admin route enforcement on backend endpoints.
- Input validation on auth, CRUD, and admin mutations.

## Secret Handling
- Never commit credentials or API keys.
- Use `.env` and `.env.example` for local configuration.

## Remaining Hardening
- Add rate limiting on auth and mutation endpoints.
- Add stronger password policy and optional email verification.
- Add security-focused e2e/api tests for CSRF and auth abuse scenarios.
