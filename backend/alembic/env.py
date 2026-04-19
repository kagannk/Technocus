import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

config = context.config

# Normalize DATABASE_URL for psycopg2 (sync alembic needs postgresql://, not asyncpg)
def _get_sync_db_url(url: str) -> str:
    # Handle Railway's postgres:// shorthand
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    # Strip asyncpg driver if present
    if url.startswith("postgresql+asyncpg://"):
        url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
    return url

database_url = _get_sync_db_url(os.getenv("DATABASE_URL", ""))
if not database_url:
    # Fallback for local dev
    database_url = "postgresql://tekno_user:tekno_pass@db:5432/technocus_db"

config.set_main_option("sqlalchemy.url", database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from app.models.base import Base
import app.models  # ensure all models are imported and registered

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
