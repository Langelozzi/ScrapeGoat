from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.shared.config import settings
from .base import Base

# Must import in order to load models into memory for init_db
from .models.user import User
from .models.user import Folder
from .models.website import Website
from .models.scraper_config import ScraperConfig
from .models.scrape_result import ScrapeResult

engine = create_async_engine(settings.db_connection_string, echo=True)

async_session_factory = async_sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session


# Optional auto-creation for dev
async def init_db():
    """Create all database tables (development use only)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
