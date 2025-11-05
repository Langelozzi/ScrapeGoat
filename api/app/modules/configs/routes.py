from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.configs.models import ConfigCreateRequest, ConfigResponse
from app.modules.configs.service import create_config, get_all_configs_by_user_id
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


@router.post("")
async def handle_create_config(
    config: ConfigCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: AuthUser = Depends(require_auth),
) -> ConfigResponse:
    config = await create_config(db, config.to_model(), current_user.user_id)
    return ConfigResponse.from_model(config)
