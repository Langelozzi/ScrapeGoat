from sqlalchemy import select
from app.shared.db.models.folder import Folder
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional


async def dao_get_all_folders(db: AsyncSession) -> list[Folder]:
    result = await db.execute(select(Folder))
    records = result.scalars().all()
    return list(records)


async def dao_get_all_folders_by_user_id(
    db: AsyncSession, user_id: str
) -> list[Folder]:
    result = await db.execute(select(Folder).where(Folder.user_id == user_id))
    records = result.scalars().all()
    return list(records)


async def dao_get_folder(db: AsyncSession, folder_id: str) -> Optional[Folder]:
    result = await db.execute(select(Folder).where(Folder.id == folder_id))
    return result.scalar_one_or_none()


async def dao_get_user_root_folder(db: AsyncSession, user_id: str) -> Folder:
    result = await db.execute(
        select(Folder).where(Folder.user_id == user_id, Folder.name == "_root")
    )
    return result.scalars().first()


async def dao_create_folder(db: AsyncSession, folder: Folder) -> Folder:
    db.add(folder)
    await db.commit()
    await db.refresh(folder)
    return folder


async def dao_update_folder(
    db: AsyncSession, folder_id: str, folder: Folder
) -> Optional[Folder]:
    existing_folder = await dao_get_folder(db, folder_id)
    if not existing_folder:
        return None

    # Merge the passed folder object fields into the existing one
    for attr, value in vars(folder).items():
        if attr.startswith("_"):
            continue
        setattr(existing_folder, attr, value)

    await db.commit()
    await db.refresh(existing_folder)
    return existing_folder


async def dao_delete_folder(db: AsyncSession, folder_id: str) -> bool:
    result = await db.execute(select(Folder).where(Folder.id == folder_id))
    folder = result.scalar_one_or_none()
    if not folder:
        return False

    await db.delete(folder)
    await db.commit()
    return True
