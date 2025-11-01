# Adding New Authentication Providers

This guide shows how to add new authentication providers (like Google OAuth, GitHub OAuth, etc.) to the system.

## Architecture Overview

The auth system uses an **Abstract Base Class (ABC) pattern** with a generic provider interface:

```
┌─────────────────────────────────────────────────────────┐
│                     AuthProvider (ABC)                   │
│  - provider_name: str                                    │
│  - register(db, **kwargs) -> (User, dict)               │
│  - authenticate(db, **kwargs) -> (User, dict)           │
│  - get_user_auth_data(db, user_id) -> dict              │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│ EmailAuthProvider│    │ GoogleAuthProvider│
│ (implemented)    │    │ (future)          │
└─────────────────┘    └─────────────────┘
```

All providers implement the same interface, so routes don't need to know which provider is being used!

```
┌─────────────────────────────────────────────────────────┐
│                     Routes Layer                         │
│  /auth/login, /auth/register, /auth/google, etc.        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Service Layer                           │
│  register_user(), login_user(), google_oauth()           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   DAO Layer                              │
│  dao_get_user_by_email(), dao_create_user_auth()        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Database Models                          │
│  User, UserAuth, AuthProvider                            │
└─────────────────────────────────────────────────────────┘
```

## Step-by-Step: Adding Google OAuth

### 1. Update Database

Add Google OAuth to the auth providers table:

```python
# In a migration or seed script
from app.shared.db.models.auth_provider import AuthProvider

google_provider = AuthProvider(
    name="google",
    display_name="Google",
    is_enabled=True
)
db.add(google_provider)
db.commit()
```

### 2. Add Provider-Specific Models

```python
# In app/modules/auth/models.py

class GoogleOAuthRequest(BaseModel):
    """Request model for Google OAuth callback"""
    code: str
    state: Optional[str] = None


class GoogleOAuthResponse(BaseModel):
    """Response model for Google OAuth"""
    user_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    provider: str = "google"
```

### 3. Create Provider Directory and Files

```bash
mkdir -p app/modules/auth/providers/google
touch app/modules/auth/providers/google/__init__.py
touch app/modules/auth/providers/google/service.py
touch app/modules/auth/providers/google/dao.py
```

### 4. Implement the AuthProvider Interface

```python
# In app/modules/auth/providers/google/service.py

import httpx
from typing import Tuple
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db.models.user import User
from app.modules.auth.base import AuthProvider
from app.modules.auth.models import GoogleOAuthRequest
from .dao import (
    get_user_auth_by_external_id,
    get_user_by_email,
    create_user,
    create_user_auth,
)

GOOGLE_AUTH_PROVIDER = "google"


class GoogleAuthProvider(AuthProvider):
    """
    Google OAuth authentication provider.

    Implements the AuthProvider interface for Google-based authentication.
    """

    @property
    def provider_name(self) -> str:
        return GOOGLE_AUTH_PROVIDER

    async def register(
        self,
        db: AsyncSession,
        **kwargs
    ) -> Tuple[User, dict]:
        """
        Register a new user via Google OAuth.
        """
        # Google OAuth doesn't have a separate registration flow
        # Users are registered during the first authentication
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth does not support separate registration"
        )

    async def authenticate(
        self,
        db: AsyncSession,
        **kwargs
    ) -> Tuple[User, dict]:
        """
        Authenticate a user via Google OAuth.
        """
        # Extract request data
        request = GoogleOAuthRequest(**kwargs)

        # 1. Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": request.code,
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "redirect_uri": settings.google_redirect_uri,
                    "grant_type": "authorization_code",
                }
            )
            token_data = token_response.json()
            access_token = token_data["access_token"]

        # 2. Get user info from Google
        async with httpx.AsyncClient() as client:
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            user_info = user_info_response.json()

        # 3. Find or create user
        google_id = user_info["id"]
        email = user_info["email"]

        # Check if user exists with this Google account
        user_auth = await get_user_auth_by_external_id(db, google_id, GOOGLE_AUTH_PROVIDER)

        if user_auth:
            # Existing user - login
            user = await get_user_with_auth(db, str(user_auth.user_id))
        else:
            # Check if email exists but with different provider
            user = await get_user_by_email(db, email)

            if user:
                # Email exists - add Google auth to existing account
                user_auth = UserAuth(
                    user_id=user.id,
                    provider=GOOGLE_AUTH_PROVIDER,
                    external_user_id=google_id,
                    external_user=user_info,
                    password_hash=""  # Not used for OAuth
                )
                await create_user_auth(db, user_auth)
            else:
                # New user - create account
                user = User(
                    email=email,
                    first_name=user_info.get("given_name"),
                    last_name=user_info.get("family_name"),
                    password_hash=""  # Not used for OAuth
                )
                user = await create_user(db, user)

                user_auth = UserAuth(
                    user_id=user.id,
                    provider=GOOGLE_AUTH_PROVIDER,
                    external_user_id=google_id,
                    external_user=user_info,
                    password_hash=""
                )
                await create_user_auth(db, user_auth)

        # 4. Return provider data
        provider_data = {
            "password_hash": "",
            "external_user_id": google_id,
            "external_user": user_info
        }

        return user, provider_data

    async def get_user_auth_data(
        self,
        db: AsyncSession,
        user_id: str
    ) -> dict:
        """Get Google auth data for a user"""
        user_auth = await get_user_auth_by_provider(db, user_id, GOOGLE_AUTH_PROVIDER)

        if not user_auth:
            return {}

        return {
            "password_hash": user_auth.password_hash,
            "external_user_id": user_auth.external_user_id,
            "external_user": user_auth.external_user
        }
```

### 5. Add Provider-Specific Routes

```python
# In app/modules/auth/routes.py

from app.modules.auth.models import GoogleOAuthRequest, GoogleOAuthResponse
from app.modules.auth.providers.google import GoogleAuthProvider
from app.modules.auth.helpers import set_auth_cookie, create_access_token
from app.shared.db.models.user_auth import UserAuth

# Initialize the Google auth provider
google_provider = GoogleAuthProvider()

@router.post("/google", response_model=GoogleOAuthResponse)
async def handle_google_oauth(
    request: GoogleOAuthRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Authenticate with Google OAuth.
    """
    # Authenticate user using Google provider
    user, provider_data = await google_provider.authenticate(db, **request.dict())

    # Create UserAuth record
    user_auth = UserAuth(
        user_id=user.id,
        provider=google_provider.provider_name,
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

    return GoogleOAuthResponse(
        user_id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        provider="google"
    )


@router.get("/google/authorize")
async def handle_google_authorize():
    """
    Redirect to Google OAuth authorization page.
    """
    from fastapi.responses import RedirectResponse

    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.google_client_id}"
        f"&redirect_uri={settings.google_redirect_uri}"
        "&response_type=code"
        "&scope=openid email profile"
        "&access_type=offline"
    )

    return RedirectResponse(url=auth_url)
```

### 5. Update Configuration

```python
# In app/shared/config.py

class AppSettings(BaseModel):
    db_connection_string: str = Field(..., alias="DB_CONNECTION_STRING")
    frontend_url: str = Field(..., alias="FRONTEND_URL")
    jwt_secret_key: str = Field(..., alias="JWT_SECRET_KEY")

    # Google OAuth
    google_client_id: str = Field(..., alias="GOOGLE_CLIENT_ID")
    google_client_secret: str = Field(..., alias="GOOGLE_CLIENT_SECRET")
    google_redirect_uri: str = Field(..., alias="GOOGLE_REDIRECT_URI")
```

### 6. Update Environment Variables

```env
# In .env file
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

### 7. Update Requirements

```txt
# In requirements.txt
httpx  # For making HTTP requests to OAuth providers
```

## Frontend Integration

### Google OAuth Flow

```javascript
// 1. Redirect to Google
window.location.href = "http://localhost:8000/api/v1/auth/google/authorize";

// 2. Google redirects back with code
// 3. Exchange code for session
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

const response = await fetch("http://localhost:8000/api/v1/auth/google", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({ code }),
});

const data = await response.json();
// Cookie is automatically set!
```

## Adding Other Providers

The same pattern works for any OAuth provider:

### GitHub OAuth

```python
async def github_oauth_login(db: AsyncSession, request: GitHubOAuthRequest):
    # Exchange code for token
    # Get user info from GitHub API
    # Find or create user
    # Return user and JWT token
```

### Microsoft OAuth

```python
async def microsoft_oauth_login(db: AsyncSession, request: MicrosoftOAuthRequest):
    # Exchange code for token
    # Get user info from Microsoft Graph API
    # Find or create user
    # Return user and JWT token
```

### Magic Link Authentication

```python
async def send_magic_link(db: AsyncSession, email: str):
    # Generate unique token
    # Send email with magic link
    # Store token in database with expiration

async def verify_magic_link(db: AsyncSession, token: str):
    # Verify token
    # Find or create user
    # Return user and JWT token
```

## Benefits of This Architecture

1. **Routes don't change**: The `/auth/me` and `/auth/status` endpoints work for all providers
2. **Dependencies don't change**: `require_authentication` works regardless of auth method
3. **Database structure is flexible**: Can store provider-specific data in `external_user` JSONB field
4. **Easy to add providers**: Just implement the provider-specific logic
5. **Multiple providers per user**: Users can link multiple auth methods to one account

## Testing New Providers

```bash
# Test Google OAuth
curl -X GET http://localhost:8000/api/v1/auth/google/authorize

# After Google callback
curl -X POST http://localhost:8000/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{"code":"google-auth-code"}' \
  -c cookies.txt

# Verify authentication
curl http://localhost:8000/api/v1/auth/me -b cookies.txt
```

## Summary

Adding a new auth provider involves:

1. ✅ Add provider to `auth_providers` table
2. ✅ Create provider directory (`providers/google/`)
3. ✅ Create provider-specific models
4. ✅ Implement `AuthProvider` interface in `service.py`
5. ✅ Create provider-specific DAO functions in `dao.py`
6. ✅ Add provider-specific routes in `routes.py`
7. ✅ Update configuration
8. ✅ Update environment variables
9. ✅ Update requirements.txt

The core authentication system remains unchanged, and all existing routes continue to work!

## Key Benefits of the ABC Pattern

1. **Consistent Interface**: All providers implement the same methods
2. **Routes Don't Change**: `/auth/me` works regardless of provider
3. **Easy to Test**: Each provider can be tested independently
4. **Type Safety**: ABC ensures all providers implement required methods
5. **Clear Documentation**: Interface shows exactly what each provider must do
