from fastapi import APIRouter, Body, Depends, Query
from fastapi.responses import StreamingResponse

from app.modules.scraper.models import BuildDomTreeRequest
from app.shared.helpers.dict_helpers import to_json_stream
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
    req: BuildDomTreeRequest, _: AuthUser = Depends(require_auth)
) -> DOMTree:
    return build_dom_tree(req.url)


@router.post("/scrape")
def post_scrape(
    config: ScrapeConfig, _: AuthUser = Depends(require_auth)
) -> ScrapedDataset:
    return scrape(config)


@router.post("/export/json")
def export_json(
    filename: str = Query(
        "data.json", description="Filename for the downloaded JSON file."
    ),
    data: dict = Body(..., description="JSON data to include in the file"),
    _: AuthUser = Depends(require_auth),
):
    if not filename.lower().endswith(".json"):
        filename += ".json"

    file_stream = to_json_stream(data)

    return StreamingResponse(
        file_stream,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
