from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.scraper.routes import router as scraper_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["Accept","Content-Type"],
)

OPEN_API_PREFIX = "/api/v1"
# Register the routes
app.include_router(
    scraper_router, prefix=f"{OPEN_API_PREFIX}/scraper", tags=["Scraper"]
)
