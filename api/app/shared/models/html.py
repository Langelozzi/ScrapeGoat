from pydantic import BaseModel, HttpUrl, field_serializer
from scrapegoat import HTMLNode


class DOMTree(BaseModel):
    url: HttpUrl
    root: HTMLNode

    model_config = {"arbitrary_types_allowed": True}

    @field_serializer("root")
    def serialize_root(self, value: HTMLNode):
        return value.to_dict()
