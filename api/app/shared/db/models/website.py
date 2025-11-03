from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin
from app.shared.db.models.folder import Folder

if TYPE_CHECKING:
    from .scraper_config import ScraperConfig


class Website(Base, UUIDPkMixin, TimestampMixin):
    __tablename__ = "websites"

    url: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(255), nullable=False)

    scraper_configs: Mapped[list["ScraperConfig"]] = relationship(
        "ScraperConfig", back_populates="website", cascade="all, delete-orphan"
    )
