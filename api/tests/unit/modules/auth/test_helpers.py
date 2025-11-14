from types import SimpleNamespace
import pytest

from app.modules.auth import helpers


def test_create_and_decode_token(monkeypatch):
    # Ensure a deterministic secret for tests
    monkeypatch.setattr(helpers, "settings", SimpleNamespace(jwt_secret_key="testsecret"))

    token = helpers.create_access_token(user_id="user-1", email="a@b.com")
    payload = helpers.decode_access_token(token)

    assert payload is not None
    assert payload.get("sub") == "user-1"
    assert payload.get("email") == "a@b.com"


def test_decode_invalid_token_returns_none(monkeypatch):
    monkeypatch.setattr(helpers, "settings", SimpleNamespace(jwt_secret_key="testsecret"))
    assert helpers.decode_access_token("not-a-token") is None


def test_extract_user_id_from_token(monkeypatch):
    monkeypatch.setattr(helpers, "settings", SimpleNamespace(jwt_secret_key="testsecret"))
    token = helpers.create_access_token(user_id="uid-123", email="u@e.com")
    assert helpers.extract_user_id_from_token(token) == "uid-123"


def test_cookie_functions():
    # get_token_from_cookie accepts any object with a `cookies` attribute
    req = SimpleNamespace(cookies={helpers.COOKIE_NAME: "tok123"})
    assert helpers.get_token_from_cookie(req) == "tok123" # type: ignore

    from fastapi import Response, Request

    resp = Response()
    helpers.set_auth_cookie(resp, "tok-xyz")
    # set_cookie should create a Set-Cookie header
    assert any(helpers.COOKIE_NAME in v for k, v in resp.headers.items())

    # clear cookie should also set a Set-Cookie header
    helpers.clear_auth_cookie(resp)
    assert any(helpers.COOKIE_NAME in v for k, v in resp.headers.items())
