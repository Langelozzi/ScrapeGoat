from __future__ import annotations

import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin

if TYPE_CHECKING:
    from .user import User


class UserAuth(Base, UUIDPkMixin, TimestampMixin):
    __tablename__ = "user_auth"

    provider: Mapped[str] = mapped_column(String(100), nullable=False)
    external_user_id: Mapped[str] = mapped_column(
        String(255), nullable=True, unique=True
    )
    external_user: Mapped[dict] = mapped_column(JSONB, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="auth_providers")
