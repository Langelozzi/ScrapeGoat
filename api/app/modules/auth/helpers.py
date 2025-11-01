"""
Helper functions for authentication (cookie management, token extraction, etc.)
"""

from typing import Optional
from fastapi import Request, Response
import jwt
from datetime import datetime, timedelta

from app.shared.config import settings


# Constants
COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = 24 * 60 * 60  # 24 hours in seconds
COOKIE_HTTP_ONLY = True
COOKIE_SECURE = True  # Set to True in production with HTTPS
COOKIE_SAME_SITE = "lax"

JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24


def get_token_from_cookie(request: Request) -> Optional[str]:
    """Extract JWT token from HTTP-only cookie"""
    return request.cookies.get(COOKIE_NAME)


def set_auth_cookie(response: Response, token: str) -> None:
    """Set HTTP-only cookie with JWT token"""
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=COOKIE_HTTP_ONLY,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAME_SITE,
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    """Clear the authentication cookie"""
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=COOKIE_HTTP_ONLY,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAME_SITE,
        path="/",
    )


def create_access_token(user_id: str, email: str) -> str:
    """Create a JWT access token"""
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT access token"""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def extract_user_id_from_token(token: str) -> Optional[str]:
    """Extract user ID from a JWT token"""
    payload = decode_access_token(token)
    if not payload:
        return None
    return payload.get("sub")

