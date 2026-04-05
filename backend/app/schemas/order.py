from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class ProductSummary(BaseModel):
    name: str
    slug: str
    image_urls: List[str] = []

    class Config:
        from_attributes = True

class OrderItemResponse(OrderItemBase):
    id: int
    price_at_purchase: float
    product: ProductSummary
    
    class Config:
        from_attributes = True

class CreditCard(BaseModel):
    card_holder_name: Optional[str] = None
    card_number: Optional[str] = None
    expire_month: Optional[str] = None
    expire_year: Optional[str] = None
    cvc: Optional[str] = None

class OrderBase(BaseModel):
    shipping_address: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    phone: str
    card_info: Optional[CreditCard] = None
    card_token: Optional[str] = None
    save_card: bool = False

class OrderResponse(OrderBase):
    id: int
    user_id: int
    total_amount: float
    status: str
    tracking_code: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True
