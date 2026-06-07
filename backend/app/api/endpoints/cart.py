from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.cart import CartItem
from app.schemas.cart import CartItemCreate, CartItemResponse, CartItemUpdate
from app.models.user import User

router = APIRouter()

@router.get("", response_model=List[CartItemResponse])
@router.get("/", response_model=List[CartItemResponse], include_in_schema=False)
async def get_cart(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(CartItem)
        .where(CartItem.user_id == current_user.id)
        .options(selectinload(CartItem.product))
        .order_by(CartItem.created_at.desc())
    )
    return result.scalars().all()

@router.post("", response_model=CartItemResponse)
@router.post("/", response_model=CartItemResponse, include_in_schema=False)
async def add_to_cart(item_in: CartItemCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if item exists
    result = await db.execute(
        select(CartItem).where(
            CartItem.user_id == current_user.id,
            CartItem.product_id == item_in.product_id
        )
    )
    existing_item = result.scalars().first()
    
    if existing_item:
        existing_item.quantity += item_in.quantity
        await db.commit()
        await db.refresh(existing_item)
        
        # Load product
        res = await db.execute(select(CartItem).where(CartItem.id == existing_item.id).options(selectinload(CartItem.product)))
        return res.scalars().first()
        
    new_item = CartItem(
        user_id=current_user.id,
        product_id=item_in.product_id,
        quantity=item_in.quantity
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    
    # Load product
    res = await db.execute(select(CartItem).where(CartItem.id == new_item.id).options(selectinload(CartItem.product)))
    return res.scalars().first()

@router.delete("")
@router.delete("/", include_in_schema=False)
async def clear_cart(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    from sqlalchemy import delete
    await db.execute(delete(CartItem).where(CartItem.user_id == current_user.id))
    await db.commit()
    return {"status": "success"}

@router.delete("/{item_id}")
async def remove_from_cart(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(CartItem).where(CartItem.id == item_id, CartItem.user_id == current_user.id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    await db.delete(item)
    await db.commit()
    return {"status": "success"}

@router.put("/{item_id}", response_model=CartItemResponse)
async def update_cart_item(item_id: int, item_in: CartItemUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(CartItem).where(CartItem.id == item_id, CartItem.user_id == current_user.id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    item.quantity = item_in.quantity
    await db.commit()
    await db.refresh(item)
    
    res = await db.execute(select(CartItem).where(CartItem.id == item.id).options(selectinload(CartItem.product)))
    return res.scalars().first()
