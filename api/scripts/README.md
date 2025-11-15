# Database Scripts

This directory contains scripts for database operations and data seeding.

## Available Scripts

### `seed_data.py`

Basic data seeding using raw SQL. Good for simple data inserts.

**Usage:**

```bash
make seed-data
# or
python scripts/seed_data.py
```

### `seed_with_models.py`

Advanced data seeding using SQLAlchemy models. Good for complex data with relationships.

**Usage:**

```bash
python scripts/seed_with_models.py
```

## When to Use Each Approach

### 1. Alembic Migrations (Recommended for initial data)

- ✅ Version controlled
- ✅ Rollback support
- ✅ Consistent across environments
- ✅ Applied automatically with `alembic upgrade head`

**Use for:**

- Initial lookup data (auth providers, roles, etc.)
- Data that should exist in all environments
- Schema-related initial data

**Example:**

```python
# In alembic/versions/xxx_add_data.py
def upgrade() -> None:
    op.execute("""
        INSERT INTO auth_providers (name, display_name)
        VALUES ('email', 'Email')
    """)
```

### 2. Seed Scripts (Recommended for development/test data)

- ✅ Easy to modify
- ✅ Can be run multiple times (idempotent)
- ✅ Environment-specific data
- ❌ Not version controlled with migrations

**Use for:**

- Test users
- Development data
- Data that changes frequently
- Environment-specific data

### 3. SQLAlchemy Models (Best for complex relationships)

- ✅ Type safety
- ✅ Model validation
- ✅ Relationship handling
- ✅ More maintainable for complex data

**Use for:**

- Creating related records
- Complex data structures
- When you need validation

## Makefile Commands

```bash
# Run migrations
make migrate

# Create a new migration
make migrate-create

# Seed development data
make seed-data
```

## Best Practices

1. **Make scripts idempotent** - They should be safe to run multiple times
2. **Check for existing data** - Don't duplicate records
3. **Use transactions** - Ensure data consistency
4. **Document your scripts** - Add comments explaining what each script does
5. **Keep migrations for schema changes** - Use seed scripts for data

## Example: Adding New Data

### Quick SQL Insert

```python
await conn.execute(text("""
    INSERT INTO auth_providers (name, display_name)
    VALUES ('oauth2', 'OAuth2')
"""))
```

### Using Models

```python
provider = AuthProvider(name='oauth2', display_name='OAuth2')
session.add(provider)
await session.commit()
```
