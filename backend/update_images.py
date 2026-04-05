import asyncio
import os
import sys

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://tekno_user:tekno_password@db:5432/tekno_store")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def main():
    async with AsyncSessionLocal() as db:
        await db.execute(text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR;"))
        
        await db.execute(text("UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1000' WHERE name ILIKE '%arduino%'"))
        await db.execute(text("UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80&w=1000' WHERE name ILIKE '%raspberry%'"))
        await db.execute(text("UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1000' WHERE name ILIKE '%drone%'"))
        await db.execute(text("UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000' WHERE name ILIKE '%robot%'"))
        await db.execute(text("UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&q=80&w=1000' WHERE name ILIKE '%sensör%'"))

        res = await db.execute(text("SELECT id, name, category_id FROM products"))
        products = res.fetchall()
        for row in products:
            p_id, p_name, cat_id = row[0], row[1].lower(), row[2]
            img = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
            if "arduino" in p_name or cat_id == 1:
                img = "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1000"
            elif "raspberry" in p_name or cat_id == 2:
                img = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80&w=1000"
            elif "drone" in p_name or cat_id == 3:
                img = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1000"
            elif "robot" in p_name or cat_id == 4:
                img = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
            elif "sens" in p_name or "modül" in p_name or cat_id == 5:
                img = "https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&q=80&w=1000"

            img_arr = [img]
            await db.execute(text("UPDATE products SET image_urls = :img_arr WHERE id = :p_id"), {"img_arr": img_arr, "p_id": p_id})

        await db.commit()
        print("Database Updated via Raw SQL within container successfully.")

if __name__ == "__main__":
    asyncio.run(main())
