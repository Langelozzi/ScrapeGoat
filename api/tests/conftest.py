import asyncio
import os
import sys
import pytest


# Ensure the project root (the `api` folder) is on sys.path so `app` imports work
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)


@pytest.fixture(scope="session")
def event_loop():
    """Provide an asyncio event loop for pytest-asyncio tests."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
