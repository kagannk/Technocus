from pydantic import BaseModel
from typing import Optional
import datetime
from app.schemas.product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(CartItemBase):
    id: int
    user_id: int
    created_at: datetime.datetime
    product: Optional[Product] = None
    
    class Config:
        from_attributes = True
