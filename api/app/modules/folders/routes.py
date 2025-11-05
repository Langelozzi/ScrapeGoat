from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.folders.models import FolderCreateRequest, FolderResponse
from app.modules.folders.service import (
    create_folder,
    get_all_folders_by_user_id,
    get_user_root_folder,
)
from app.shared.db.session import get_db
from app.shared.models.auth_user import AuthUser
from app.modules.auth.dependencies import require_auth

router = APIRouter()


@router.get("/health")
def handle_get_health_check():
    return {"status": "OK"}


@router.get("")
async def handle_get_all_folders(
    db: AsyncSession = Depends(get_db), current_user: AuthUser = Depends(require_auth)
):
    return await get_all_folders_by_user_id(db, current_user.user_id)


@router.get("/root")
async def handle_get_user_root_folder(
    db: AsyncSession = Depends(get_db),
    current_user: AuthUser = Depends(require_auth),
):
    return await get_user_root_folder(db, current_user.user_id)


@router.post("")
async def handle_create_folder(
    folder: FolderCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: AuthUser = Depends(require_auth),
) -> FolderResponse:
    return await create_folder(db, folder.to_model(), current_user.user_id)
