from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def handle_get_health_check():
    return {"status": "OK"}
