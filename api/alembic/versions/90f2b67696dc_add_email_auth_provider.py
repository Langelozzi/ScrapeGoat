"""add_email_auth_provider

Revision ID: 90f2b67696dc
Revises: 863c2be211e3
Create Date: 2025-10-19 20:24:36.364914

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '90f2b67696dc'
down_revision: Union[str, Sequence[str], None] = '863c2be211e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create auth_providers lookup table
    op.create_table(
        'auth_providers',
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('display_name', sa.String(length=100), nullable=False),
        sa.Column('is_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default='now()', nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default='now()', nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    
    op.create_index('ix_auth_providers_id', 'auth_providers', ['id'], unique=True)
    
    # Insert default auth providers
    op.execute("""
        INSERT INTO auth_providers (name, display_name, is_enabled) 
        VALUES 
            ('email', 'Email', true),
            ('google', 'Google', true),
            ('github', 'GitHub', true)
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_auth_providers_id', table_name='auth_providers')
    op.drop_table('auth_providers')
