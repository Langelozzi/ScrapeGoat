import pytest
from types import SimpleNamespace

from app.modules.configs import service as config_service


@pytest.mark.asyncio
async def test_get_all_configs_calls_dao(monkeypatch):
    expected = ["cfg1", "cfg2"]

    async def fake_dao(db):
        return expected

    monkeypatch.setattr(config_service, "dao_get_all_configs", fake_dao)

    res = await config_service.get_all_configs(None) # type: ignore
    assert res == expected


@pytest.mark.asyncio
async def test_get_all_configs_by_user_id_no_root_raises(monkeypatch):
    async def fake_root(db, user_id):
        return None

    monkeypatch.setattr(config_service, "get_user_root_folder", fake_root)

    with pytest.raises(Exception):
        await config_service.get_all_configs_by_user_id(None, "user1") # type: ignore


@pytest.mark.asyncio
async def test_get_all_configs_by_user_id_success(monkeypatch):
    folder = SimpleNamespace(id="folder-1")

    async def fake_root(db, user_id):
        return folder

    async def fake_dao(db, folder_id):
        assert folder_id == str(folder.id)
        return ["cfgA"]

    monkeypatch.setattr(config_service, "get_user_root_folder", fake_root)
    monkeypatch.setattr(config_service, "dao_get_all_configs_by_folder_id", fake_dao)

    res = await config_service.get_all_configs_by_user_id(None, "user1") # type: ignore
    assert res == ["cfgA"]


@pytest.mark.asyncio
async def test_create_config_no_root_folder_raises(monkeypatch):
    # config_data with no folder_id
    config_data = SimpleNamespace(
        name="n", description=None, retrieval_json=[{}], folder_id=None, website=SimpleNamespace(url="http://x")
    )

    async def fake_root(db, user_id):
        return None

    monkeypatch.setattr(config_service, "get_user_root_folder", fake_root)

    with pytest.raises(Exception):
        await config_service.create_config(None, config_data, "user42") # type: ignore


@pytest.mark.asyncio
async def test_create_config_creates_website_when_missing(monkeypatch):
    # prepare input config with no folder_id
    config_data = SimpleNamespace(
        name="n",
        description="d",
        retrieval_json=[{"a": 1}],
        folder_id=None,
        website=SimpleNamespace(url="http://example.com"),
    )

    root_folder = SimpleNamespace(id="root-1")
    created_website = SimpleNamespace(id="web-1", url="http://example.com")

    async def fake_root(db, user_id):
        return root_folder

    async def fake_get_website(db, url):
        assert url == "http://example.com"
        return None

    async def fake_create_website(db, website_obj):
        # website_obj.domain should be set by service
        return created_website

    captured = {}

    async def fake_dao_create(db, config_obj):
        # verify folder_id and website_id are set
        captured["folder_id"] = str(config_obj.folder_id)
        captured["website_id"] = config_obj.website_id
        return config_obj

    monkeypatch.setattr(config_service, "get_user_root_folder", fake_root)
    monkeypatch.setattr(config_service, "get_website_by_url", fake_get_website)
    monkeypatch.setattr(config_service, "create_website", fake_create_website)
    monkeypatch.setattr(config_service, "dao_create_config", fake_dao_create)

    res = await config_service.create_config(None, config_data, "userX") # type: ignore

    assert captured["folder_id"] == str(root_folder.id)
    assert captured["website_id"] == created_website.id
    assert res is not None


@pytest.mark.asyncio
async def test_create_config_uses_existing_website(monkeypatch):
    config_data = SimpleNamespace(
        name="n",
        description="d",
        retrieval_json=[{"a": 1}],
        folder_id="f-1",
        website=SimpleNamespace(url="http://example.com"),
    )

    existing_website = SimpleNamespace(id="web-2", url="http://example.com")

    async def fake_get_website(db, url):
        assert url == "http://example.com"
        return existing_website

    called = {"create_called": False}

    async def fake_create_website(db, website_obj):
        called["create_called"] = True
        return existing_website

    captured = {}

    async def fake_dao_create(db, config_obj):
        captured["website_id"] = config_obj.website_id
        return config_obj

    monkeypatch.setattr(config_service, "get_website_by_url", fake_get_website)
    monkeypatch.setattr(config_service, "create_website", fake_create_website)
    monkeypatch.setattr(config_service, "dao_create_config", fake_dao_create)

    res = await config_service.create_config(None, config_data, "userX") # type: ignore

    assert called["create_called"] is False
    assert captured["website_id"] == existing_website.id


@pytest.mark.asyncio
async def test_update_and_delete_forward_to_dao(monkeypatch):
    async def fake_update(db, id, config):
        return "updated"

    async def fake_delete(db, id):
        return True

    monkeypatch.setattr(config_service, "dao_update_config", fake_update)
    monkeypatch.setattr(config_service, "dao_delete_config", fake_delete)

    assert await config_service.update_config(None, "cid", SimpleNamespace()) == "updated" # type: ignore
    assert await config_service.delete_config(None, "cid") is True # type: ignore
