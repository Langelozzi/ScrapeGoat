# Authentication Module

This module provides JWT-based authentication with HTTP-only cookies for the FastAPI application. It supports multiple authentication providers through a generic interface.

## Features

- ✅ JWT-based authentication
- ✅ HTTP-only cookies for secure token storage
- ✅ Email/password authentication
- ✅ Password hashing with bcrypt
- ✅ Generic auth provider interface
- ✅ Easy-to-use dependencies for route protection
- ✅ Support for multiple auth providers (ready for OAuth, etc.)

## Setup

### 1. Environment Variables

Add the following to your `.env` file:

```env
JWT_SECRET_KEY=your-secret-key-here-change-this-in-production
```

**Important:** Generate a strong secret key for production:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

The following packages are required:

- `pyjwt` - JWT token handling
- `bcrypt` - Password hashing

### 3. Database Setup

The module uses the existing `User`, `UserAuth`, and `AuthProvider` tables. Make sure your database migrations are up to date:

```bash
alembic upgrade head
```

## API Endpoints

All endpoints are prefixed with `/api/v1/auth`

### POST `/register`

Register a new user with email/password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**

```json
{
  "user_id": "uuid-here",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Cookie:** Sets HTTP-only `access_token` cookie with JWT.

### POST `/login`

Login with email/password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "user_id": "uuid-here",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Cookie:** Sets HTTP-only `access_token` cookie with JWT.

### POST `/logout`

Logout the current user.

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

**Cookie:** Clears the `access_token` cookie.

### GET `/me`

Get the current authenticated user's information.

**Requires:** Authentication

**Response:**

```json
{
  "user_id": "uuid-here",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

### GET `/status`

Check authentication status (does not require authentication).

**Response:**

```json
{
  "is_authenticated": true,
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

Or if not authenticated:

```json
{
  "is_authenticated": false,
  "user": null
}
```

## Using Authentication in Other Modules

### Option 1: Require Authentication

Protect a route so only authenticated users can access it:

```python
from fastapi import APIRouter, Depends
from app.modules.auth import require_authentication, AuthResponse

router = APIRouter()

@router.get("/protected")
async def protected_route(user: AuthResponse = Depends(require_authentication)):
    # User is guaranteed to be authenticated here
    return {"message": f"Hello {user.email}!"}
```

### Option 2: Optional Authentication

Make authentication optional:

```python
from typing import Optional
from fastapi import APIRouter, Depends
from app.modules.auth import get_current_user, AuthResponse

router = APIRouter()

@router.get("/optional")
async def optional_auth_route(user: Optional[AuthResponse] = Depends(get_current_user)):
    if user:
        return {"message": f"Hello authenticated user {user.email}!"}
    else:
        return {"message": "Hello anonymous user!"}
```

## Architecture

The module follows the same structure as other modules in the project:

```
auth/
├── __init__.py          # Module exports
├── models.py            # Pydantic request/response models
├── dao.py               # Database access layer
├── service.py           # Business logic (JWT, password hashing)
├── routes.py            # FastAPI endpoints
├── dependencies.py      # Reusable auth dependencies
└── README.md           # This file
```

### Generic Auth Provider Interface

The module uses a generic authentication provider system:

1. **AuthProvider** - Lookup table for available auth providers (email, google, etc.)
2. **UserAuth** - Links users to specific auth providers
3. **User** - Core user information

This allows you to add new auth providers (like Google OAuth) without changing the core authentication logic or route structure.

## Security Features

- **HTTP-only cookies**: Prevents XSS attacks
- **Secure cookies**: Only sent over HTTPS (configurable)
- **bcrypt password hashing**: Industry-standard password security
- **JWT expiration**: Tokens expire after 24 hours
- **SameSite cookies**: CSRF protection

## Configuration

Cookie settings can be adjusted in `routes.py`:

```python
COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = 24 * 60 * 60  # 24 hours
COOKIE_HTTP_ONLY = True
COOKIE_SECURE = True  # Set to True in production
COOKIE_SAME_SITE = "lax"
```

JWT settings in `service.py`:

```python
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24
```

## Frontend Integration

### Login/Register

```javascript
// Login
const response = await fetch("http://localhost:8000/api/v1/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: allows cookies
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const data = await response.json();
// Cookie is automatically set by the browser
```

### Making Authenticated Requests

```javascript
// The cookie is automatically sent with requests
const response = await fetch("http://localhost:8000/api/v1/auth/me", {
  credentials: "include", // Important: sends cookies
});

const user = await response.json();
```

### Logout

```javascript
const response = await fetch("http://localhost:8000/api/v1/auth/logout", {
  method: "POST",
  credentials: "include",
});
// Cookie is automatically cleared
```

## Testing

Example test using the API:

```bash
# Register a user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get current user (uses cookie)
curl http://localhost:8000/api/v1/auth/me \
  -b cookies.txt

# Check auth status
curl http://localhost:8000/api/v1/auth/status \
  -b cookies.txt

# Logout
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

## Future Enhancements

The module is designed to easily support:

- Google OAuth
- GitHub OAuth
- Microsoft OAuth
- Magic link authentication
- Two-factor authentication
- Password reset flows

Each new provider can be added by:

1. Adding a new entry to the `auth_providers` table
2. Implementing provider-specific logic in `service.py`
3. Adding new routes in `routes.py` (if needed)

The core authentication interface remains unchanged!
