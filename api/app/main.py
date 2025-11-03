from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.modules.auth.routes import router as auth_router
from app.modules.scraper.routes import router as scraper_router
from app.modules.users.routes import router as users_router
from app.shared.config import settings
from app.shared.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    print("✅ Database initialized")

    yield

    # Shutdown
    print("🛑 App shutting down")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


OPEN_API_PREFIX = "/api/v1"
# Register the routes
app.include_router(auth_router, prefix=f"{OPEN_API_PREFIX}/auth", tags=["Auth"])
app.include_router(
    scraper_router, prefix=f"{OPEN_API_PREFIX}/scraper", tags=["Scraper"]
)
app.include_router(users_router, prefix=f"{OPEN_API_PREFIX}/users", tags=["Users"])
