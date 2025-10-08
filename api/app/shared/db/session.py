from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.shared.db.base import Base
from app.shared.config import settings

engine = create_async_engine(
    settings.db_connection_string, connect_args={"ssl": "require"}, echo=True
)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# Optional auto-creation for dev
async def init_db():
    """Create all database tables (development use only)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

