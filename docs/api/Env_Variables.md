# Environment Variables

This file documents the environment variables expected by this API. The repository includes a minimal example at `.env.example` — use it as a starting point and never commit secrets.

Required variables (project-specific)
- `DB_CONNECTION_STRING` — Database connection string used by the application. Expected format for Postgres:
	- `postgresql://<user>:<password>@<host>:<port>/<dbname>`
	- Example: `postgresql://dev:devpass@localhost:5432/comp7082_dev`
	- Purpose: used by the ORM/DB session to connect to the primary database. Must be reachable by the app.

- `FRONTEND_URL` — the base URL of the frontend application (used for CORS and generating absolute links in emails)
	- Example: `http://localhost:3000` for local development, `https://app.example.com` in production.
	- Purpose: used to configure allowed origins and to build callback links in auth/email flows.

- `JWT_SECRET_KEY` — secret used to sign JWT tokens
	- Should be a long, random string (e.g., 32+ characters). Keep this secret and rotate periodically.
	- Example (local/dev): `dev-jwt-placeholder-please-change`
	- Purpose: signing and verifying JSON Web Tokens (access/refresh tokens). Changing this will invalidate existing tokens.

Optional / environment helpers
- You may also keep other variables for mail providers, logging, or feature flags. If you add them, document them here.

Example `.env` (local development)
```
DB_CONNECTION_STRING=postgresql://dev:devpass@localhost:5432/comp7082_dev
FRONTEND_URL=http://localhost:3000
JWT_SECRET_KEY=dev-jwt-placeholder-please-change
```

How to set variables
- Local (zsh):
	```bash
	export DB_CONNECTION_STRING='postgresql://dev:devpass@localhost:5432/comp7082_dev'
	export FRONTEND_URL='http://localhost:3000'
	export JWT_SECRET_KEY='dev-jwt-placeholder-please-change'
	```
- Use a `.env` file for local development (add to `.gitignore`) or configure them in your process manager/container runtime for staging/production.

Security & best practices
- Never commit real secret values into source control. Use your platform's secret management (e.g., GitHub Actions secrets, AWS Secrets Manager, Vault) for production.
- Limit access to the DB user indicated in `DB_CONNECTION_STRING` and use least-privilege principles.
- When rotating `JWT_SECRET_KEY`, plan for token invalidation and re-authentication of users.

Generating a JWT secret key
- Recommended length: use a securely generated random value. Aim for at least 32 bytes of entropy (for example, a 32+ byte hex string or a 32+ character URL-safe token).
- Example generation commands (copy/paste):
	- Python (recommended):
		```bash
		python - <<'PY'
		import secrets
		print(secrets.token_urlsafe(48))
		PY
		```
		This produces a URL-safe token with strong randomness (suitable for `JWT_SECRET_KEY`).

	- OpenSSL (hex):
		```bash
		openssl rand -hex 32
		```
		Produces a 64-character hex string (32 bytes of entropy).

	- Node.js:
		```bash
		node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
		```

- Store the generated value in your secret manager or environment (do not commit it). For local development a `.env` file is acceptable if it is gitignored.

Notes for tests and CI
- For tests, set `DB_CONNECTION_STRING` to a test database (or an in-memory DB if supported by the test suite). `tests/conftest.py` may provide fixtures to create ephemeral schemas.
- In CI pipelines, store these three values as protected pipeline variables/secrets. Use different values for test/staging/production.
