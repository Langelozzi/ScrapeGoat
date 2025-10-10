"""Add gen_random_uuid default to id columns

Revision ID: add_gen_random_uuid
Revises:
Create Date: 2025-10-09 21:40:00

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "add_gen_random_uuid"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add gen_random_uuid() as default for all id columns."""
    tables = ["users", "folders", "websites", "scraper_configs", "scrape_results"]
    for table in tables:
        op.alter_column(
            table,
            "id",
            server_default=sa.text("gen_random_uuid()"),
            existing_type=postgresql.UUID(as_uuid=True),
        )


def downgrade() -> None:
    """Remove server_default from all id columns."""
    tables = ["users", "folders", "websites", "scraper_configs", "scrape_results"]
    for table in tables:
        op.alter_column(
            table,
            "id",
            server_default=None,
            existing_type=postgresql.UUID(as_uuid=True),
        )
