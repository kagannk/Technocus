from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from sqlalchemy import text
import logging
import os
from sqlalchemy.exc import ProgrammingError, OperationalError

from app.api.endpoints import auth, categories, products, orders, upload, admin, campaigns, customers, settings
from app.core.database import AsyncSessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.category import Category
from app.models.product import Product

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Technocus API",
    description="API for Technocus E-Commerce Platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin for origin in [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://technocus.vercel.app",
            os.getenv("FRONTEND_URL", ""),
        ] if origin  # filter out empty strings
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Self-healing migrations ───────────────────────────────────────────────────
SAFE_MIGRATIONS = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS iyzico_card_user_key VARCHAR(255)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount FLOAT DEFAULT 0",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'",
]

# ── Seed data ─────────────────────────────────────────────────────────────────
SEED_CATEGORIES = [
    {"name": "Drone", "slug": "drone", "description": "FPV drone parçaları, çerçeveler, motorlar ve uçuş kontrol sistemleri.", "image_url": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800"},
    {"name": "Elektronik", "slug": "elektronik", "description": "Mikrodenetleyiciler, sensörler, modüller ve geliştirme kartları.", "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"},
    {"name": "Robotik", "slug": "robotik", "description": "Servo motorlar, robot kitleri, hareket sistemleri ve yapay zeka modülleri.", "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800"},
]

SEED_PRODUCTS = [
    {"sku":"DRN-BLM-2306","name":"FPV Brushless Motor 2306 2400KV","slug":"fpv-brushless-motor-2306-2400kv","description":"Yarış drone'ları için yüksek devirli 2306 2400KV brushless motor. 4S-6S LiPo uyumlu, çift paket.","price":349.90,"stock":85,"cat":"drone","image_urls":["https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600"],"spec_data":{"KV":"2400","Boyut":"2306","Gerilim":"4S-6S"}},
    {"sku":"DRN-ESC-45A","name":"BLHeli_S 45A 4-in-1 ESC","slug":"blheli-s-45a-4in1-esc","description":"4-in-1 BLHeli_S 45A ESC. Dshot600 desteği ile FPV drone yarış ve freestyle için.","price":529.00,"stock":42,"cat":"drone","image_urls":["https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=600"],"spec_data":{"Akım":"45A","Protokol":"Dshot600"}},
    {"sku":"DRN-FC-F7","name":"Speedybee F7 V3 Uçuş Kontrolcüsü","slug":"speedybee-f7-v3-ucus-kontrolcusu","description":"STM32F7 tabanlı Betaflight uyumlu uçuş kontrolcüsü. Dahili Bluetooth ve WiFi.","price":899.00,"stock":28,"cat":"drone","image_urls":["https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600"],"spec_data":{"İşlemci":"STM32F7","Gyro":"ICM-42688P"}},
    {"sku":"DRN-LIPO-4S","name":"LiPo Batarya 4S 1500mAh 100C","slug":"lipo-batarya-4s-1500mah-100c","description":"FPV yarış drone'ları için yüksek deşarjlı 4S 1500mAh LiPo batarya. XT60 konektör dahil.","price":279.00,"stock":120,"cat":"drone","image_urls":["https://images.unsplash.com/photo-1598300188904-6287d98bdab0?w=600"],"spec_data":{"Hücre":"4S","Kapasite":"1500mAh","Deşarj":"100C"}},
    {"sku":"DRN-VTX-5G","name":"5.8GHz 25-800mW Video Verici","slug":"5ghz-video-verici-800mw","description":"FPV video iletimi için 5.8GHz ayarlı verici. Pit mode desteği, 40 kanal.","price":439.00,"stock":55,"cat":"drone","image_urls":["https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600"],"spec_data":{"Frekans":"5.8GHz","Güç":"800mW maks"}},
    {"sku":"DRN-FRAME-5IN","name":"Apex 5 inç FPV Karbon Çerçeve","slug":"apex-5-inc-fpv-cerceve","description":"3K karbon fiber True-X 5 inç FPV drone çerçevesi. 5mm alt plaka.","price":389.00,"stock":35,"cat":"drone","image_urls":["https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600"],"spec_data":{"Pervane":"5 inç","Malzeme":"3K Karbon Fiber"}},
    {"sku":"ELK-ARD-UNO","name":"Arduino Uno R3 Geliştirme Kartı","slug":"arduino-uno-r3","description":"ATmega328P tabanlı Arduino Uno R3. Başlangıç ve proto projekter için ideal, USB-B kablo dahil.","price":249.90,"stock":200,"cat":"elektronik","image_urls":["https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600"],"spec_data":{"İşlemci":"ATmega328P","Flash":"32KB"}},
    {"sku":"ELK-RPI-5","name":"Raspberry Pi 5 (4GB RAM)","slug":"raspberry-pi-5-4gb","description":"Quad-Core Cortex-A76 2.4GHz ve 4GB LPDDR4X RAM. PCIe 2.0, dual 4K HDMI.","price":1849.00,"stock":30,"cat":"elektronik","image_urls":["https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600"],"spec_data":{"İşlemci":"Cortex-A76 2.4GHz","RAM":"4GB"}},
    {"sku":"ELK-LIDAR-TF","name":"TF-Luna LiDAR Menzil Sensörü","slug":"tf-luna-lidar-sensoru","description":"8m menzile kadar cm hassasiyetli TOF LiDAR. UART/I2C, drone engel tanıma için.","price":319.00,"stock":65,"cat":"elektronik","image_urls":["https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600"],"spec_data":{"Menzil":"0.2-8m","Frekans":"250Hz"}},
    {"sku":"ELK-IMU-MPU","name":"MPU-6050 6-Eksen IMU Modülü","slug":"mpu-6050-imu-modulu","description":"3 eksen ivme + 3 eksen gyro I2C IMU modülü. Denge robotu ve uçuş kontrol için.","price":49.90,"stock":350,"cat":"elektronik","image_urls":["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"],"spec_data":{"Eksen":"6 DOF","Arayüz":"I2C"}},
    {"sku":"ELK-ESP32-W","name":"ESP32-WROOM-32 WiFi+BT Modülü","slug":"esp32-wroom-32-wifi-bt","description":"Dual-Core 240MHz ESP32, WiFi 802.11 b/g/n ve Bluetooth 4.2/BLE dahil IoT modülü.","price":89.90,"stock":280,"cat":"elektronik","image_urls":["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"],"spec_data":{"İşlemci":"240MHz dual","Kablosuz":"WiFi+BT"}},
    {"sku":"ELK-OLED-96","name":"0.96\" OLED Ekran Modülü I2C","slug":"oled-ekran-096-i2c","description":"128x64 piksel SSD1306 sürücülü OLED ekran. Arduino, ESP32, Raspberry Pi uyumlu.","price":59.90,"stock":400,"cat":"elektronik","image_urls":["https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600"],"spec_data":{"Çözünürlük":"128x64","Sürücü":"SSD1306"}},
    {"sku":"ELK-BREAD-830","name":"830 Noktalı Breadboard","slug":"830-nokta-breadboard","description":"Prototip devreler için 830 delikli tam boyut breadboard. 4 güç rayı, 63 sütun.","price":34.90,"stock":500,"cat":"elektronik","image_urls":["https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600"],"spec_data":{"Delik Sayısı":"830","Rail":"4 güç rayı"}},
    {"sku":"ROB-SERVO-MG996","name":"MG996R Metal Dişlili Servo Motor","slug":"mg996r-servo-motor","description":"11kg.cm tork kapasiteli metal dişlili dijital servo. Robot kolu ve gimbal için ideal.","price":119.90,"stock":180,"cat":"robotik","image_urls":["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600"],"spec_data":{"Tork":"11kg.cm","Dişli":"Metal"}},
    {"sku":"ROB-KIT-4WD","name":"4WD Akıllı Robot Araba Kiti","slug":"4wd-akilli-robot-araba-kiti","description":"Arduino uyumlu 4 tekerlekli robot araba platformu. Motor, sürücü, sensör dahil.","price":449.00,"stock":45,"cat":"robotik","image_urls":["https://images.unsplash.com/photo-1561144257-e32e8506ae3e?w=600"],"spec_data":{"Tekerlek":"4WD","Sensör":"HC-SR04"}},
    {"sku":"ROB-ARM-6DOF","name":"6 Eksenli Alüminyum Robot Kolu","slug":"6-eksenli-robot-kolu","description":"6 DOF alüminyum robot kolu, MG996R x6 servo dahil. Arduino/ROS uyumlu.","price":1249.00,"stock":18,"cat":"robotik","image_urls":["https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600"],"spec_data":{"DOF":"6","Kapasite":"500g"}},
    {"sku":"ROB-STEP-NEMA17","name":"NEMA 17 Step Motor 42x40mm","slug":"nema-17-step-motor-42x40","description":"1.8°/adım NEMA17 step motor. 3D yazıcı ve CNC projeleri için 45N.cm tork.","price":189.90,"stock":140,"cat":"robotik","image_urls":["https://images.unsplash.com/photo-1608292772253-53d1e793a9a7?w=600"],"spec_data":{"Adım":"1.8°","Tork":"45N.cm"}},
    {"sku":"ROB-JETSON-N4","name":"NVIDIA Jetson Nano 4GB Developer Kit","slug":"nvidia-jetson-nano-4gb","description":"128-çekirdek Maxwell GPU, Quad-Core ARM A57 yapay zeka geliştirme kartı.","price":3499.00,"stock":12,"cat":"robotik","image_urls":["https://images.unsplash.com/photo-1620459137207-c6f7a7b54b43?w=600"],"spec_data":{"GPU":"128-core Maxwell","RAM":"4GB LPDDR4"}},
    {"sku":"ROB-GRIPPER-SG","name":"Servo Kontrollü Robotik Gripper","slug":"servo-robotik-gripper","description":"Tek servo ile paralel mekanizmalı alüminyum robotik pençe. Arduino/ROS uyumlu.","price":329.00,"stock":60,"cat":"robotik","image_urls":["https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=600"],"spec_data":{"Açılış":"0-80mm","Ağırlık":"120g"}},
    {"sku":"ROB-ENC-500","name":"Optik Enkoder Modülü 500PPR","slug":"optik-enkoder-500ppr","description":"Motor hız ve pozisyon geri bildirimi için 500PPR fotoelektrik enkoder. Şaft adaptörü dahil.","price":149.90,"stock":95,"cat":"robotik","image_urls":["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"],"spec_data":{"PPR":"500","Çıkış":"A/B TTL"}},
]

@app.on_event("startup")
async def startup_event():
    # Step 1: Auto-migrate any missing columns before ORM queries
    try:
        async with engine.begin() as conn:
            for sql in SAFE_MIGRATIONS:
                try:
                    await conn.execute(text(sql))
                    logger.info(f"[MIGRATION] OK: {sql[:70]}...")
                except Exception as col_err:
                    logger.warning(f"[MIGRATION] Atlandı (zaten var?): {col_err}")
    except Exception as e:
        logger.error(f"[MIGRATION] Bağlantı hatası: {e}")

    # Step 2: Seed admin — always force-overwrite hash for guaranteed login
    try:
        async with AsyncSessionLocal() as db:
            admin_email = "patron@technocus.com"
            result = await db.execute(select(User).where(User.email == admin_email))
            admin_user = result.scalars().first()

            fresh_hash = get_password_hash("admin123")
            logger.info(f"[STARTUP] Admin seed başlatılıyor: {admin_email}")

            if not admin_user:
                new_admin = User(
                    email=admin_email,
                    hashed_password=fresh_hash,
                    full_name="Technocus Patron",
                    is_active=True,
                    is_admin=True
                )
                db.add(new_admin)
                await db.commit()
                await db.refresh(new_admin)
                logger.info("[STARTUP] ✅ Admin kullanıcısı oluşturuldu.")
            else:
                # Her zaman şifreyi ve rolü güncelle — eski/bozuk hash'leri ez
                admin_user.hashed_password = fresh_hash
                admin_user.is_admin = True
                admin_user.is_active = True
                await db.commit()
                await db.refresh(admin_user)
                logger.info("[STARTUP] ✅ Admin şifresi ve rolü güncellendi.")
    except Exception as e:
        logger.error(f"[STARTUP] Seed hatası: {e}")

    # Step 3: Seed categories and products
    try:
        async with AsyncSessionLocal() as db:
            cat_id_map = {}
            for cat_data in SEED_CATEGORIES:
                res = await db.execute(select(Category).where(Category.slug == cat_data["slug"]))
                existing_cat = res.scalars().first()
                if not existing_cat:
                    cat = Category(**cat_data)
                    db.add(cat)
                    await db.flush()
                    cat_id_map[cat_data["slug"]] = cat.id
                    logger.info(f"[SEED] Kategori oluşturuldu: {cat_data['name']}")
                else:
                    cat_id_map[cat_data["slug"]] = existing_cat.id
            await db.commit()

            for p in SEED_PRODUCTS:
                res = await db.execute(select(Product).where(Product.sku == p["sku"]))
                if not res.scalars().first():
                    cat_id = cat_id_map.get(p["cat"])
                    if cat_id:
                        prod = Product(
                            sku=p["sku"], name=p["name"], slug=p["slug"],
                            description=p["description"], price=p["price"],
                            stock=p["stock"], category_id=cat_id,
                            image_urls=p["image_urls"], spec_data=p["spec_data"]
                        )
                        db.add(prod)
                        logger.info(f"[SEED] Ürün oluşturuldu: {p['name']}")
            await db.commit()
            logger.info("[SEED] ✅ Kategori ve ürün seed tamamlandı.")
    except Exception as e:
        logger.error(f"[SEED] Hata: {e}")


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["campaigns"])
app.include_router(customers.router, prefix="/api/customers", tags=["customers"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

@app.get("/")
async def root():
    return {"message": "Welcome to Technocus API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
