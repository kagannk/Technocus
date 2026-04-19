from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Normalize DATABASE_URL for asyncpg:
# Railway provides: postgresql:// or postgres://
# asyncpg needs:    postgresql+asyncpg://
def _get_async_db_url(url: str) -> str:
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif not url.startswith("postgresql+asyncpg://"):
        # already correct or unknown, return as-is
        pass
    return url

_async_db_url = _get_async_db_url(settings.DATABASE_URL)

engine = create_async_engine(_async_db_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
