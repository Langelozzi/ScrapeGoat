"""
Email/password authentication provider implementation.
"""

import bcrypt
from typing import Tuple
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db.models.user import User
from app.shared.db.models.user_auth import UserAuth
from app.modules.auth.base import AuthProvider
from app.modules.auth.models import LoginRequest, RegisterRequest
from .dao import (
    get_user_by_email,
    get_auth_provider,
    get_user_auth_by_provider,
    create_user,
    create_user_auth,
)


EMAIL_AUTH_PROVIDER = "email"


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


class EmailAuthProvider(AuthProvider):
    """
    Email/password authentication provider.
    
    Implements the AuthProvider interface for email-based authentication.
    """
    
    @property
    def provider_name(self) -> str:
        return EMAIL_AUTH_PROVIDER
    
    async def register(
        self,
        db: AsyncSession,
        **kwargs
    ) -> Tuple[User, dict]:
        """
        Register a new user with email/password.
        
        Args:
            db: Database session
            **kwargs: Should contain 'email', 'password', 'first_name', 'last_name'
            
        Returns:
            Tuple of (User, provider_data)
        """
        # Extract request data
        request = RegisterRequest(**kwargs)
        
        # Check if email already exists
        existing_user = await get_user_by_email(db, request.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Verify email auth provider exists
        auth_provider = await get_auth_provider(db)
        if not auth_provider or not auth_provider.is_enabled:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Email authentication is not available"
            )
        
        # Hash password
        password_hash = hash_password(request.password)
        
        # Create user
        user = User(
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
        )
        user = await create_user(db, user)
        
        # Create provider data
        provider_data = {
            "password_hash": password_hash,
            "external_user_id": None,
            "external_user": None
        }
        
        return user, provider_data
    
    async def authenticate(
        self,
        db: AsyncSession,
        **kwargs
    ) -> Tuple[User, dict]:
        """
        Authenticate a user with email/password.
        
        Args:
            db: Database session
            **kwargs: Should contain 'email' and 'password'
            
        Returns:
            Tuple of (User, provider_data)
        """
        # Extract request data
        request = LoginRequest(**kwargs)
        
        # Get user by email
        user = await get_user_by_email(db, request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Get user auth for email provider
        user_auth = await get_user_auth_by_provider(db, str(user.id))
        
        # Check password (try user_auth first, fall back to user table for backward compatibility)
        password_hash = user_auth.password_hash if user_auth else user.password_hash
        if not verify_password(request.password, password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Return provider data
        provider_data = {
            "password_hash": password_hash,
            "external_user_id": user_auth.external_user_id if user_auth else None,
            "external_user": user_auth.external_user if user_auth else None
        }
        
        return user, provider_data
    
    async def get_user_auth_data(
        self,
        db: AsyncSession,
        user_id: str
    ) -> dict:
        """
        Get the authentication data for a user from email provider.
        
        Args:
            db: Database session
            user_id: The user's ID
            
        Returns:
            The provider's auth data dict
        """
        user_auth = await get_user_auth_by_provider(db, user_id)
        
        if not user_auth:
            return {}
        
        return {
            "password_hash": user_auth.password_hash,
            "external_user_id": user_auth.external_user_id,
            "external_user": user_auth.external_user
        }

