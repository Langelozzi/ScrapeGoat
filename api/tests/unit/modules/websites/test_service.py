import pytest
from types import SimpleNamespace

from app.modules.websites import service as websites_service


@pytest.mark.asyncio
async def test_get_all_websites_delegates(monkeypatch):
    expected = ["w1", "w2"]

    async def fake(db):
        return expected

    monkeypatch.setattr(websites_service, "dao_get_all_websites", fake)

    res = await websites_service.get_all_websites(None) # type: ignore
    assert res == expected


@pytest.mark.asyncio
async def test_get_website_and_by_url_delegates(monkeypatch):
    async def fake_get(db, id):
        return SimpleNamespace(id=id)

    async def fake_get_by_url(db, url):
        return SimpleNamespace(id="byurl", url=url)

    monkeypatch.setattr(websites_service, "dao_get_website", fake_get)
    monkeypatch.setattr(websites_service, "dao_get_website_by_url", fake_get_by_url)

    w = await websites_service.get_website(None, "wid") # type: ignore
    assert w.id == "wid" # type: ignore

    w2 = await websites_service.get_website_by_url(None, "http://ex") # type: ignore
    assert w2.url == "http://ex" # type: ignore


@pytest.mark.asyncio
async def test_create_update_delete_delegates(monkeypatch):
    async def fake_create(db, website_obj):
        return SimpleNamespace(id="created", url=website_obj.url)

    async def fake_update(db, id, website_obj):
        return SimpleNamespace(id=id, url=website_obj.url)

    async def fake_delete(db, id):
        return True

    monkeypatch.setattr(websites_service, "dao_create_website", fake_create)
    monkeypatch.setattr(websites_service, "dao_update_website", fake_update)
    monkeypatch.setattr(websites_service, "dao_delete_website", fake_delete)

    created = await websites_service.create_website(None, SimpleNamespace(url="http://x")) # type: ignore
    assert created.id == "created"

    updated = await websites_service.update_website(None, "cid", SimpleNamespace(url="http://y")) # type: ignore
    assert updated.id == "cid" # type: ignore

    assert await websites_service.delete_website(None, "cid") is True # type: ignore
