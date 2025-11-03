"""
Authentication module for FastAPI.

This module provides JWT-based authentication with HTTP-only cookies.
It supports multiple authentication providers through a generic interface.

Main components:
- routes: FastAPI endpoints for authentication
- models: Pydantic request/response models
- base: Abstract base class for auth providers
- helpers: Cookie management and JWT utilities
- dependencies: Reusable auth dependencies for other modules
- providers: Provider-specific implementations (email, google, etc.)
"""

from .routes import router
from .dependencies import get_current_user, require_authentication, require_auth
from .models import (
    LoginRequest,
    RegisterRequest,
    AuthUser,
    LogoutResponse,
    AuthStatusResponse,
)
from .base import AuthProvider
from .providers.email import EmailAuthProvider

__all__ = [
    "router",
    "get_current_user",
    "require_authentication",
    "require_auth",
    "AuthProvider",
    "EmailAuthProvider",
    "LoginRequest",
    "RegisterRequest",
    "AuthUser",
    "LogoutResponse",
    "AuthStatusResponse",
]

