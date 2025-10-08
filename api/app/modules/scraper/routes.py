from fastapi import APIRouter

from app.modules.scraper.models import BuildDomTreeRequest
from app.shared.models.html import DOMTree
from app.shared.models.scrape import ScrapeConfig, ScrapedDataset
from .service import build_dom_tree, scrape

router = APIRouter()


@router.get("/health")
def get_health_check():
    return {"status": "OK"}


@router.post("/dom-tree/build")
def post_build_dom_tree(req: BuildDomTreeRequest) -> DOMTree:
    return build_dom_tree(req.url)


@router.post("/scrape")
def post_scrape(config: ScrapeConfig) -> ScrapedDataset:
    return scrape(config)
