from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse
from app.api.deps import get_current_user
from app.services.iyzico_service import (
    initialize_checkout_form, 
    retrieve_checkout_form_result, 
    PaymentRequestData, 
    create_direct_payment,
    list_user_cards,
    delete_user_card
)
from app.services.webhook_service import notify_order_created, notify_low_stock, notify_order_approved
import uuid
import logging
import json

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/checkout", response_model=dict)
async def create_order(order_in: OrderCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    total_amount = 0.0
    products_cache = {}
    
    # Pre-validation and total calculation
    for item in order_in.items:
        result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")
            
        total_amount += float(product.price) * item.quantity
        products_cache[item.product_id] = product
    
    total_with_shipping = total_amount + 29.90
    
    # Prepare Iyzico Request
    conversation_id = str(uuid.uuid4())
    basket_items = []
    for item in order_in.items:
        product = products_cache[item.product_id]
        basket_items.append({
            'id': str(product.id),
            'name': product.name,
            'category1': "Electronics",
            'itemType': "PHYSICAL",
            'price': str(product.price * item.quantity)
        })
        
    buyer = {
        'id': str(current_user.id),
        'name': current_user.full_name.split()[0] if current_user.full_name else 'Test',
        'surname': current_user.full_name.split()[-1] if current_user.full_name and len(current_user.full_name.split()) > 1 else 'User',
        'gsmNumber': order_in.phone if order_in.phone.startswith('+') else f"+90{order_in.phone.lstrip('0')}",
        'email': current_user.email,
        'identityNumber': '11111111111',
        'registrationAddress': order_in.shipping_address,
        'ip': '85.34.78.112',
        'city': 'Istanbul',
        'country': 'Turkey'
    }
    
    address = {
        'contactName': current_user.full_name or 'Test User',
        'city': 'Istanbul',
        'country': 'Turkey',
        'address': order_in.shipping_address
    }
    
    # 2. Add Shipping Fee as a separate item to ensure basket total matches price
    basket_items.append({
        'id': 'SHIPPING',
        'name': 'Kargo Ücreti',
        'category1': 'Shipping',
        'itemType': 'VIRTUAL',
        'price': '29.90'
    })
    
    payment_req = PaymentRequestData(
        price=str(round(total_with_shipping, 2)),
        paidPrice=str(round(total_with_shipping, 2)),
        basketId=conversation_id,
        buyer=buyer,
        shippingAddress=address,
        billingAddress=address,
        basketItems=basket_items
    )
    
    # Process Payment with error handling
    try:
        # Pass cardUserKey and save_card flag to iyzico service
        card_info_dict = order_in.card_info.dict() if order_in.card_info else {}
        if order_in.card_token:
            card_info_dict['card_token'] = order_in.card_token
            
        iyzico_res = create_direct_payment(
            payment_req, 
            card_info_dict, 
            card_user_key=current_user.iyzico_card_user_key,
            save_card=order_in.save_card
        )
    except Exception as e:
        logger.error(f"iyzico: Service Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"iyzico: Servis hatası ({str(e)})")
    
    # Tech Lead Fix: Handle bytes response
    if isinstance(iyzico_res, bytes):
        iyzico_res = json.loads(iyzico_res.decode('utf-8'))
    elif isinstance(iyzico_res, str):
        iyzico_res = json.loads(iyzico_res)
    
    if iyzico_res.get('status') != 'success':
        error_msg = iyzico_res.get('errorMessage', 'Bilinmeyen iyzico hatası')
        logger.warning(f"iyzico: Payment Failed: {error_msg}")
        raise HTTPException(status_code=400, detail=f"iyzico Hatası: {error_msg}")
    
    # Payment Success -> Save Order
    db_order = Order(
        user_id=current_user.id,
        total_amount=total_with_shipping,
        shipping_address=order_in.shipping_address,
        status="paid"
    )
    # Assign mock tracking number
    import random
    db_order.tracking_code = f"ARAS-{random.randint(100000000, 999999999)}"
    
    db.add(db_order)
    await db.flush()
    
    for item in order_in.items:
        product = products_cache[item.product_id]
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price_at_purchase=product.price
        )
        db.add(db_item)
        
        product.stock -= item.quantity
        if product.stock < product.min_stock_alert:
            await notify_low_stock(product.id, product.name, product.stock)
            
    await db.commit()
    await db.refresh(db_order)
    
    await notify_order_created(db_order.id, current_user.email, total_with_shipping)
    await notify_order_approved(db_order.id, current_user.id)
    
    # Save card user key if returned by iyzico and not already set
    card_user_key = iyzico_res.get('cardUserKey')
    if card_user_key and not current_user.iyzico_card_user_key:
        current_user.iyzico_card_user_key = card_user_key
        db.add(current_user)
        await db.commit()

    return {
        "status": "success",
        "order_id": db_order.id,
        "total_amount": total_with_shipping
    }

@router.post("/callback")
async def iyzico_callback(token: str = Form(...), db: AsyncSession = Depends(get_db)):
    res = retrieve_checkout_form_result(token)
    from fastapi.responses import RedirectResponse
    frontend_url = "http://localhost:3000"
    
    if res.get('status') == 'success' and res.get('paymentStatus') == 'SUCCESS':
        order_id = int(res.get('basketId'))
        result = await db.execute(select(Order).where(Order.id == order_id))
        order = result.scalars().first()
        if order:
            order.status = "paid"
            await db.commit()
            await notify_order_approved(order.id, order.user_id) # Should be user email but mock is fine
            return RedirectResponse(url=f"{frontend_url}/order-confirmation?order=TS-{order_id:06d}", status_code=303)
            
    return RedirectResponse(url=f"{frontend_url}/cart?error=payment_failed", status_code=303)

@router.get("/my-orders", response_model=List[OrderResponse])
async def get_my_orders(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()

@router.get("/saved-cards")
async def get_saved_cards(current_user = Depends(get_current_user)):
    if not current_user.iyzico_card_user_key:
        return {"status": "success", "cards": []}
    
    try:
        res = list_user_cards(current_user.iyzico_card_user_key)
        if isinstance(res, bytes):
            res = json.loads(res.decode('utf-8'))
        elif isinstance(res, str):
            res = json.loads(res)
            
        return res
    except Exception as e:
        logger.error(f"iyzico: Failed to fetch cards: {str(e)}")
        return {"status": "failure", "details": str(e)}

@router.delete("/saved-cards/{card_token}")
async def remove_saved_card(card_token: str, current_user = Depends(get_current_user)):
    if not current_user.iyzico_card_user_key:
        raise HTTPException(status_code=400, detail="No card user key found")
        
    try:
        res = delete_user_card(current_user.iyzico_card_user_key, card_token)
        if isinstance(res, bytes):
            res = json.loads(res.decode('utf-8'))
        return res
    except Exception as e:
        logger.error(f"iyzico: Failed to delete card: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

from app.api.deps import get_current_active_admin
from pydantic import BaseModel
class OrderStatusUpdate(BaseModel):
    status: str
    tracking_code: str | None = None

@router.get("/all", dependencies=[Depends(get_current_active_admin)])
async def get_all_orders(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.user), selectinload(Order.items).selectinload(OrderItem.product))
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()

@router.put("/{order_id}/status", dependencies=[Depends(get_current_active_admin)])
async def update_order_status(order_id: int, status_update: OrderStatusUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    old_tracking = order.tracking_code
    
    if status_update.status:
        order.status = status_update.status
        
    if status_update.tracking_code:
        order.tracking_code = status_update.tracking_code
        
    # Mock Aras Kargo Auto-Label when approved
    if order.status == "approved" and not order.tracking_code:
        import uuid
        order.tracking_code = "ARAS-" + str(uuid.uuid4()).split("-")[0].upper()
        
    await db.commit()
    
    # Needs notify_tracking_info from webhook service
    if order.tracking_code and order.tracking_code != old_tracking:
        from app.services.webhook_service import notify_tracking_info
        # In a real app we fetch user email from DB via order.user
        await notify_tracking_info(order.id, order.tracking_code)
        
    return {"message": "Order updated", "status": order.status, "tracking_code": order.tracking_code}
