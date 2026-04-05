from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from app.models.base import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_type = Column(String, nullable=False) # "percentage" or "fixed"
    discount_value = Column(Float, nullable=False)
    min_cart_amount = Column(Float, default=0.0)
    max_usage_limit = Column(Integer, nullable=True)
    current_usage = Column(Integer, default=0)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
