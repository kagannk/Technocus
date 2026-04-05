import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://tekno_user:tekno_password@db:5432/tekno_store")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def test():
    async with AsyncSessionLocal() as db:
        await db.execute(text("UPDATE users SET email = 'yilmazkagan@technocus.com' WHERE email IN ('admin@teknostore.com', 'yilmazkagan@teknostore.com')"))
        await db.commit()
        print("Admin user email updated.")

asyncio.run(test())
