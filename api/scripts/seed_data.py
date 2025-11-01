"""
Data seeding script for development/testing.

Usage:
    python scripts/seed_data.py
"""
import asyncio
from sqlalchemy import text
from app.shared.db.session import engine


async def seed_auth_providers():
    """Seed auth providers if they don't exist."""
    async with engine.begin() as conn:
        # Check if providers already exist
        result = await conn.execute(text("SELECT COUNT(*) FROM auth_providers"))
        count = result.scalar()
        
        if count == 0:
            await conn.execute(text("""
                INSERT INTO auth_providers (name, display_name, is_enabled) 
                VALUES 
                    ('email', 'Email', true),
                    ('google', 'Google', true),
                    ('github', 'GitHub', true)
            """))
            print("✅ Auth providers seeded")
        else:
            print(f"ℹ️  Auth providers already exist ({count} providers)")


async def seed_test_user():
    """Seed a test user for development."""
    async with engine.begin() as conn:
        # Check if test user exists
        result = await conn.execute(
            text("SELECT COUNT(*) FROM users WHERE email = 'test@example.com'")
        )
        count = result.scalar()
        
        if count == 0:
            await conn.execute(text("""
                INSERT INTO users (email, password_hash, first_name, last_name)
                VALUES ('test@example.com', 'hashed_password_here', 'Test', 'User')
            """))
            print("✅ Test user seeded")
        else:
            print("ℹ️  Test user already exists")


async def main():
    """Run all seeding functions."""
    print("🌱 Starting data seeding...")
    await seed_auth_providers()
    await seed_test_user()
    print("✅ Data seeding complete!")


if __name__ == "__main__":
    asyncio.run(main())

