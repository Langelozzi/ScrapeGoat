"""
Authentication dependencies for use in other modules.

This provides a clean interface for protecting routes with authentication.
"""

from typing import Optional
from fastapi import Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db.session import get_db
from app.shared.models.auth_user import AuthUser
from app.modules.auth.helpers import get_token_from_cookie, decode_access_token
from app.shared.db.models.user import User
from sqlalchemy import select
from sqlalchemy.orm import selectinload


async def get_current_user_from_token(
    db: AsyncSession,
    token: str
) -> Optional[User]:
    """
    Get the current authenticated user from a JWT token.
    Returns None if token is invalid or user not found.
    """
    # Decode token
    payload = decode_access_token(token)
    if not payload:
        return None

    # Extract user ID
    user_id = payload.get("sub")
    if not user_id:
        return None

    # Get user
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.auth_providers))
    )
    user = result.scalar_one_or_none()
    return user


async def get_current_user_dependency(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Optional[AuthUser]:
    """
    Dependency to get the current authenticated user.
    Tries to get token from cookie first, then from Authorization header.
    Returns None if not authenticated (allows optional authentication).
    
    Usage:
        @router.get("/my-route")
        async def my_route(user: Optional[AuthUser] = Depends(get_current_user_dependency)):
            if user:
                # User is authenticated
                pass
            else:
                # User is not authenticated
                pass
    """
    # Try to get token from cookie first
    token = get_token_from_cookie(request)
    
    if not token:
        return None
    
    # Get user from token
    user = await get_current_user_from_token(db, token)
    if not user:
        return None
    
    return AuthUser(
        user_id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name
    )


def require_auth(
    current_user: Optional[AuthUser] = Depends(get_current_user_dependency),
) -> AuthUser:
    """
    Dependency that requires authentication.
    Raises 401 if user is not authenticated.
    
    Usage:
        @router.get("/protected-route")
        async def protected_route(user: AuthUser = Depends(require_auth)):
            # User is guaranteed to be authenticated here
            user_id = user.user_id
            email = user.email
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return current_user


# Convenience aliases for backward compatibility
get_current_user = get_current_user_dependency
require_authentication = require_auth
