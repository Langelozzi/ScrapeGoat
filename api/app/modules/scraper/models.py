from pydantic import BaseModel, HttpUrl


class BuildDomTreeRequest(BaseModel):
    url: HttpUrl
