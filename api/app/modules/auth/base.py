"""
Abstract base class for authentication providers.

This module defines the interface that all authentication providers must implement.
"""

from abc import ABC, abstractmethod
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db.models.user import User


class AuthProvider(ABC):
    """
    Abstract base class for authentication providers.
    
    All authentication providers (email, Google OAuth, GitHub OAuth, etc.)
    must implement these methods.
    """
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """
        The unique name of this auth provider (e.g., 'email', 'google', 'github').
        This should match the name in the auth_providers table.
        """
        pass
    
    @abstractmethod
    async def register(
        self,
        db: AsyncSession,
        **kwargs
    ) -> Tuple[User, dict]:
        """
        Register a new user with this auth provider.
        
        Args:
            db: Database session
            **kwargs: Provider-specific registration data
            
        Returns:
            Tuple of (User, provider_data) where provider_data is a dict
            that will be stored in the UserAuth record
            
        Raises:
            HTTPException: If registration fails
        """
        pass
    
    @abstractmethod
    async def authenticate(
        self,
        db: AsyncSession,
        **kwargs
    ) -> Tuple[User, dict]:
        """
        Authenticate a user with this auth provider.
        
        Args:
            db: Database session
            **kwargs: Provider-specific authentication data
            
        Returns:
            Tuple of (User, provider_data) where provider_data is a dict
            that will be stored/updated in the UserAuth record
            
        Raises:
            HTTPException: If authentication fails
        """
        pass
    
    @abstractmethod
    async def get_user_auth_data(
        self,
        db: AsyncSession,
        user_id: str
    ) -> Optional[dict]:
        """
        Get the authentication data for a user from this provider.
        
        Args:
            db: Database session
            user_id: The user's ID
            
        Returns:
            The provider's auth data dict, or None if not found
        """
        pass

