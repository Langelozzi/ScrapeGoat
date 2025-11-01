"""
Example usage of the authentication module in other routes.

This file demonstrates how to use the auth dependencies to protect routes.
You can use these patterns in any of your modules (scraper, users, etc.).

The auth module uses an abstract base class pattern, so routes don't need
to know which provider (email, Google, etc.) is being used.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db.session import get_db
from app.modules.auth import get_current_user, require_authentication, require_auth, AuthResponse

router = APIRouter()

# Note: You can use either require_authentication or require_auth
# They are aliases for the same function


# Example 1: Protected route (requires authentication)
@router.get("/protected")
async def protected_route(user: AuthResponse = Depends(require_authentication)):
    """
    This route requires authentication.
    If the user is not authenticated, they'll get a 401 error.
    """
    return {
        "message": f"Hello {user.first_name}!",
        "user_id": user.user_id,
        "email": user.email,
    }


# Example 2: Optional authentication
@router.get("/public-with-user-info")
async def public_route(
    user: Optional[AuthResponse] = Depends(get_current_user)
):
    """
    This route is public, but if the user is authenticated,
    we can show them personalized content.
    """
    if user:
        return {
            "message": f"Welcome back, {user.first_name}!",
            "user_id": user.user_id,
        }
    else:
        return {
            "message": "Welcome, guest!",
            "suggestion": "Sign up or log in for personalized content.",
        }


# Example 3: Admin-only route (requires authentication + role check)
@router.delete("/admin/delete-user/{user_id}")
async def admin_delete_user(
    user_id: str,
    current_user: AuthResponse = Depends(require_authentication),
    db: AsyncSession = Depends(get_db),
):
    """
    This route requires authentication AND admin privileges.
    """
    # Check if user is admin (you would implement this logic)
    # For now, just checking if email contains "admin"
    if "admin" not in current_user.email.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Perform admin action
    # ... your logic here ...
    
    return {
        "message": f"User {user_id} deleted by admin {current_user.email}",
    }


# Example 4: User-specific resource (requires authentication)
@router.get("/my-profile")
async def get_my_profile(
    current_user: AuthResponse = Depends(require_authentication),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the current user's profile.
    Only the authenticated user can access their own profile.
    """
    # Fetch user details from database
    # ... your logic here ...
    
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
    }


# Example 5: Resource with user context
@router.post("/scraper/run")
async def run_scraper(
    url: str,
    current_user: AuthResponse = Depends(require_authentication),
    db: AsyncSession = Depends(get_db),
):
    """
    Run a scraper and associate it with the current user.
    """
    # The current_user is automatically available
    # You can use current_user.user_id to associate the scraper with the user
    
    return {
        "message": f"Scraper started for {url}",
        "user_id": current_user.user_id,
        "status": "running",
    }


# Example 6: Conditional logic based on authentication
@router.get("/content")
async def get_content(
    user: Optional[AuthResponse] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Return different content based on authentication status.
    """
    if user:
        # Authenticated users get full content
        return {
            "content": "Full content for authenticated users",
            "premium_features": True,
            "user_email": user.email,
        }
    else:
        # Anonymous users get limited content
        return {
            "content": "Limited content for guests",
            "premium_features": False,
            "message": "Sign up for full access!",
        }


# Example 7: Using in scraper module (real-world example)
@router.get("/scraper/my-scrapes")
async def get_my_scrapes(
    current_user: AuthResponse = Depends(require_authentication),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all scrapes for the current user.
    This shows how to integrate auth with existing modules.
    """
    # You can now filter scrapes by current_user.user_id
    # ... your logic here ...
    
    return {
        "user_id": current_user.user_id,
        "scrapes": [],  # Your scrape data
    }


# Example 8: Creating a resource with user association
@router.post("/folders")
async def create_folder(
    folder_name: str,
    current_user: AuthResponse = Depends(require_authentication),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a folder for the current user.
    """
    # Create folder and associate with current_user.user_id
    # ... your logic here ...
    
    return {
        "message": f"Folder '{folder_name}' created",
        "user_id": current_user.user_id,
        "folder_name": folder_name,
    }


if __name__ == "__main__":
    """
    To use these examples in your actual modules:
    
    1. Copy the relevant route pattern to your module's routes.py
    2. Import the auth dependencies:
       from app.modules.auth import get_current_user, require_authentication, AuthResponse
    
    3. Add the dependency to your route function
    
    That's it! The auth module handles all the complexity for you.
    
    Architecture Notes:
    - The auth module uses an Abstract Base Class (ABC) pattern
    - Providers (email, Google, etc.) implement the AuthProvider interface
    - Routes don't need to know which provider is being used
    - All providers work with the same dependencies
    - See ARCHITECTURE.md for more details
    """
    pass

