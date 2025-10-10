from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.service import get_all_users, get_user
from app.shared.db.session import get_db

router = APIRouter()


@router.get("/health")
def handle_get_health_check():
    return {"status": "OK"}


@router.get("")
async def handle_get_all_users(db: AsyncSession = Depends(get_db)):
    return await get_all_users(db)


@router.get("/{id}")
async def handle_get_user(id: str, db: AsyncSession = Depends(get_db)):
    return await get_user(db, id)


# @router.post("")
# def post_build_dom_tree(req: BuildDomTreeRequest) -> ScrapeGoatDOMTree:
#     return build_dom_tree(req.url)
