import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://tekno_user:tekno_password@db:5432/tekno_store")
engine = create_async_engine(DATABASE_URL, echo=False)

async def update_images():
    images_map = {
        "Microcontrollers": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
        "Development Boards": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
        "Drone": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
        "FPV": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
        "Robotics": "https://images.unsplash.com/photo-1561144257-e32e8506e82b?w=400",
        "Mechanics": "https://images.unsplash.com/photo-1561144257-e32e8506e82b?w=400",
        "Sensors": "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=400",
        "Modules": "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=400",
        "Power": "https://images.unsplash.com/photo-1609592424218-80e7b5a5b3e1?w=400",
        "Battery": "https://images.unsplash.com/photo-1609592424218-80e7b5a5b3e1?w=400",
        "Electronic": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
        "Parts": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
        "Geliştirme": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
        "Arduino": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
        "Sensör": "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=400",
        "Robot": "https://images.unsplash.com/photo-1561144257-e32e8506e82b?w=400",
        "Genel": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400"
    }

    async with engine.begin() as conn:
        for cat_name, url in images_map.items():
            query = text("""
                UPDATE products
                SET image_urls = ARRAY[:url]
                FROM categories
                WHERE categories.id = products.category_id AND categories.name ILIKE :cat_name
            """)
            await conn.execute(query, {"url": str(url), "cat_name": f"%{cat_name}%"})
            
        # fallback
        fallback = text("UPDATE products SET image_urls = ARRAY['https://images.unsplash.com/photo-1496065187959-7f07b8353c55?w=400'] WHERE image_urls IS NULL OR array_length(image_urls, 1) = 0 OR image_urls = '{}'")
        await conn.execute(fallback)
        
    print("Images updated successfully!")

if __name__ == "__main__":
    asyncio.run(update_images())
