from typing import Optional
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from .dao import (
    dao_get_all_folders,
    dao_get_all_folders_by_user_id,
    dao_get_folder,
    dao_create_folder,
    dao_get_user_root_folder,
    dao_update_folder,
    dao_delete_folder,
)
from app.shared.db.models.folder import Folder


async def get_all_folders(db: AsyncSession) -> list[Folder]:
    return await dao_get_all_folders(db)


async def get_all_folders_by_user_id(db: AsyncSession, user_id: str) -> list[Folder]:
    return await dao_get_all_folders_by_user_id(db, user_id)


async def get_folder(db: AsyncSession, id: str) -> Optional[Folder]:
    return await dao_get_folder(db, id)


async def get_user_root_folder(db: AsyncSession, user_id: str) -> Optional[Folder]:
    return await dao_get_user_root_folder(db, user_id)


async def create_folder(db: AsyncSession, folder: Folder, user_id: str) -> Folder:
    folder.user_id = uuid.UUID(user_id)
    if folder.parent_id is None and folder.name is not "_root":
        root_folder = await get_user_root_folder(db, user_id)
        if root_folder is None:
            raise Exception("No root folder exists for user")
        folder.parent_id = root_folder.id
    return await dao_create_folder(db, folder)


async def update_folder(db: AsyncSession, id: str, folder: Folder) -> Optional[Folder]:
    return await dao_update_folder(db, id, folder)


async def delete_folder(db: AsyncSession, id: str) -> bool:
    return await dao_delete_folder(db, id)
