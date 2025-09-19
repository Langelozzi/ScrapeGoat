from pydantic import HttpUrl
from app.shared.data.tree import mock_dom_tree
from app.shared.models.html import ScrapeGoatDOMTree


def build_dom_tree(url: HttpUrl) -> ScrapeGoatDOMTree:
    return mock_dom_tree
