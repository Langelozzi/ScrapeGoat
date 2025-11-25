# Database (shared/db) — session, models, and usage

This directory contains the SQLAlchemy configuration used across modules: base model definitions, shared ORM models, mixins, and the session / dependency used by the API.

## Purpose
- Centralize DB configuration (engine, sessionmaker, base metadata) so all modules use the same connection and model definitions.
- Provide a single, injectable session dependency for request-scoped database access.

## Key files
- `base.py` — defines the SQLAlchemy declarative base (common mixins, timestamp columns, etc.).
- `mixins.py` — reusable mixin classes for models (e.g., timestamp columns, soft-delete helpers).
- `session.py` — creates the SQLAlchemy `Engine` and `SessionLocal` / session factory and exposes a dependency for routes to get a DB session.
- `models/` — folder containing module-specific DB model definitions used by the ORM (e.g., `user.py`, `website.py`, `folder.py`, etc.).

## Single-session pattern (how it typically works)
- A single SQLAlchemy `Engine` is created for the application with connection pooling configured once (in `session.py`).
- A `SessionLocal` factory (created via `sessionmaker`) is used to generate session objects per request or per unit-of-work.
- The FastAPI dependency (or equivalent) yields a session object to route handlers using a `try/except/finally` pattern:

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
```

- This pattern ensures each request uses its own session instance, commits when the handler completes successfully, and rolls back on exceptions. The `db.close()` in `finally` returns the connection to the pool.

## How dependencies are used across modules
- Routes (`routes.py`) declare a dependency on the DB session (e.g., `db: Session = Depends(get_db)`).
- Services and DAOs accept a session parameter and perform queries using that session. This keeps DB logic explicit and testable.

## SQLAlchemy notes
- Import your ORM models before running Alembic autogenerate, so `MetaData` is available. `app/alembic/env.py` typically imports modules that register models with the metadata used by Alembic.
- Keep raw SQL or complex queries inside DAO functions so services remain focused on business behavior.

## Testing considerations
- Tests may override the `get_db` dependency with a fixture that creates a temporary / in-memory database or a transactional rollback pattern to keep tests isolated.
- See `tests/conftest.py` for the project's test DB setup and session fixture examples.

## Best practices
- Keep sessions short-lived and scoped to a single request or unit-of-work.
- Avoid storing sessions in global state or long-running background tasks; for background jobs, create a fresh session from the factory.
- Use explicit transactions for multi-step DB operations that must be atomic.

## When to change this pattern
- If you need per-module DB settings (different DBs for different modules) or separate scaling characteristics, you can create separate engine/session factories per module — but be deliberate: this increases operational complexity.
