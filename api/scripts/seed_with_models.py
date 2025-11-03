"""
Advanced data seeding using SQLAlchemy models.

This approach is useful when you need to:
- Create related records with relationships
- Use model validation
- Leverage ORM features

Usage:
    python scripts/seed_with_models.py
"""
import asyncio
from datetime import datetime
from app.shared.db.session import async_session_factory
from app.shared.db.models.user import User
from app.shared.db.models.user_auth import UserAuth
from app.shared.db.models.folder import Folder


async def seed_test_user_with_auth():
    """Create a test user with email authentication."""
    async with async_session_factory() as session:
        # Check if user already exists
        from sqlalchemy import select
        result = await session.execute(
            select(User).where(User.email == "test@example.com")
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print("ℹ️  Test user already exists")
            return
        
        # Create user
        user = User(
            email="test@example.com",
            password_hash="hashed_password_here",
            first_name="Test",
            last_name="User"
        )
        session.add(user)
        await session.flush()  # Get the user ID
        
        # Create email auth for the user
        user_auth = UserAuth(
            provider="email",
            external_user_id=None,
            external_user=None,
            password_hash="hashed_password_here",
            user_id=user.id
        )
        session.add(user_auth)
        
        # Create a default folder for the user
        folder = Folder(
            user_id=user.id,
            name="Default",
            parent_id=None
        )
        session.add(folder)
        
        await session.commit()
        print(f"✅ Created user: {user.email} with auth and default folder")


async def main():
    """Run all seeding functions."""
    print("🌱 Starting advanced data seeding...")
    await seed_test_user_with_auth()
    print("✅ Data seeding complete!")


if __name__ == "__main__":
    asyncio.run(main())

