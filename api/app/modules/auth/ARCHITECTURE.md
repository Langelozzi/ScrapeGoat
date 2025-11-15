# Auth Module Architecture

## Overview

The authentication module uses an **Abstract Base Class (ABC) pattern** to provide a generic interface for multiple authentication providers. This allows you to add new auth methods (Google OAuth, GitHub OAuth, etc.) without changing the core authentication logic.

## Directory Structure

```
auth/
├── __init__.py              # Module exports
├── base.py                  # Abstract base class for auth providers
├── models.py                # Pydantic request/response models
├── helpers.py               # Cookie management, JWT utilities
├── dependencies.py          # FastAPI dependencies for route protection
├── routes.py                # API endpoints (clean, no business logic)
├── providers/
│   ├── __init__.py
│   ├── email/
│   │   ├── __init__.py
│   │   ├── service.py      # EmailAuthProvider implementation
│   │   └── dao.py          # Email-specific database operations
│   └── README.md           # Guide for adding new providers
├── example_usage.py        # Usage examples
├── README.md               # Full documentation
├── QUICK_START.md          # Quick start guide
└── ARCHITECTURE.md         # This file
```

## Core Components

### 1. Base Class (`base.py`)

Defines the interface that all auth providers must implement:

```python
class AuthProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """The unique name of this auth provider"""
        pass

    @abstractmethod
    async def register(self, db: AsyncSession, **kwargs) -> Tuple[User, dict]:
        """Register a new user"""
        pass

    @abstractmethod
    async def authenticate(self, db: AsyncSession, **kwargs) -> Tuple[User, dict]:
        """Authenticate a user"""
        pass

    @abstractmethod
    async def get_user_auth_data(self, db: AsyncSession, user_id: str) -> dict:
        """Get auth data for a user"""
        pass
```

### 2. Email Provider (`providers/email/`)

Implements the `AuthProvider` interface for email/password authentication:

```python
class EmailAuthProvider(AuthProvider):
    @property
    def provider_name(self) -> str:
        return "email"

    async def register(self, db: AsyncSession, **kwargs) -> Tuple[User, dict]:
        # Email-specific registration logic
        pass

    async def authenticate(self, db: AsyncSession, **kwargs) -> Tuple[User, dict]:
        # Email-specific authentication logic
        pass

    async def get_user_auth_data(self, db: AsyncSession, user_id: str) -> dict:
        # Get email auth data
        pass
```

### 3. Helpers (`helpers.py`)

Utility functions for cookie management and JWT handling:

```python
# Cookie management
def get_token_from_cookie(request: Request) -> Optional[str]
def set_auth_cookie(response: Response, token: str) -> None
def clear_auth_cookie(response: Response) -> None

# JWT utilities
def create_access_token(user_id: str, email: str) -> str
def decode_access_token(token: str) -> Optional[dict]
def extract_user_id_from_token(token: str) -> Optional[str]
```

### 4. Dependencies (`dependencies.py`)

FastAPI dependencies for route protection:

```python
# Get current user (optional auth)
async def get_current_user_dependency(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Optional[AuthResponse]

# Require authentication
def require_auth(
    current_user: Optional[AuthResponse] = Depends(get_current_user_dependency)
) -> AuthResponse
```

### 5. Routes (`routes.py`)

Clean API endpoints with no business logic:

```python
@router.post("/register")
async def handle_register(request: RegisterRequest, response: Response, db: AsyncSession):
    # Use the email provider
    user, provider_data = await email_provider.register(db, **request.dict())
    # Create UserAuth record
    # Set cookie
    # Return response
```

## How It Works

### Registration Flow

```
1. Request → routes.py
2. routes.py → EmailAuthProvider.register()
3. EmailAuthProvider → email/dao.py (database operations)
4. EmailAuthProvider → helpers.py (create JWT token)
5. routes.py → helpers.py (set cookie)
6. Response ← routes.py
```

### Authentication Flow

```
1. Request with cookie → routes.py
2. routes.py → helpers.py (extract token from cookie)
3. helpers.py → decode JWT token
4. dependencies.py → get user from database
5. Return AuthResponse
```

### Adding a New Provider

To add Google OAuth (for example):

```
1. Create providers/google/
   ├── __init__.py
   ├── service.py (GoogleAuthProvider)
   └── dao.py (Google-specific DB operations)

2. Implement AuthProvider interface:
   class GoogleAuthProvider(AuthProvider):
       @property
       def provider_name(self) -> str:
           return "google"

       async def register(self, db, **kwargs):
           # Google OAuth registration logic
           pass

       async def authenticate(self, db, **kwargs):
           # Google OAuth authentication logic
           pass

       async def get_user_auth_data(self, db, user_id):
           # Get Google auth data
           pass

3. Add routes in routes.py:
   @router.post("/google")
   async def handle_google_auth(request: GoogleRequest, response: Response, db):
       user, provider_data = await google_provider.authenticate(db, **request.dict())
       # ... rest of logic
```

## Benefits of This Architecture

### 1. Separation of Concerns

- **routes.py**: Only endpoint definitions
- **helpers.py**: Cookie and JWT utilities
- **dependencies.py**: FastAPI dependencies
- **providers/**: Provider-specific logic
- **base.py**: Interface definition

### 2. Easy to Extend

Adding a new auth provider is straightforward:

1. Create a new provider directory
2. Implement the `AuthProvider` interface
3. Add routes in `routes.py`

No need to modify existing code!

### 3. Testability

Each component can be tested independently:

- Test providers in isolation
- Mock dependencies in routes
- Test helpers separately

### 4. Reusability

- Providers can be reused across different routes
- Helpers are available to any module
- Dependencies work with any provider

## Example: Using Multiple Providers

```python
# In routes.py
from app.modules.auth.providers.email import EmailAuthProvider
from app.modules.auth.providers.google import GoogleAuthProvider

email_provider = EmailAuthProvider()
google_provider = GoogleAuthProvider()

@router.post("/login/email")
async def login_email(request: LoginRequest, response: Response, db: AsyncSession):
    user, provider_data = await email_provider.authenticate(db, **request.dict())
    # ... set cookie, return response

@router.post("/login/google")
async def login_google(request: GoogleRequest, response: Response, db: AsyncSession):
    user, provider_data = await google_provider.authenticate(db, **request.dict())
    # ... set cookie, return response

# Both endpoints work with the same dependencies!
@router.get("/me")
async def get_me(user: AuthResponse = Depends(require_auth)):
    return user  # Works regardless of which provider was used!
```

## Database Schema

The module uses three main tables:

### `users`

Core user information (email, name, etc.)

### `user_auth`

Links users to specific auth providers:

- `user_id`: Foreign key to users
- `provider`: Provider name (e.g., "email", "google")
- `password_hash`: Provider-specific credentials
- `external_user_id`: OAuth user ID (for OAuth providers)
- `external_user`: JSONB field for provider-specific data

### `auth_providers`

Lookup table for available providers:

- `name`: Provider identifier
- `display_name`: Human-readable name
- `is_enabled`: Whether provider is active

## Security Features

1. **HTTP-Only Cookies**: Prevents XSS attacks
2. **Secure Cookies**: Only sent over HTTPS (configurable)
3. **bcrypt Hashing**: Industry-standard password security
4. **JWT Expiration**: Tokens expire after 24 hours
5. **SameSite Cookies**: CSRF protection
6. **CORS with Credentials**: Secure cross-origin requests

## Summary

This architecture provides:

- ✅ Clean separation of concerns
- ✅ Easy to extend with new providers
- ✅ Testable components
- ✅ Reusable code
- ✅ Generic interface that routes don't need to know about
- ✅ Provider-specific logic isolated in providers/

The key insight is that **routes don't care which provider is used** - they just use the `AuthProvider` interface and let the provider handle the details!
