from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.folders.service import create_folder
from app.shared.db.models.folder import Folder
from .dao import (
    dao_get_all_users,
    dao_get_user,
    dao_create_user,
    dao_update_user,
    dao_delete_user,
)
from app.shared.db.models.user import User


async def get_all_users(db: AsyncSession) -> list[User]:
    return await dao_get_all_users(db)


async def get_user(db: AsyncSession, id: str) -> Optional[User]:
    return await dao_get_user(db, id)


async def create_user(db: AsyncSession, user: User) -> User:
    new_user = await dao_create_user(db, user)
    if not new_user:
        raise Exception("Unable to create user")

    user_root_folder = Folder(user_id=new_user.id, name="_root", parent_id=None)
    await create_folder(db, user_root_folder, str(new_user.id))

    return new_user


async def update_user(db: AsyncSession, id: str, user: User) -> Optional[User]:
    return await dao_update_user(db, id, user)


async def delete_user(db: AsyncSession, id: str) -> bool:
    return await dao_delete_user(db, id)
