from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_active_admin
from app.models.setting import Setting
from app.schemas.setting import SettingCreate, SettingResponse, SettingUpdate

router = APIRouter()

@router.get("/", response_model=List[SettingResponse], dependencies=[Depends(get_current_active_admin)])
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting))
    return result.scalars().all()

@router.post("/", response_model=SettingResponse, dependencies=[Depends(get_current_active_admin)])
async def create_setting(setting_in: SettingCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting).where(Setting.key == setting_in.key))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Setting key already exists")
    
    new_setting = Setting(**setting_in.model_dump())
    db.add(new_setting)
    await db.commit()
    await db.refresh(new_setting)
    return new_setting

@router.put("/{key}", response_model=SettingResponse, dependencies=[Depends(get_current_active_admin)])
async def update_setting(key: str, setting_in: SettingUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting).where(Setting.key == key))
    setting = result.scalars().first()
    if not setting:
        setting = Setting(key=key, value=setting_in.value)
        db.add(setting)
    else:
        setting.value = setting_in.value
        
    await db.commit()
    await db.refresh(setting)
    return setting
