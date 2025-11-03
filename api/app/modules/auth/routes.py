"""
Authentication API endpoints.

This module contains only the FastAPI route definitions.
All helper functions and business logic are in other modules.
"""

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db.session import get_db
from app.modules.auth.helpers import set_auth_cookie, clear_auth_cookie, create_access_token
from app.modules.auth.models import (
    LoginRequest,
    RegisterRequest,
    AuthUser,
    LogoutResponse,
    AuthStatusResponse,
)
from app.modules.auth.dependencies import (
    get_current_user_dependency,
    require_auth,
)
from app.modules.auth.providers.email import EmailAuthProvider
from app.shared.db.models.user_auth import UserAuth


router = APIRouter()

# Initialize the email auth provider
email_provider = EmailAuthProvider()


@router.post("/register", response_model=AuthUser, status_code=201)
async def handle_register(
    request: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Register a new user with email/password.
    Returns user info and sets HTTP-only cookie with JWT token.
    """
    # Register user using email provider
    user, provider_data = await email_provider.register(
        db,
        email=request.email,
        password=request.password,
        first_name=request.first_name,
        last_name=request.last_name
    )
    
    # Create UserAuth record
    user_auth = UserAuth(
        user_id=user.id,
        provider=email_provider.provider_name,
        password_hash=provider_data["password_hash"],
        external_user_id=provider_data["external_user_id"],
        external_user=provider_data["external_user"]
    )
    db.add(user_auth)
    await db.commit()
    
    # Create JWT token
    access_token = create_access_token(str(user.id), user.email)
    
    # Set HTTP-only cookie
    set_auth_cookie(response, access_token)
    
    return AuthUser(
        user_id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )


@router.post("/login", response_model=AuthUser)
async def handle_login(
    request: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Login with email/password.
    Returns user info and sets HTTP-only cookie with JWT token.
    """
    # Authenticate user using email provider
    user, provider_data = await email_provider.authenticate(
        db,
        email=request.email,
        password=request.password
    )
    
    # Create JWT token
    access_token = create_access_token(str(user.id), user.email)
    
    # Set HTTP-only cookie
    set_auth_cookie(response, access_token)
    
    return AuthUser(
        user_id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )


@router.post("/logout", response_model=LogoutResponse)
async def handle_logout(response: Response):
    """
    Logout the current user.
    Clears the HTTP-only cookie.
    """
    clear_auth_cookie(response)
    return LogoutResponse(message="Logged out successfully")


@router.get("/me", response_model=AuthUser)
async def handle_get_current_user(
    current_user: AuthUser = Depends(require_auth),
):
    """
    Get the current authenticated user's information.
    Requires authentication.
    """
    return current_user


@router.get("/status", response_model=AuthStatusResponse)
async def handle_auth_status(
    current_user = Depends(get_current_user_dependency),
):
    """
    Check authentication status.
    Returns whether the user is authenticated and their info if they are.
    Does not require authentication.
    """
    return AuthStatusResponse(
        is_authenticated=current_user is not None,
        user=current_user
    )


@router.get("/health")
def handle_get_health_check():
    """Health check endpoint for auth module"""
    return {"status": "OK"}
