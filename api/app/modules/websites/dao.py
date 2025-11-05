from sqlalchemy import select
from app.shared.db.models.website import Website
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional


async def dao_get_all_websites(db: AsyncSession) -> list[Website]:
    result = await db.execute(select(Website))
    records = result.scalars().all()
    return list(records)


async def dao_get_website(db: AsyncSession, website_id: str) -> Optional[Website]:
    result = await db.execute(select(Website).where(Website.id == website_id))
    return result.scalar_one_or_none()


async def dao_get_website_by_url(db: AsyncSession, url: str) -> Optional[Website]:
    result = await db.execute(select(Website).where(Website.url == url))
    return result.scalar_one_or_none()


async def dao_create_website(db: AsyncSession, website: Website) -> Website:
    db.add(website)
    await db.commit()
    await db.refresh(website)
    return website


async def dao_update_website(
    db: AsyncSession, website_id: str, website: Website
) -> Optional[Website]:
    existing_website = await dao_get_website(db, website_id)
    if not existing_website:
        return None

    # Merge the passed website object fields into the existing one
    for attr, value in vars(website).items():
        if attr.startswith("_"):
            continue
        setattr(existing_website, attr, value)

    await db.commit()
    await db.refresh(existing_website)
    return existing_website


async def dao_delete_website(db: AsyncSession, website_id: str) -> bool:
    result = await db.execute(select(Website).where(Website.id == website_id))
    website = result.scalar_one_or_none()
    if not website:
        return False

    await db.delete(website)
    await db.commit()
    return True
