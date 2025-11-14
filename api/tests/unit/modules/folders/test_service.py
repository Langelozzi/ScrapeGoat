import pytest
import uuid
from types import SimpleNamespace

from app.modules.folders import service as folder_service


@pytest.mark.asyncio
async def test_get_all_folders_delegates_to_dao(monkeypatch):
    expected = ["f1", "f2"]

    async def fake(db):
        return expected

    monkeypatch.setattr(folder_service, "dao_get_all_folders", fake)

    res = await folder_service.get_all_folders(None) # type: ignore
    assert res == expected


@pytest.mark.asyncio
async def test_get_all_folders_by_user_id_delegates(monkeypatch):
    async def fake(db, user_id):
        assert user_id == "u1"
        return ["a"]

    monkeypatch.setattr(folder_service, "dao_get_all_folders_by_user_id", fake)

    res = await folder_service.get_all_folders_by_user_id(None, "u1") # type: ignore
    assert res == ["a"]


@pytest.mark.asyncio
async def test_get_folder_and_get_user_root_folder_delegates(monkeypatch):
    async def fake_get(db, id):
        return SimpleNamespace(id=id)

    monkeypatch.setattr(folder_service, "dao_get_folder", fake_get)
    monkeypatch.setattr(folder_service, "dao_get_user_root_folder", fake_get)

    f = await folder_service.get_folder(None, "fid") # type: ignore
    assert f.id == "fid" # type: ignore

    root = await folder_service.get_user_root_folder(None, "uid") # type: ignore
    assert root.id == "uid" # type: ignore


@pytest.mark.asyncio
async def test_create_folder_sets_user_id_and_parent_when_parent_none(monkeypatch):
    # prepare a folder-like object
    folder = SimpleNamespace(parent_id=None, user_id=None)
    user_id = "11111111-1111-1111-1111-111111111111"

    root = SimpleNamespace(id="root-uuid")

    async def fake_root(db, uid):
        assert uid == user_id
        return root

    async def fake_dao_create(db, folder_obj):
        # assert user_id converted to uuid.UUID
        assert isinstance(folder_obj.user_id, uuid.UUID)
        # parent_id set to root.id
        assert folder_obj.parent_id == root.id
        return folder_obj

    monkeypatch.setattr(folder_service, "get_user_root_folder", fake_root)
    monkeypatch.setattr(folder_service, "dao_create_folder", fake_dao_create)

    res = await folder_service.create_folder(None, folder, user_id) # type: ignore
    assert res is folder


@pytest.mark.asyncio
async def test_create_folder_raises_when_no_root_and_parent_none(monkeypatch):
    folder = SimpleNamespace(parent_id=None, user_id=None)
    user_id = "11111111-1111-1111-1111-111111111111"

    async def fake_root(db, uid):
        return None

    monkeypatch.setattr(folder_service, "get_user_root_folder", fake_root)

    with pytest.raises(Exception):
        await folder_service.create_folder(None, folder, user_id) # type: ignore


@pytest.mark.asyncio
async def test_create_folder_uses_existing_parent(monkeypatch):
    folder = SimpleNamespace(parent_id="parent-1", user_id=None)
    user_id = "11111111-1111-1111-1111-111111111111"

    async def fake_dao_create(db, folder_obj):
        # ensure parent unchanged
        assert folder_obj.parent_id == "parent-1"
        return folder_obj

    monkeypatch.setattr(folder_service, "dao_create_folder", fake_dao_create)

    res = await folder_service.create_folder(None, folder, user_id) # type: ignore
    assert res is folder


@pytest.mark.asyncio
async def test_update_and_delete_forward_to_dao(monkeypatch):
    async def fake_update(db, id, folder_obj):
        assert id == "fid"
        return "updated"

    async def fake_delete(db, id):
        assert id == "fid"
        return True

    monkeypatch.setattr(folder_service, "dao_update_folder", fake_update)
    monkeypatch.setattr(folder_service, "dao_delete_folder", fake_delete)

    assert await folder_service.update_folder(None, "fid", SimpleNamespace()) == "updated" # type: ignore
    assert await folder_service.delete_folder(None, "fid") is True # type: ignore
