# Frontend Architecture and Structure

This document explains how the frontend is organized and how the pieces fit together. The layout favors feature-centric folders with shared primitives extracted when broadly useful.

## Overview
- Built with React + Vite, using React Router for navigation and MUI for theming.
- UI is composed from reusable components under `src/components/`; top-level screens live as root files (e.g., `Home.jsx`, `Configs.jsx`, `Login.jsx`, `Results.jsx`).
- State that spans multiple screens lives in React context under `src/context/`.
- API calls use `VITE_API_URL` for the base URL; keep request construction consistent across components.

## Directory responsibilities
```
src/
  components/    # shared visual building blocks (buttons, tables, cards)
  context/       # React context providers (user, configs, etc.)
  tests/         # test specs/utilities
  utils/         # small helpers (formatting, parsing)
  App.jsx        # app shell, routing, theme
  ConfigEditor.jsx
  Configs.jsx
  Home.jsx
  Login.jsx
  Results.jsx
  main.jsx       # Vite entry
  setupTests.js  # test setup for Vitest/RTL
```

## Routing
- Defined in `src/App.jsx` with React Router. Each route renders a screen component (e.g., `Home`, `Configs`, `Login`, `Results`).
- Keep routes thin: share orchestration through context/helpers instead of duplicating logic per route.

## State and data flow
- Local UI state stays in components; cross-cutting state (user/session, configs) lives in context providers under `src/context/`.
- API calls use `import.meta.env.VITE_API_URL` as the base; keep URL building consistent across components.

## Styling and theming
- MUI theme is created in `App.jsx`; prefer theme tokens (palette, spacing) over hard-coded values.
- Use the MUI `sx` prop or styled API. Tailwind is available but keep a file consistent (avoid mixing styles ad hoc).

## Naming conventions
- Components: PascalCase file and export (e.g., `Navbar.jsx`).
- Helpers: camelCase functions; files named after their concern.
- Tests: `*.test.jsx` colocated with code or placed in `src/tests/`.

## When adding new code
- Prefer composing existing components before adding new primitives.
- If a screen grows large, extract UI pieces into `components/` and share helpers in `utils/`.
- Add new folders only when they exist in the codebase; update this doc to reflect them.
