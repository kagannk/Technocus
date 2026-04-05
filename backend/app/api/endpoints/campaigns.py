from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_active_admin
from app.models.coupon import Coupon
from app.schemas.coupon import CouponCreate, CouponResponse, CouponUpdate

router = APIRouter()

@router.get("/", response_model=List[CouponResponse], dependencies=[Depends(get_current_active_admin)])
async def get_coupons(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Coupon))
    return result.scalars().all()

@router.post("/", response_model=CouponResponse, dependencies=[Depends(get_current_active_admin)])
async def create_coupon(coupon_in: CouponCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Coupon).where(Coupon.code == coupon_in.code))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    
    new_coupon = Coupon(**coupon_in.model_dump())
    db.add(new_coupon)
    await db.commit()
    await db.refresh(new_coupon)
    return new_coupon

@router.put("/{coupon_id}", response_model=CouponResponse, dependencies=[Depends(get_current_active_admin)])
async def update_coupon(coupon_id: int, coupon_in: CouponUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Coupon).where(Coupon.id == coupon_id))
    coupon = result.scalars().first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
        
    if coupon_in.is_active is not None:
        coupon.is_active = coupon_in.is_active
        
    await db.commit()
    await db.refresh(coupon)
    return coupon

@router.delete("/{coupon_id}", dependencies=[Depends(get_current_active_admin)])
async def delete_coupon(coupon_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Coupon).where(Coupon.id == coupon_id))
    coupon = result.scalars().first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
        
    await db.delete(coupon)
    await db.commit()
    return {"message": "Coupon deleted"}
