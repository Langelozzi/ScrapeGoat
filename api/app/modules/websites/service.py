from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from .dao import (
    dao_get_all_websites,
    dao_get_website,
    dao_create_website,
    dao_get_website_by_url,
    dao_update_website,
    dao_delete_website,
)
from app.shared.db.models.website import Website


async def get_all_websites(db: AsyncSession) -> list[Website]:
    return await dao_get_all_websites(db)


async def get_website(db: AsyncSession, id: str) -> Optional[Website]:
    return await dao_get_website(db, id)


async def get_website_by_url(db: AsyncSession, url: str) -> Optional[Website]:
    return await dao_get_website_by_url(db, url)


async def create_website(db: AsyncSession, website: Website) -> Website:
    return await dao_create_website(db, website)


async def update_website(
    db: AsyncSession, id: str, website: Website
) -> Optional[Website]:
    return await dao_update_website(db, id, website)


async def delete_website(db: AsyncSession, id: str) -> bool:
    return await dao_delete_website(db, id)
