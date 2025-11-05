from sqlalchemy import select
from app.shared.db.models.scraper_config import ScraperConfig
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional


async def dao_get_all_configs(db: AsyncSession) -> list[ScraperConfig]:
    result = await db.execute(select(ScraperConfig))
    records = result.scalars().all()
    return list(records)


async def dao_get_all_configs_by_folder_id(
    db: AsyncSession, folder_id: str
) -> list[ScraperConfig]:
    result = await db.execute(
        select(ScraperConfig).where(ScraperConfig.folder_id == folder_id)
    )
    records = result.scalars().all()
    return list(records)


async def dao_get_config(db: AsyncSession, config_id: str) -> Optional[ScraperConfig]:
    result = await db.execute(
        select(ScraperConfig).where(ScraperConfig.id == config_id)
    )
    return result.scalar_one_or_none()


async def dao_create_config(db: AsyncSession, config: ScraperConfig) -> ScraperConfig:
    db.add(config)
    await db.commit()
    await db.refresh(config)
    return config


async def dao_update_config(
    db: AsyncSession, config_id: str, config: ScraperConfig
) -> Optional[ScraperConfig]:
    existing_config = await dao_get_config(db, config_id)
    if not existing_config:
        return None

    # Merge the passed config object fields into the existing one
    for attr, value in vars(config).items():
        if attr.startswith("_"):
            continue
        setattr(existing_config, attr, value)

    await db.commit()
    await db.refresh(existing_config)
    return existing_config


async def dao_delete_config(db: AsyncSession, config_id: str) -> bool:
    result = await db.execute(
        select(ScraperConfig).where(ScraperConfig.id == config_id)
    )
    config = result.scalar_one_or_none()
    if not config:
        return False

    await db.delete(config)
    await db.commit()
    return True
