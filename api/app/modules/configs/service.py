from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.websites.service import create_website, get_website_by_url
from app.shared.db.models.website import Website
from app.shared.helpers.url_helpers import get_url_domain
from .dao import (
    dao_get_all_configs,
    dao_get_all_configs_by_folder_id,
    dao_get_config,
    dao_create_config,
    dao_update_config,
    dao_delete_config,
)
from app.modules.folders.service import get_user_root_folder
from app.shared.db.models.scraper_config import ScraperConfig


async def get_all_configs(db: AsyncSession) -> list[ScraperConfig]:
    return await dao_get_all_configs(db)


async def get_all_configs_by_user_id(
    db: AsyncSession, user_id: str
) -> list[ScraperConfig]:
    user_root_folder = await get_user_root_folder(db, user_id)
    if not user_root_folder:
        raise Exception("No root folder exists for user")
    return await dao_get_all_configs_by_folder_id(db, str(user_root_folder.id))


async def get_all_configs_by_folder_id(
    db: AsyncSession, folder_id: str
) -> list[ScraperConfig]:
    return await dao_get_all_configs_by_folder_id(db, folder_id)


async def get_config(db: AsyncSession, id: str) -> Optional[ScraperConfig]:
    return await dao_get_config(db, id)


async def create_config(
    db: AsyncSession, config_data: ScraperConfig, user_id: str
) -> ScraperConfig:
    config = ScraperConfig(
        name=config_data.name,
        description=config_data.description,
        retrieval_json=config_data.retrieval_json,
        folder_id=config_data.folder_id,
    )

    # Set folder to root if not specified
    if config.folder_id is None:
        root_folder = await get_user_root_folder(db, user_id)
        if root_folder is None:
            raise Exception("No root folder exists for user")
        config.folder_id = root_folder.id

    # Check if website already exists in db
    url = config_data.website.url
    website = await get_website_by_url(db, url)
    if website is None:  # if not, create it
        website_data = Website(url=url, domain=get_url_domain(url))
        website = await create_website(db, website_data)

    config.website_id = website.id

    return await dao_create_config(db, config)


async def update_config(
    db: AsyncSession, id: str, config: ScraperConfig
) -> Optional[ScraperConfig]:
    return await dao_update_config(db, id, config)


async def delete_config(db: AsyncSession, id: str) -> bool:
    return await dao_delete_config(db, id)
