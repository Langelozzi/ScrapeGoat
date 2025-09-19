from datetime import datetime
from typing import Any
from pydantic import BaseModel, HttpUrl
from app.shared.models.html import HtmlNode


# TODO: This is not the finalized model but for now it'll work
class RetrievalInstruction(BaseModel):
    property_name: str
    source_node: HtmlNode
    action: str


class ScrapeConfig(BaseModel):
    url: HttpUrl
    retrieval_instructions: list


class ScrapedDataset(BaseModel):
    url: HttpUrl
    data: list[dict[str, Any]]
    createdAt: datetime
