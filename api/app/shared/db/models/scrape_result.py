from __future__ import annotations
from typing import TYPE_CHECKING
import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin

if TYPE_CHECKING:
    from .scraper_config import ScraperConfig


class ScrapeResult(Base, UUIDPkMixin, TimestampMixin):
    __tablename__ = "scrape_results"

    data: Mapped[dict] = mapped_column(JSONB, nullable=True)

    # Foreign Keys
    config_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("scraper_configs.id"), nullable=False
    )

    # Relationships
    config: Mapped["ScraperConfig"] = relationship(
        "ScraperConfig", back_populates="scrape_results"
    )
