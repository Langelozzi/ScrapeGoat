from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.configs.models import (
    ConfigCreateRequest,
    ConfigDeleteResponse,
    ConfigResponse,
)
from app.modules.configs.service import (
    create_config,
    delete_config,
    get_all_configs_by_user_id,
    get_config,
    update_config,
)
from app.shared.db.session import get_db
from app.shared.models.auth_user import AuthUser
from app.modules.auth.dependencies import require_auth

router = APIRouter()


@router.get("/health")
def handle_get_health_check():
    return {"status": "OK"}


@router.get("")
async def handle_get_all_configs(
    db: AsyncSession = Depends(get_db), current_user: AuthUser = Depends(require_auth)
) -> list[ConfigResponse]:
    configs = await get_all_configs_by_user_id(db, current_user.user_id)
    return list(map(ConfigResponse.from_model, configs))


@router.get("/{id}")
async def handle_get_config(
    id: str,
    db: AsyncSession = Depends(get_db),
    _: AuthUser = Depends(require_auth),
) -> ConfigResponse:
    config = await get_config(db, id)
    if config is None:
        raise HTTPException(status_code=404, detail="Config not found")
    return ConfigResponse.from_model(config)


@router.post("")
async def handle_create_config(
    config: ConfigCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: AuthUser = Depends(require_auth),
) -> ConfigResponse:
    config = await create_config(db, config.to_model(), current_user.user_id)
    return ConfigResponse.from_model(config)


@router.put("/{id}")
async def handle_update_config(
    id: str,
    config: ConfigCreateRequest,
    db: AsyncSession = Depends(get_db),
    _: AuthUser = Depends(require_auth),
) -> ConfigResponse:
    config = await update_config(db, id, config.to_model())
    if config is None:
        raise HTTPException(status_code=404, detail="Config not found")
    return ConfigResponse.from_model(config)


@router.delete("/{id}")
async def handle_delete_config(
    id: str,
    db: AsyncSession = Depends(get_db),
    _: AuthUser = Depends(require_auth),
) -> ConfigDeleteResponse:
    deleted = await delete_config(db, id)
    status = "successful" if deleted else "failed"
    message = f"Deletion {status} for config with id: {id}"
    return ConfigDeleteResponse(deleted=deleted, message=message)
