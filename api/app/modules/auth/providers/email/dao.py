"""
Database access layer for email authentication.
"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db.models.user import User
from app.shared.db.models.user_auth import UserAuth
from app.shared.db.models.auth_provider import AuthProvider


EMAIL_AUTH_PROVIDER = "email"


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Get a user by email address"""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_auth_provider(db: AsyncSession) -> Optional[AuthProvider]:
    """Get the email auth provider"""
    result = await db.execute(
        select(AuthProvider).where(AuthProvider.name == EMAIL_AUTH_PROVIDER)
    )
    return result.scalar_one_or_none()


async def get_user_auth_by_provider(
    db: AsyncSession, user_id: str
) -> Optional[UserAuth]:
    """Get user authentication record for email provider"""
    result = await db.execute(
        select(UserAuth).where(
            UserAuth.user_id == user_id,
            UserAuth.provider == EMAIL_AUTH_PROVIDER
        )
    )
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user: User) -> User:
    """Create a new user"""
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def create_user_auth(db: AsyncSession, user_auth: UserAuth) -> UserAuth:
    """Create a new user authentication record"""
    db.add(user_auth)
    await db.commit()
    await db.refresh(user_auth)
    return user_auth

