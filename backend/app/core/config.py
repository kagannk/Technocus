from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Technocus API"
    DATABASE_URL: str = "postgresql+asyncpg://tekno_user:tekno_pass@localhost:5432/technocus_db"
    
    SECRET_KEY: str = "your-super-secret-jwt-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    IYZICO_API_KEY: str = ""
    IYZICO_SECRET_KEY: str = ""
    IYZICO_BASE_URL: str = ""

    N8N_WEBHOOK_ORDER_CREATED: str = ""
    N8N_WEBHOOK_LOW_STOCK: str = ""
    N8N_WEBHOOK_ORDER_APPROVED: str = ""
    N8N_WEBHOOK_TRACKING: str = ""
    
    class Config:
        case_sensitive = True

settings = Settings()
