# Environment Variables

This file documents the environment variables expected by the frontend. The repo includes a minimal example at `frontend/.env.example`—use it as a starting point and never commit real secrets.

Scope and rules
- Vite only exposes variables prefixed with `VITE_`.
- Values are read at build/start; restart the dev server after edits.
- `.env.example` is tracked as the canonical list. Add any new variables there.

Files and precedence
- `.env` — shared local defaults (gitignored)
- `.env.local` — developer-specific overrides (do not commit)
- `.env.development` / `.env.production` — apply per mode

Required variables (project-specific)
- `VITE_API_URL` — base URL for the API (no trailing slash). Used by login, configs, and scraping calls.
  - Example: `http://localhost:8000`
  - Purpose: builds all API requests, e.g., `${VITE_API_URL}/api/v1/scraper/scrape`

Example `.env` (local development)
```
VITE_API_URL=http://localhost:8000
```

How to set variables
- Local PowerShell:
  ```powershell
  $env:VITE_API_URL="http://localhost:8000"
  npm run dev
  ```
- Recommended: copy `.env.example` to `.env` and edit the values (keep `.env` gitignored).

Usage in React
```js
const apiBase = import.meta.env.VITE_API_URL;
const res = await fetch(`${apiBase}/api/v1/scraper/scrape`, { /* ... */ });
```

Security and best practices
- Do not commit `.env` or `.env.local`; keep real values out of git history.
- Only prefix values with `VITE_` if they must be available in the browser.
- Keep `VITE_API_URL` aligned with backend CORS/FRONTEND_URL settings per environment.
