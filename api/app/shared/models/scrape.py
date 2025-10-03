from datetime import datetime
from typing import Any
from pydantic import BaseModel, HttpUrl


class NodeOutput(BaseModel):
    location: str
    key: str


# TODO: This is not the finalized model but for now it'll work
class RetrievalInstruction(BaseModel):
    node_query: str
    output: NodeOutput
    flags: dict


class ScrapeConfig(BaseModel):
    url: HttpUrl
    retrieval_instructions: list[RetrievalInstruction]


class ScrapedDataset(BaseModel):
    url: HttpUrl
    data: list[dict[str, Any]]
    createdAt: datetime
