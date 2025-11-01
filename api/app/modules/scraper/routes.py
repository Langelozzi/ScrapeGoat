from fastapi import APIRouter, Depends

from app.modules.scraper.models import BuildDomTreeRequest
from app.shared.models.html import DOMTree
from app.shared.models.scrape import ScrapeConfig, ScrapedDataset
from .service import build_dom_tree, scrape
from app.shared.models.auth_user import AuthUser
from app.modules.auth.dependencies import require_auth

router = APIRouter()


@router.get("/health")
def get_health_check():
    return {"status": "OK"}


@router.post("/dom-tree/build")
def post_build_dom_tree(
    req: BuildDomTreeRequest, current_user: AuthUser = Depends(require_auth)
) -> DOMTree:
    return build_dom_tree(req.url)


@router.post("/scrape")
def post_scrape(
    config: ScrapeConfig, current_user: AuthUser = Depends(require_auth)
) -> ScrapedDataset:
    return scrape(config)
