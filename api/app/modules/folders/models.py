import uuid
from pydantic import BaseModel

from app.shared.db.models.folder import Folder


class FolderCreateRequest(BaseModel):
    name: str
    parent_id: str | None

    def to_model(self):
        return Folder(name=self.name, parent_id=self.parent_id)


class FolderResponse(BaseModel):
    id: str | uuid.UUID
    name: str
    user_id: str | uuid.UUID
    parent_id: str | uuid.UUID | None
