from typing import Optional
from pydantic import BaseModel, EmailStr, Field

from app.shared.models.auth_user import AuthUser


class LoginRequest(BaseModel):
    """Request model for email/password login"""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Request model for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class LogoutResponse(BaseModel):
    """Response model for logout"""
    message: str = "Logged out successfully"


class AuthStatusResponse(BaseModel):
    """Response model for checking authentication status"""
    is_authenticated: bool
    user: Optional[AuthUser] = None

