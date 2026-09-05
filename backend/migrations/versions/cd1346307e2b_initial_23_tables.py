"""initial_23_tables

Revision ID: cd1346307e2b
Revises: 
Create Date: 2026-09-04 04:06:44.181523

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cd1346307e2b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    from app.models import Base
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    """Downgrade schema."""
    from app.models import Base
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
