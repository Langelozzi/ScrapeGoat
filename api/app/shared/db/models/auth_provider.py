from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.shared.db.base import Base
from app.shared.db.mixins import UUIDPkMixin, TimestampMixin


class AuthProvider(Base, UUIDPkMixin, TimestampMixin):
    """Lookup table for available authentication providers."""
    
    __tablename__ = "auth_providers"
    
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")

