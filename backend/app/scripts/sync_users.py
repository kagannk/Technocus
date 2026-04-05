import asyncio
import sys
import os

# Add the project root to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from sqlalchemy.future import select
from sqlalchemy import update

async def sync_users():
    async with AsyncSessionLocal() as db:
        # 1. Update/Ensure Admin
        admin_email = "yilmazkaganadmin@gmail.com"
        admin_pass = "Admin123"
        
        result = await db.execute(select(User).where(User.email == admin_email))
        admin_user = result.scalars().first()
        
        if admin_user:
            admin_user.hashed_password = get_password_hash(admin_pass)
            admin_user.is_admin = True
            admin_user.is_active = True
            print(f"Updated existing admin: {admin_email}")
        else:
            # Check if old admin exists and update it, or create new
            old_admin_email = "yilmazkagan08@technocus.com"
            result = await db.execute(select(User).where(User.email == old_admin_email))
            old_admin = result.scalars().first()
            if old_admin:
                old_admin.email = admin_email
                old_admin.hashed_password = get_password_hash(admin_pass)
                print(f"Migrated old admin to: {admin_email}")
            else:
                new_admin = User(
                    email=admin_email,
                    hashed_password=get_password_hash(admin_pass),
                    full_name="System Admin",
                    is_active=True,
                    is_admin=True
                )
                db.add(new_admin)
                print(f"Created new admin: {admin_email}")

        # 2. Update/Ensure Customer
        cust_email = "yilmazkagantest@gmail.com"
        cust_pass = "Password123"
        
        result = await db.execute(select(User).where(User.email == cust_email))
        cust_user = result.scalars().first()
        if cust_user:
            cust_user.hashed_password = get_password_hash(cust_pass)
            print(f"Updated existing customer: {cust_email}")
        else:
            new_cust = User(
                email=cust_email,
                hashed_password=get_password_hash(cust_pass),
                full_name="Test Customer",
                is_active=True,
                is_admin=False
            )
            db.add(new_cust)
            print(f"Created new customer: {cust_email}")

        await db.commit()
        print("User synchronization successful.")

if __name__ == "__main__":
    asyncio.run(sync_users())
