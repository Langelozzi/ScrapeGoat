# Auth Module Quick Start Guide

Get up and running with authentication in 5 minutes!

## 1. Setup (2 minutes)

### Add to `.env`:

```env
JWT_SECRET_KEY=your-secret-key-here
```

Generate a secure key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Install dependencies:

```bash
pip install -r requirements.txt
```

## 2. Use in Your Routes (1 minute)

### Protect a route:

```python
from app.modules.auth import require_authentication, AuthResponse

@router.get("/protected")
async def my_route(user: AuthResponse = Depends(require_authentication)):
    return {"message": f"Hello {user.email}!"}
```

### Optional authentication:

```python
from app.modules.auth import get_current_user
from typing import Optional

@router.get("/public")
async def my_route(user: Optional[AuthResponse] = Depends(get_current_user)):
    if user:
        return {"message": f"Hello {user.email}!"}
    else:
        return {"message": "Hello guest!"}
```

## 3. Test with cURL (2 minutes)

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get current user
curl http://localhost:8000/api/v1/auth/me -b cookies.txt

# Check status
curl http://localhost:8000/api/v1/auth/status -b cookies.txt

# Logout
curl -X POST http://localhost:8000/api/v1/auth/logout -b cookies.txt
```

## 4. Frontend Integration (30 seconds)

```javascript
// Login
const response = await fetch("http://localhost:8000/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important!
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

// Make authenticated requests
const userResponse = await fetch("http://localhost:8000/api/v1/auth/me", {
  credentials: "include", // Important!
});
```

## That's It! 🎉

Your authentication is now set up with:

- ✅ JWT tokens in HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ Generic auth provider interface
- ✅ Easy-to-use dependencies
- ✅ Ready for OAuth providers

## Next Steps

- See `README.md` for full documentation
- See `example_usage.py` for more patterns
- See `providers/README.md` for adding OAuth providers

## Common Patterns

### Get user ID in a protected route:

```python
@router.post("/create-resource")
async def create_resource(
    data: dict,
    user: AuthResponse = Depends(require_authentication),
    db: AsyncSession = Depends(get_db)
):
    # Use user.user_id to associate resource with user
    resource.user_id = user.user_id
    # ... save resource
```

### Check if user is admin:

```python
@router.delete("/admin/delete/{id}")
async def admin_delete(
    id: str,
    user: AuthResponse = Depends(require_authentication)
):
    if "admin" not in user.email.lower():
        raise HTTPException(status_code=403, detail="Admin only")
    # ... delete logic
```

### Different content for authenticated vs anonymous:

```python
@router.get("/content")
async def get_content(
    user: Optional[AuthResponse] = Depends(get_current_user)
):
    if user:
        return {"content": "Premium content"}
    else:
        return {"content": "Free content"}
```

## Troubleshooting

### Cookie not being sent?

Make sure `credentials: 'include'` is set in fetch requests.

### 401 Unauthorized?

Check that the JWT_SECRET_KEY is set in your `.env` file.

### CORS errors?

Make sure your frontend URL is in `FRONTEND_URL` in `.env`.

### Password too short?

Minimum 8 characters required.

## Need Help?

- Full docs: `README.md`
- Examples: `example_usage.py`
- Adding providers: `providers/README.md`
