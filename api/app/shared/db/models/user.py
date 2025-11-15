from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin

if TYPE_CHECKING:
    from .folder import Folder
    from .user_auth import UserAuth


class User(Base, UUIDPkMixin, TimestampMixin):
    __tablename__ = "users"

    first_name: Mapped[str] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    folders: Mapped[list["Folder"]] = relationship(
        "Folder", back_populates="user", cascade="all, delete-orphan"
    )

    auth_providers: Mapped[list["UserAuth"]] = relationship(
        "UserAuth", back_populates="user", cascade="all, delete-orphan"
    )
