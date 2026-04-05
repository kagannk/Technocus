from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CouponBase(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    min_cart_amount: float = 0.0
    max_usage_limit: Optional[int] = None
    valid_until: Optional[datetime] = None
    is_active: bool = True

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    is_active: Optional[bool] = None

class CouponResponse(CouponBase):
    id: int
    current_usage: int

    class Config:
        from_attributes = True
