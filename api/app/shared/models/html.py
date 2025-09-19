from typing import Any
from pydantic import BaseModel, HttpUrl


class HtmlNode(BaseModel):
    id: int
    raw: str
    tag_type: str
    hasData: bool
    htmlAttributes: dict[str, Any]
    body: str
    children: list["HtmlNode"]
    retrieval_instructions: list[dict[str, Any]]


class ScrapeGoatDOMTree(BaseModel):
    url: HttpUrl
    root: HtmlNode
