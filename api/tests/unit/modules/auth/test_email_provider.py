import pytest
from types import SimpleNamespace

from fastapi import HTTPException

from app.modules.auth.providers.email import service as email_service


def test_hash_and_verify_password():
    pw = "correcthorsebatterystaple"
    hashed = email_service.hash_password(pw)
    assert isinstance(hashed, str)
    assert email_service.verify_password(pw, hashed)
    assert not email_service.verify_password("wrongpw", hashed)


@pytest.mark.asyncio
async def test_authenticate_user_not_found(monkeypatch):
    async def fake_get_user_by_email(db, email):
        return None

    monkeypatch.setattr(email_service, "get_user_by_email", fake_get_user_by_email)

    provider = email_service.EmailAuthProvider()

    with pytest.raises(HTTPException) as exc:
        await provider.authenticate(None, email="x@x.com", password="pw") # type: ignore

    assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_authenticate_wrong_password(monkeypatch):
    # Create a fake user with a known password hash
    pw = "mypassword123"
    hashed = email_service.hash_password(pw)

    async def fake_get_user_by_email(db, email):
        return SimpleNamespace(id="u1", email=email, password_hash=hashed)

    async def fake_get_user_auth_by_provider(db, user_id):
        return None

    monkeypatch.setattr(email_service, "get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr(email_service, "get_user_auth_by_provider", fake_get_user_auth_by_provider)

    provider = email_service.EmailAuthProvider()

    with pytest.raises(HTTPException) as exc:
        await provider.authenticate(None, email="x@x.com", password="wrongpw") # type: ignore

    assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_authenticate_success_with_user_auth(monkeypatch):
    pw = "securepw"
    hashed = email_service.hash_password(pw)

    async def fake_get_user_by_email(db, email):
        return SimpleNamespace(id="u2", email=email, password_hash="oldhash")

    async def fake_get_user_auth_by_provider(db, user_id):
        return SimpleNamespace(password_hash=hashed, external_user_id=None, external_user=None)

    monkeypatch.setattr(email_service, "get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr(email_service, "get_user_auth_by_provider", fake_get_user_auth_by_provider)

    provider = email_service.EmailAuthProvider()
    user, provider_data = await provider.authenticate(None, email="x@x.com", password=pw) # type: ignore

    assert user.email == "x@x.com"
    assert provider_data["password_hash"] == hashed


@pytest.mark.asyncio
async def test_register_existing_email_raises(monkeypatch):
    async def fake_get_user_by_email(db, email):
        return SimpleNamespace(id="u3")

    monkeypatch.setattr(email_service, "get_user_by_email", fake_get_user_by_email)

    provider = email_service.EmailAuthProvider()

    with pytest.raises(HTTPException) as exc:
        await provider.register(None, email="a@b.com", password="password1", first_name="A", last_name="B") # type: ignore

    assert exc.value.status_code == 400


@pytest.mark.asyncio
async def test_register_provider_not_enabled(monkeypatch):
    async def fake_get_user_by_email(db, email):
        return None

    async def fake_get_auth_provider(db):
        return SimpleNamespace(is_enabled=False)

    monkeypatch.setattr(email_service, "get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr(email_service, "get_auth_provider", fake_get_auth_provider)

    provider = email_service.EmailAuthProvider()

    with pytest.raises(HTTPException) as exc:
        await provider.register(None, email="new@user.com", password="password1", first_name="A", last_name="B") # type: ignore

    assert exc.value.status_code == 500


@pytest.mark.asyncio
async def test_register_success(monkeypatch):
    async def fake_get_user_by_email(db, email):
        return None

    async def fake_get_auth_provider(db):
        return SimpleNamespace(is_enabled=True)

    async def fake_create_user(db, user_obj):
        # return same user with id set
        return SimpleNamespace(id="created-id", email=user_obj.email, first_name=user_obj.first_name, last_name=user_obj.last_name)

    monkeypatch.setattr(email_service, "get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr(email_service, "get_auth_provider", fake_get_auth_provider)
    monkeypatch.setattr(email_service, "create_user", fake_create_user)

    provider = email_service.EmailAuthProvider()
    user, provider_data = await provider.register(None, email="new@user.com", password="password1", first_name="A", last_name="B") # type: ignore

    assert user.id == "created-id"
    assert "password_hash" in provider_data
