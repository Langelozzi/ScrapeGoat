import uuid
from pydantic import BaseModel

from app.shared.db.models.scraper_config import ScraperConfig
from app.shared.db.models.website import Website


class ConfigCreateRequest(BaseModel):
    name: str
    description: str | None
    url: str
    retrieval_instructions: list[dict]

    folder_id: str | None

    def to_model(self):
        config = ScraperConfig(
            name=self.name,
            description=self.description,
            retrieval_json=self.retrieval_instructions,
            folder_id=self.folder_id,
        )
        config.website = Website(url=self.url)
        return config


class ConfigResponse(BaseModel):
    id: str | uuid.UUID
    name: str
    description: str | None
    url: str
    retrieval_instructions: list[dict]
    folder_id: str | uuid.UUID
    website_id: str | uuid.UUID | None

    @staticmethod
    def from_model(config: ScraperConfig):
        return ConfigResponse(
            id=config.id,
            name=config.name,
            description=config.description,
            url=config.website.url,
            retrieval_instructions=config.retrieval_json,
            folder_id=config.folder_id,
            website_id=config.website_id,
        )


class ConfigDeleteResponse(BaseModel):
    deleted: bool
    message: str
