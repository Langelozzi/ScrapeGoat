from __future__ import annotations
from typing import TYPE_CHECKING
import uuid
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin

if TYPE_CHECKING:
    from .folder import Folder
    from .website import Website
    from .scrape_result import ScrapeResult


class ScraperConfig(Base, UUIDPkMixin, TimestampMixin):
    __tablename__ = "scraper_configs"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    retrieval_json: Mapped[dict] = mapped_column(JSONB, nullable=False)

    # Foreign Keys
    folder_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("folders.id"), nullable=False
    )
    website_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("websites.id"), nullable=False
    )

    # Relationships
    folder: Mapped["Folder"] = relationship("Folder", back_populates="scraper_configs")
    website: Mapped["Website"] = relationship(
        "Website", back_populates="scraper_configs"
    )
    scrape_results: Mapped[list["ScrapeResult"]] = relationship(
        "ScrapeResult", back_populates="config", cascade="all, delete-orphan"
    )
