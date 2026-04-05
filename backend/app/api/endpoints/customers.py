from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.core.database import get_db
from app.api.deps import get_current_active_admin
from app.models.user import User
from app.models.order import Order

router = APIRouter()

@router.get("/", dependencies=[Depends(get_current_active_admin)])
async def get_customers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.is_admin == False))
    users = result.scalars().all()
    
    customer_list = []
    for u in users:
        order_res = await db.execute(select(func.count(Order.id)).where(Order.user_id == u.id))
        order_count = order_res.scalar() or 0
        
        spent_res = await db.execute(select(func.sum(Order.total_amount)).where(Order.user_id == u.id, Order.status == "paid"))
        total_spent = float(spent_res.scalar() or 0.0)
        
        customer_list.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "is_active": u.is_active,
            "order_count": order_count,
            "total_spent": total_spent
        })
    return customer_list

@router.put("/{user_id}/status", dependencies=[Depends(get_current_active_admin)])
async def toggle_customer_status(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id, User.is_admin == False))
    user = result.scalars().first()
    if not user:
        raise HTTPException(404, "Customer not found")
        
    user.is_active = not user.is_active
    await db.commit()
    return {"message": "Status updated", "is_active": user.is_active}
