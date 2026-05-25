---
theme: default
title: Vibe Coding Workshop
info: |
  Hands-on intro using the VibeStack starter.
transition: slide-left
mdc: true
---

# Intro to vibe coding

Build software by **describing intent** — AI writes the code

<v-clicks>

- You **steer**: run → click → fix → repeat
- Goal: ship a small change, not memorize syntax
- Today we use a real full-stack starter repo

</v-clicks>

---
layout: two-cols
---

# Tech stack

::left::

**Frontend**
- React
- TanStack Router

**Backend**
- Express + server functions
- TanStack Start-style boundary

::right::

**Data**
- Turso (LibSQL)

**Hosting**
- Vercel

<br>

One repo · one deploy pipeline

---
---

# The vibe loop

Do this every time 👇

1. **Say** what you want (one clear sentence)
2. **Let** the agent change a **small** scope
3. **Run** `npm run dev` and use the browser
4. **Fix** errors (paste logs or screenshots)
5. **Push** → get a Vercel preview URL

<v-click>

**Rule:** you verify in the app — never blindly accept diffs

</v-click>

---
layout: two-cols
---

# Where things live

::left::

| Path | What |
|------|------|
| `src/pages` | Screens / routes |
| `src/components` | UI pieces |
| `server/` | API + business logic |
| `db/` | Schema, seed |

::right::

**Guardrails (read these once)**

- `AGENTS.md` — project rules
- `.cursorrules` — auth, mobile-first
- `docs/GUARDRAILS.md` — safety notes

<v-click>

Map the repo **before** you prompt — saves 10× back-and-forth

</v-click>

---
---

# Hands-on demo pattern

Example prompt:

```txt
Add a mobile login button in the header.
Match the existing pill nav style.
```

<v-clicks>

- Agent edits `Shell.tsx` + CSS
- You refresh and click **Login**
- Wrong? → screenshot + “make it match Intro tab style”
- Right? → `git commit` + `git push`

</v-clicks>

---
---

# Prompts that work

✅ **Good**

- “On `/admin/users`, add search by name and email”
- “Settings page: visible inputs + save button like login form”
- “Mobile only — keep desktop nav unchanged”

❌ **Weak**

- “Make it better”
- “Fix everything”
- “Refactor the whole app”

---
---

# Safety rails

Before you push:

- Auth guards stay on protected routes
- Never commit `.env` or secrets
- `npm run lint` and `npm run build`
- Demo logins only for workshops

<v-click>

**Turso:** passwords are **hashed** (scrypt), not plain text

</v-click>

---
layout: center
class: text-center
---

# Your turn

<v-clicks>

1. Pull the starter repo
2. Run `npm run dev`
3. Make **one** tiny UI or copy change with your agent
4. Push and share your Vercel preview link

</v-clicks>

<br>

**Repo:** `vibestack-starter-01` · Questions?
