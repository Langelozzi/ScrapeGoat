from sqlalchemy import select
from app.shared.db.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional


async def dao_get_all_users(db: AsyncSession) -> list[User]:
    result = await db.execute(select(User))
    records = result.scalars().all()
    return list(records)


async def dao_get_user(db: AsyncSession, user_id: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def dao_create_user(db: AsyncSession, user: User) -> User:
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def dao_update_user(db: AsyncSession, user_id: str, user: User) -> Optional[User]:
    existing_user = await dao_get_user(db, user_id)
    if not existing_user:
        return None

    # Merge the passed user object fields into the existing one
    for attr, value in vars(user).items():
        if attr.startswith("_"):
            continue
        setattr(existing_user, attr, value)

    await db.commit()
    await db.refresh(existing_user)
    return existing_user


async def dao_delete_user(db: AsyncSession, user_id: str) -> bool:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return False

    await db.delete(user)
    await db.commit()
    return True
