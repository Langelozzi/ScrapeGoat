# Development Guide

All-in-one guide for frontend setup and day-to-day development. For environment variable details, see `docs/frontend/Env_Variables.md`.

## Quick start
- Prerequisites: Node.js (LTS) and npm.
- Install deps:
  ```bash
  npm install
  ```
- Configure env:
  - Copy `.env.example` to `.env`.
  - Set `VITE_API_URL` to your backend URL (e.g., `http://localhost:8000`).
- Run dev server:
  ```bash
  npm run dev
  ```
  App runs at http://localhost:3000 by default.

## Commands (reference)
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Tests (watch): `npm test`
- Tests (CI/coverage): `npm run test:ci`
- Build: `npm run build`
- Preview build: `npm run preview`

## Workflow
1) Run the dev server and iterate in the browser.
2) Build screens using the existing top-level components (e.g., `Home.jsx`, `Configs.jsx`, `Login.jsx`) and compose reusable pieces from `src/components/`.
3) Keep cross-cutting state in `src/context/`; share helper logic in `src/utils/`.
4) Use `import.meta.env.VITE_API_URL` for API calls and keep URL building consistent across components.
5) Before pushing: `npm run lint` and `npm run test:ci`.

## Conventions
- Components: function components with hooks; avoid class components.
- Routing: defined in `src/App.jsx`; keep route components thin and delegate to context/helpers.
- Styling: prefer MUI theme tokens via `sx` or styled API; if using Tailwind in a file, stay consistent.
- API calls: build URLs from `VITE_API_URL`, handle errors/loading visibly, avoid silent failures.

## Testing
- Use React Testing Library; test user-facing behavior (queries by text/role).
- Place specs as `*.test.jsx` near the code or in `src/tests/`.
- Mock network/context as needed to keep tests deterministic.

## Git hygiene
- Do not commit `.env`/`.env.local` or real secrets.
- Keep commits focused and small; align branch naming with backend practices if applicable.
- Run lint/tests before opening a PR to match CI expectations.
