from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin


class User(Base, UUIDPkMixin, TimestampMixin):
    __tablename__ = "users"

    first_name: Mapped[str] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
