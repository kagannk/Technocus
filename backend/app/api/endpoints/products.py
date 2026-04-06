from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.api.deps import get_current_active_admin

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def read_products(
    skip: int = 0, 
    limit: int = 500, 
    category_id: Optional[int] = None,
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    from app.models.category import Category
    query = select(Product)
    if category_slug:
        query = query.join(Category, Product.category_id == Category.id).where(Category.slug == category_slug)
    elif category_id:
        query = query.where(Product.category_id == category_id)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/search", response_model=List[ProductResponse])
async def search_products(
    q: str = Query(..., min_length=2),
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import or_
    query = select(Product).where(
        or_(
            Product.name.ilike(f"%{q}%"),
            Product.description.ilike(f"%{q}%"),
            Product.sku.ilike(f"%{q}%")
        )
    ).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=ProductResponse, dependencies=[Depends(get_current_active_admin)])
async def create_product(product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where((Product.sku == product_in.sku) | (Product.slug == product_in.slug)))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Product with this SKU or slug already exists")
    
    product = Product(**product_in.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product

@router.get("/{product_id}", response_model=ProductResponse)
async def read_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductResponse, dependencies=[Depends(get_current_active_admin)])
async def update_product(product_id: int, product_in: ProductUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
        
    await db.commit()
    await db.refresh(product)
    return product

@router.delete("/{product_id}", dependencies=[Depends(get_current_active_admin)])
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    await db.delete(product)
    await db.commit()
    return {"message": "Product deleted successfully"}

@router.post("/bulk-import", dependencies=[Depends(get_current_active_admin)])
async def bulk_import_products(
    file: UploadFile = File(...), 
    mode: str = Form("update"),
    db: AsyncSession = Depends(get_db)
):
    import pandas as pd
    import json
    import io
    import re
    from app.models.category import Category
    from sqlalchemy import delete
    import uuid
    
    if mode == "reset":
        await db.execute(delete(Product))
        await db.commit()

    content = await file.read()
    if file.filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(content))
    elif file.filename.endswith((".xls", ".xlsx")):
        df = pd.read_excel(io.BytesIO(content))
    else:
        raise HTTPException(status_code=400, detail="Geçersiz dosya formatı. Lütfen .csv, .xls veya .xlsx yükleyin.")
    
    success_count = 0
    error_count = 0
    errors = []
    
    DEFAULT_IMAGES = {
        "Arduino": "https://images.unsplash.com/photo-1517077304055-6e89abf092ba?w=800&q=80",
        "Raspberry Pi": "https://images.unsplash.com/photo-1558227691-41ea78d1f631?w=800&q=80",
        "Sensör": "https://images.unsplash.com/photo-1582214430485-5df934f07a4b?w=800&q=80",
        "Sensörler": "https://images.unsplash.com/photo-1582214430485-5df934f07a4b?w=800&q=80",
        "Robotik": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        "Drone": "https://images.unsplash.com/photo-1541627845349-e6d337eadafa?w=800&q=80",
        "Motorlar": "https://images.unsplash.com/photo-1507001429402-1498e578f773?w=800&q=80",
        "Geliştirme Kartları": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        "Genel": "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?w=800&q=80"
    }
    
    for index, row in df.iterrows():
        try:
            p_name = row.get("name")
            if pd.isna(p_name):
                raise ValueError("'name' boş olamaz")
                
            p_sku = row.get("sku")
            if pd.isna(p_sku):
                raise ValueError("'sku' boş olamaz")
                
            p_desc = row.get("description", "")
            if pd.isna(p_desc): p_desc = ""
            
            p_price = float(row.get("price", 0))
            if pd.isna(p_price): p_price = 0.0
            
            p_stock = int(row.get("stock", 0))
            if pd.isna(p_stock): p_stock = 0
            
            p_min_stock = int(row.get("min_stock", 5))
            if pd.isna(p_min_stock): p_min_stock = 5
            
            p_weight = float(row.get("weight_grams", 0))
            if pd.isna(p_weight): p_weight = 0.0
            
            # Kategori İşlemleri (Otomatik Oluşturma)
            cat_name = str(row.get("category", "Genel")).strip()
            if pd.isna(row.get("category")) or not cat_name:
                cat_name = "Genel"
                
            cat_result = await db.execute(select(Category).where(Category.name.ilike(cat_name)))
            category = cat_result.scalars().first()
            if not category:
                cat_slug = re.sub(r'[^a-z0-9]+', '-', cat_name.lower()).strip('-')
                slug_result = await db.execute(select(Category).where(Category.slug == cat_slug))
                if slug_result.scalars().first():
                    cat_slug += f"-{uuid.uuid4().hex[:4]}"
                    
                category = Category(name=cat_name, slug=cat_slug, description="")
                db.add(category)
                await db.commit()
                await db.refresh(category)
                
            category_id = category.id

            img_url = DEFAULT_IMAGES.get(category.name, DEFAULT_IMAGES["Genel"])

            # Teknik Özellikler JSON Parse
            specs_str = row.get("specifications")
            specs = {}
            if not pd.isna(specs_str) and str(specs_str).strip():
                try:
                    specs = json.loads(str(specs_str))
                except Exception as e:
                    raise ValueError(f"'specifications' JSON formatı hatalı: {e}. İlgili veri: {specs_str}")
                    
            if p_weight > 0:
                specs["weight_grams"] = p_weight
                    
            # Check SKU uniqueness / Update Mode
            result = await db.execute(select(Product).where(Product.sku == str(p_sku)))
            existing_product = result.scalars().first()
            
            slug = re.sub(r'[^a-z0-9]+', '-', str(p_name).lower()).strip('-')
            
            if existing_product and mode == "update":
                existing_product.name = str(p_name)
                existing_product.description = str(p_desc)
                existing_product.price = p_price
                existing_product.stock = p_stock
                existing_product.min_stock_alert = p_min_stock
                existing_product.category_id = category_id
                existing_product.spec_data = specs
                if not existing_product.image_urls:
                    existing_product.image_urls = [img_url]
            elif existing_product and mode == "reset":
                 # If reset was chosen, we shouldn't have existing products, but just in case:
                 pass
            else:
                new_product = Product(
                    name=str(p_name),
                    slug=f"{slug}-{p_sku}",
                    sku=str(p_sku),
                    description=str(p_desc),
                    price=p_price,
                    stock=p_stock,
                    min_stock_alert=p_min_stock,
                    category_id=category_id,
                    spec_data=specs,
                    image_urls=[img_url]
                )
                db.add(new_product)
            success_count += 1
        except Exception as e:
            error_count += 1
            errors.append(f"Satır {index+2} ({row.get('name', 'Bilinmeyen')}): {str(e)}")
            
    await db.commit()
    return {"success": success_count, "errors": error_count, "error_details": errors}

