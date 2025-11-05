from pydantic import BaseModel, HttpUrl

from app.shared.db.models.scraper_config import ScraperConfig


class NodeOutput(BaseModel):
    location: str
    key: str


class RetrievalInstruction(BaseModel):
    node_query: str
    output: NodeOutput
    flags: dict

    @staticmethod
    def from_dict(d: dict):
        node_output = NodeOutput(
            location=d["output"]["location"], key=d["output"]["key"]
        )
        return RetrievalInstruction(
            node_query=d["node_query"], output=node_output, flags=d["flags"]
        )


class ScrapeConfig(BaseModel):
    url: HttpUrl
    retrieval_instructions: list[RetrievalInstruction]

    @staticmethod
    def from_db_model(config: ScraperConfig):
        url = config.website.url
        instr = list(map(RetrievalInstruction.from_dict, config.retrieval_json))
        return ScrapeConfig(url=HttpUrl(url), retrieval_instructions=instr)


class ScrapedDataset(BaseModel):
    url: HttpUrl
    data: list[dict]
