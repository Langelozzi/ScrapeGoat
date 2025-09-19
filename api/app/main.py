from fastapi import FastAPI
from app.modules.scraper.routes import router as scraper_router

app = FastAPI()

OPEN_API_PREFIX = "/api/v1"
# Register the routes
app.include_router(
    scraper_router, prefix=f"{OPEN_API_PREFIX}/scraper", tags=["Scraper"]
)
