from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.deps import get_current_active_admin
from app.models.order import Order
from app.models.product import Product

router = APIRouter()

@router.get("/dashboard-stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db), current_admin=Depends(get_current_active_admin)):
    # Total Orders
    total_orders_result = await db.execute(select(func.count(Order.id)))
    total_orders = total_orders_result.scalar() or 0
    
    # Pending Orders
    pending_orders_result = await db.execute(select(func.count(Order.id)).where(Order.status == 'pending'))
    pending_orders = pending_orders_result.scalar() or 0
    
    # Total Revenue
    revenue_result = await db.execute(select(func.sum(Order.total_amount)).where(Order.status == 'paid'))
    total_revenue = float(revenue_result.scalar() or 0.0)
    
    # Low Stock Products
    low_stock_result = await db.execute(select(func.count(Product.id)).where(Product.stock < Product.min_stock_alert))
    low_stock_count = low_stock_result.scalar() or 0
    
    # Sales history for the last 7 days chart
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_orders_query = select(Order.created_at, Order.total_amount).where(Order.created_at >= seven_days_ago, Order.status == 'paid')
    result = await db.execute(recent_orders_query)
    orders = result.fetchall()
    
    # Aggregate sales by day
    from typing import Dict
    sales_by_day: Dict[str, float] = {}
    for i in range(7):
        day = (datetime.utcnow() - timedelta(days=i)).strftime('%Y-%m-%d')
        sales_by_day[day] = 0.0
        
    for row in orders:
        day_str = row[0].strftime('%Y-%m-%d')
        if day_str in sales_by_day:
            sales_by_day[day_str] += float(row[1])
            
    sales_history = [{"date": k, "amount": v} for k, v in sorted(sales_by_day.items())]
    
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_revenue": total_revenue,
        "low_stock_count": low_stock_count,
        "sales_history": sales_history
    }
