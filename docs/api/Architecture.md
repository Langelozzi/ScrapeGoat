# Architecture — Hybrid MVC / Micro-service style

This document explains the architectural choices and the project layout used by this API. The design blends a unified MVC-style API structure with micro-service organization: files are grouped by logical module (or service) rather than strictly by file type.

## Overview
- The project groups related code into self-contained modules under `app/modules/` and shared functionality under `app/shared/`.
- Each module contains everything it needs to implement its feature surface (models, routes, services, DAO if applicable).
- Routers from each module are composed in `app/main.py` to form a single API entrypoint. This gives the simplicity of a single API while preserving the ability to split modules into separate services later.

## High-level directory responsibilities
- `app/modules/` — contains domain modules (users, auth, websites, folders, scraper, configs, etc.). Each module is a logical micro-service boundary and typically contains:
  - `models.py` — model classes / Pydantic schemas used by that module
  - `routes.py` — HTTP handlers / router definitions (Controller layer)
  - `service.py` — business logic and processing for the module
  - `dao.py` (optional) — database access functions (CRUD and queries). Modules without DB interactions may omit `dao.py`.

- `app/shared/` — reusable code and configuration used across modules:
  - `shared/config.py` — application configuration and environment wiring
  - `shared/db/` — DB setup, base models, mixins and session management
  - `shared/helpers/` — small utility functions used across modules
  - `shared/models/` — database model definitions that are shared or referenced across modules

## Why this hybrid approach
- Grouping by module (micro-service style) keeps all code related to a feature in one place, making it easier to reason about and extract into a standalone service later if needed.
- Keeping a single `main.py` entrypoint preserves a simple deployment for development and small deployments.
- This approach balances developer ergonomics with long-term flexibility.

## Data flow and responsibilities
Each module implements a clear, consistent flow through three primary layers:

1) Route handler / Controller (in `routes.py`)
- Receives HTTP requests, validates input (often via Pydantic schemas), and converts HTTP-specific types into internal data structures.
- This layer is the only part that knows about HTTP semantics (requests, responses, status codes).
- It calls the service layer to perform the requested operation and translates service results back into HTTP responses.

2) Service (in `service.py`)
- Implements business logic and orchestration. A service may:
  - Validate or transform domain data
  - Call other modules or external APIs
  - Invoke DAO functions to persist or read data
  - Emit events or schedule background work

3) DAO (in `dao.py`, optional)
- Responsible solely for database interaction: queries, inserts, updates, deletes, and transactions.
- Keeps SQL/ORM code localized so services stay focused on business logic.

## Router composition and `main.py`
- Each module exposes a FastAPI router (or equivalent) in `routes.py`.
- `app/main.py` imports these routers and mounts them on appropriate paths, producing a single ASGI application.
- Example: `app/main.py` composition allows `GET /users` to be handled by `app/modules/users/routes.py` while `POST /auth/login` is handled by `app/modules/auth/routes.py`.

## Module conventions
- Use the module folder name as the namespace (e.g., `app/modules/users/`).
- Keep the file roles consistent across modules: `models.py`, `routes.py`, `service.py`, `dao.py` (only if DB access required).
- Document module responsibilities in `app/modules/<module>/README.md` when behavior is non-trivial.

## When to split a module into a separate service
- If a module grows large, has independent scaling or release requirements, or has separate operational concerns (e.g., different SLA, resource needs), consider splitting it into a separate microservice.
- Splitting is simplified by the current layout because a module already encapsulates its routes, models, services and DB interactions.

## Operational notes
- Database: connection and session lifecycle are configured in `app/shared/db/` to centralize pooling and session management.
- Migrations: DB migration tooling (Alembic) lives in the repository root (`alembic/`). Follow `docs/Migrations.md` for workflow.
- Configuration: central configuration is provided by `app/shared/config.py` and environment variables (see `docs/Env_Variables.md`).

## Examples / quick reference
- Typical module file list (`app/modules/users/`):
  - `models.py` — Pydantic schemas and/or ORM models
  - `routes.py` — FastAPI APIRouter with route handlers
  - `service.py` — business logic functions called by routes
  - `dao.py` — database helper functions (if the module uses the DB)
