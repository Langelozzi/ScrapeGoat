from __future__ import annotations
from typing import TYPE_CHECKING
import uuid
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin

if TYPE_CHECKING:
    from .user import User
    from .scraper_config import ScraperConfig


class Folder(Base, UUIDPkMixin, TimestampMixin):
    __tablename__ = "folders"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    parent_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("folders.id"), nullable=True
    )

    user: Mapped["User"] = relationship("User", back_populates="folders")
    scraper_configs: Mapped[list["ScraperConfig"]] = relationship(
        "ScraperConfig", back_populates="folder", cascade="all, delete-orphan"
    )
