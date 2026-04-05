import httpx
from app.core.config import settings
import asyncio
import logging

logger = logging.getLogger(__name__)

async def send_webhook(url: str, payload: dict):
    if not url:
        logger.warning("Webhook URL not configured, skipping")
        return
    
    async def _send():
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, timeout=10.0)
                response.raise_for_status()
                logger.info(f"Successfully sent webhook to {url}")
            except Exception as e:
                logger.error(f"Failed to send webhook to {url}: {e}")
                
    # Fire and forget
    asyncio.create_task(_send())

async def notify_order_created(order_id: int, user_email: str, amount: float):
    await send_webhook(
        settings.N8N_WEBHOOK_ORDER_CREATED,
        {"event": "order_created", "order_id": order_id, "user_email": user_email, "amount": amount}
    )

async def notify_low_stock(product_id: int, product_name: str, stock: int):
    await send_webhook(
        settings.N8N_WEBHOOK_LOW_STOCK,
        {"event": "low_stock", "product_id": product_id, "product_name": product_name, "stock": stock}
    )

async def notify_order_approved(order_id: int, user_email: str):
    await send_webhook(
        settings.N8N_WEBHOOK_ORDER_APPROVED,
        {"event": "order_approved", "order_id": order_id, "user_email": user_email}
    )

async def notify_tracking(order_id: int, user_email: str, tracking_code: str):
    await send_webhook(
        settings.N8N_WEBHOOK_TRACKING,
        {"event": "tracking_updated", "order_id": order_id, "user_email": user_email, "tracking_code": tracking_code}
    )
