from fastapi import APIRouter

from app.modules.scraper.models import BuildDomTreeRequest
from app.shared.models.html import ScrapeGoatDOMTree
from .service import build_dom_tree

router = APIRouter()


@router.get("/health")
def get_health_check():
    return {"status": "OK"}


@router.post("/dom-tree/build")
def post_build_tree(req: BuildDomTreeRequest) -> ScrapeGoatDOMTree:
    return build_dom_tree(req.url)
