from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float
    vat_rate: int = 20
    stock: int = 0
    min_stock_alert: int = 5
    spec_data: Optional[Dict[str, Any]] = None
    image_urls: Optional[List[str]] = None
    category_id: int

class ProductCreate(ProductBase):
    slug: str

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    sku: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    slug: str
    category_name: Optional[str] = None

    class Config:
        from_attributes = True
