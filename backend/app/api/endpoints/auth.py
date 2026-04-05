from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user_email = user_in.email.lower()
    result = await db.execute(select(User).where(User.email == user_email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user_in.password)
    user = User(
        email=user_email,
        hashed_password=hashed_password,
        full_name=user_in.full_name
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    import logging
    logger = logging.getLogger(__name__)
    
    login_email = form_data.username.lower()
    logger.info(f"Login attempt for email: {login_email}")
    
    result = await db.execute(select(User).where(User.email == login_email))
    user = result.scalars().first()
    
    if not user:
        logger.warning(f"Login failed: User not found for email {login_email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    password_match = verify_password(form_data.password, user.hashed_password)
    if not password_match:
        logger.warning(f"Login failed: Password mismatch for email {login_email}")
        print(f"DEBUG: Gelen Şifre: {form_data.password}, Beklenen Hash: {user.hashed_password}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "full_name": user.full_name,
        "is_admin": user.is_admin
    }
    
@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
