from pydantic import BaseModel, HttpUrl


class ScrapeConfig(BaseModel):
    url: HttpUrl
    retrieval_instructions: list
