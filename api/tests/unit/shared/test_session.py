import pytest

from app.shared.db import session as session_module


@pytest.mark.asyncio
async def test_get_db_yields_session(monkeypatch):
    class DummySession:
        pass

    class DummyCM:
        def __init__(self, sess):
            self._sess = sess

        async def __aenter__(self):
            return self._sess

        async def __aexit__(self, exc_type, exc, tb):
            return False

    def factory():
        return DummyCM(DummySession())

    monkeypatch.setattr(session_module, "async_session_factory", factory)

    # Use async for to consume the async generator
    found = False
    async for sess in session_module.get_db():
        assert isinstance(sess, DummySession)
        found = True

    assert found


@pytest.mark.asyncio
async def test_init_db_calls_run_sync(monkeypatch):
    called = {"run_sync": False}

    class DummyConn:
        async def run_sync(self, fn):
            called["run_sync"] = True

    class DummyBeginCM:
        async def __aenter__(self):
            return DummyConn()

        async def __aexit__(self, exc_type, exc, tb):
            return False

    class DummyEngine:
        def begin(self):
            return DummyBeginCM()

    monkeypatch.setattr(session_module, "engine", DummyEngine())

    await session_module.init_db()

    assert called["run_sync"] is True
