import pytest
from types import SimpleNamespace

from app.modules.users import service as users_service


@pytest.mark.asyncio
async def test_get_all_users_delegates(monkeypatch):
    expected = ["u1", "u2"]

    async def fake(db):
        return expected

    monkeypatch.setattr(users_service, "dao_get_all_users", fake)

    res = await users_service.get_all_users(None) # type: ignore
    assert res == expected


@pytest.mark.asyncio
async def test_get_user_delegates(monkeypatch):
    async def fake(db, id):
        return SimpleNamespace(id=id)

    monkeypatch.setattr(users_service, "dao_get_user", fake)

    u = await users_service.get_user(None, "abc") # type: ignore
    assert u.id == "abc" # type: ignore


@pytest.mark.asyncio
async def test_create_user_success_calls_create_folder(monkeypatch):
    # Fake user returned by dao_create_user
    new_user = SimpleNamespace(id="new-123", email="x@x.com", first_name="A", last_name="B")

    async def fake_dao_create(db, user_obj):
        return new_user

    called = {}

    async def fake_create_folder(db, folder_obj, user_id_str):
        called["folder_obj"] = folder_obj
        called["user_id_str"] = user_id_str

    monkeypatch.setattr(users_service, "dao_create_user", fake_dao_create)
    monkeypatch.setattr(users_service, "create_folder", fake_create_folder)

    res = await users_service.create_user(None, SimpleNamespace(email="x@x.com")) # type: ignore

    assert res == new_user
    # folder user_id should equal new_user.id
    assert str(called["user_id_str"]) == str(new_user.id)
    assert called["folder_obj"].name == "_root"


@pytest.mark.asyncio
async def test_create_user_raises_when_dao_returns_none(monkeypatch):
    async def fake_none(db, user_obj):
        return None

    monkeypatch.setattr(users_service, "dao_create_user", fake_none)

    with pytest.raises(Exception) as exc:
        await users_service.create_user(None, SimpleNamespace(email="x@x.com")) # type: ignore

    assert "Unable to create user" in str(exc.value)


@pytest.mark.asyncio
async def test_update_and_delete_forward_to_dao(monkeypatch):
    async def fake_update(db, id, user_obj):
        assert id == "uid"
        return SimpleNamespace(id=id)

    async def fake_delete(db, id):
        assert id == "uid"
        return True

    monkeypatch.setattr(users_service, "dao_update_user", fake_update)
    monkeypatch.setattr(users_service, "dao_delete_user", fake_delete)

    updated = await users_service.update_user(None, "uid", SimpleNamespace()) # type: ignore
    assert updated.id == "uid" # type: ignore
    assert await users_service.delete_user(None, "uid") is True # type: ignore
