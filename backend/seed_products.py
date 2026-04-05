"""
Technocus Robotik/Drone/Elektronik Parça Seed Script
Çalıştırmak için: python seed_products.py
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.models.category import Category
from app.models.product import Product
from sqlalchemy.future import select

CATEGORIES = [
    {
        "name": "Drone",
        "slug": "drone",
        "description": "FPV drone parçaları, çerçeveler, motorlar ve uçuş kontrol sistemleri.",
        "image_url": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800"
    },
    {
        "name": "Elektronik",
        "slug": "elektronik",
        "description": "Mikrodenetleyiciler, sensörler, modüller ve geliştirme kartları.",
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"
    },
    {
        "name": "Robotik",
        "slug": "robotik",
        "description": "Servo motorlar, robot kitleri, hareket sistemleri ve yapay zeka modülleri.",
        "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800"
    },
]

# slug -> category identifier for assignment
PRODUCTS = [
    # ── DRONE ──────────────────────────────────────────────────────────────────
    {
        "sku": "DRN-BLM-2306",
        "name": "FPV Brushless Motor 2306 2400KV",
        "slug": "fpv-brushless-motor-2306-2400kv",
        "description": "Yarış drone'ları ve FPV freestyle için tasarlanmış yüksek devirli 2306 2400KV brushless motor. 4S-6S LiPo uyumlu, CW ve CCW çift paket.",
        "price": 349.90,
        "stock": 85,
        "category_slug": "drone",
        "image_urls": ["https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600"],
        "spec_data": {"KV": "2400", "Boyut": "2306", "Gerilim": "4S-6S", "Ağırlık": "30g"}
    },
    {
        "sku": "DRN-ESC-45A",
        "name": "BLHeli_S 45A 4-in-1 ESC",
        "slug": "blheli-s-45a-4in1-esc",
        "description": "4-in-1 BLHeli_S 45A Electronic Speed Controller. Dshot600 desteği, düşük ağırlık ve temiz kablo düzeni için idealdir.",
        "price": 529.00,
        "stock": 42,
        "category_slug": "drone",
        "image_urls": ["https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=600"],
        "spec_data": {"Akım": "45A burst", "Protokol": "Dshot600", "Boyut": "36x36mm"}
    },
    {
        "sku": "DRN-FC-F7",
        "name": "Speedybee F7 V3 Uçuş Kontrolcüsü",
        "slug": "speedybee-f7-v3-ucus-kontrolcusu",
        "description": "STM32F7 tabanlı uçuş kontrolcüsü. Betaflight uyumlu, dahili Bluetooth ve WiFi ile kolay kurulum.",
        "price": 899.00,
        "stock": 28,
        "category_slug": "drone",
        "image_urls": ["https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600"],
        "spec_data": {"İşlemci": "STM32F7", "Gyro": "ICM-42688P", "Bağlantı": "Bluetooth/WiFi"}
    },
    {
        "sku": "DRN-LIPO-4S",
        "name": "LiPo Batarya 4S 1500mAh 100C",
        "slug": "lipo-batarya-4s-1500mah-100c",
        "description": "FPV drone yarışları için yüksek deşarj kapasiteli 4S 1500mAh LiPo batarya. XT60 konektör dahil.",
        "price": 279.00,
        "stock": 120,
        "category_slug": "drone",
        "image_urls": ["https://images.unsplash.com/photo-1598300188904-6287d98bdab0?w=600"],
        "spec_data": {"Hücre": "4S (14.8V)", "Kapasite": "1500mAh", "Deşarj": "100C", "Konektör": "XT60"}
    },
    {
        "sku": "DRN-VTX-5.8G",
        "name": "5.8GHz 25-800mW Ayarlı Video Verici",
        "slug": "5ghz-video-verici-800mw",
        "description": "FPV video iletimi için 5.8GHz 25/200/600/800mW ayarlı verici. Pit mode desteği ile yarış güvenliği.",
        "price": 439.00,
        "stock": 55,
        "category_slug": "drone",
        "image_urls": ["https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600"],
        "spec_data": {"Frekans": "5.8GHz", "Güç": "25-800mW", "Kanal": "40ch"}
    },
    {
        "sku": "DRN-FRAME-5IN",
        "name": "Apex 5 inç FPV Çerçeve",
        "slug": "apex-5-inc-fpv-cerceve",
        "description": "3K karbon fiber True-X 5 inç FPV drone çerçevesi. 30x30mm ve 20x20mm yığma için uygun, 5mm alt plaka.",
        "price": 389.00,
        "stock": 35,
        "category_slug": "drone",
        "image_urls": ["https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600"],
        "spec_data": {"Pervane": "5 inç", "Malzeme": "3K Karbon Fiber", "Plaka": "5mm alt, 2mm üst"}
    },

    # ── ELEKTRONİK ─────────────────────────────────────────────────────────────
    {
        "sku": "ELK-ARD-UNO",
        "name": "Arduino Uno R3 Geliştirme Kartı",
        "slug": "arduino-uno-r3",
        "description": "ATmega328P tabanlı Arduino Uno R3. Başlangıç ve prototip projeleri için ideal, USB-B kablo dahil.",
        "price": 249.90,
        "stock": 200,
        "category_slug": "elektronik",
        "image_urls": ["https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600"],
        "spec_data": {"İşlemci": "ATmega328P", "I/O Pin": "14 dijital, 6 analog", "Flash": "32KB"}
    },
    {
        "sku": "ELK-RPI-5",
        "name": "Raspberry Pi 5 (4GB RAM)",
        "slug": "raspberry-pi-5-4gb",
        "description": "Quad-Core Cortex-A76 2.4GHz işlemci ve 4GB LPDDR4X RAM ile en güçlü Raspberry Pi. PCIe 2.0, dual 4K HDMI çıkışı.",
        "price": 1849.00,
        "stock": 30,
        "category_slug": "elektronik",
        "image_urls": ["https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600"],
        "spec_data": {"İşlemci": "Cortex-A76 2.4GHz", "RAM": "4GB LPDDR4X", "USB": "2x USB 3.0, 2x USB 2.0"}
    },
    {
        "sku": "ELK-LIDAR-TF",
        "name": "TF-Luna LiDAR Menzil Sensörü",
        "slug": "tf-luna-lidar-sensoru",
        "description": "8m menzile kadar cm hassasiyetli TOF LiDAR sensör. UART/I2C arayüzü, drone engel tanıma ve robotik uygulamalar için.",
        "price": 319.00,
        "stock": 65,
        "category_slug": "elektronik",
        "image_urls": ["https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600"],
        "spec_data": {"Menzil": "0.2-8m", "Arayüz": "UART / I2C", "Frekans": "250Hz", "Ağırlık": "5g"}
    },
    {
        "sku": "ELK-IMU-MPU",
        "name": "MPU-6050 6-Eksen IMU Modülü",
        "slug": "mpu-6050-imu-modulu",
        "description": "3 eksen ivme ve 3 eksen gyro sensörü içeren I2C IMU modülü. Denge robotu, gimbal ve uçuş kontrol projeleri için.",
        "price": 49.90,
        "stock": 350,
        "category_slug": "elektronik",
        "image_urls": ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"],
        "spec_data": {"Eksen": "6 (3 gyro + 3 ivme)", "Arayüz": "I2C", "Gerilim": "3.3V-5V"}
    },
    {
        "sku": "ELK-ESP32-WROOM",
        "name": "ESP32-WROOM-32 WiFi+BT Modülü",
        "slug": "esp32-wroom-32-wifi-bt",
        "description": "Dual-Core 240MHz ESP32 işlemci, WiFi 802.11 b/g/n ve Bluetooth 4.2/BLE dahil. IoT ve kablosuz proje geliştirme için.",
        "price": 89.90,
        "stock": 280,
        "category_slug": "elektronik",
        "image_urls": ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"],
        "spec_data": {"İşlemci": "Xtensa LX6 240MHz", "Bellek": "520KB SRAM", "Kablosuz": "WiFi + BT 4.2"}
    },
    {
        "sku": "ELK-OLED-128",
        "name": "0.96\" OLED Ekran Modülü (I2C)",
        "slug": "oled-ekran-096-i2c",
        "description": "128x64 piksel SSD1306 sürücülü I2C OLED ekran. Arduino, ESP32 ve Raspberry Pi ile uyumlu. Mavi veya beyaz piksel.",
        "price": 59.90,
        "stock": 400,
        "category_slug": "elektronik",
        "image_urls": ["https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600"],
        "spec_data": {"Çözünürlük": "128x64", "Sürücü": "SSD1306", "Arayüz": "I2C (0x3C)"}
    },

    # ── ROBOTİK ────────────────────────────────────────────────────────────────
    {
        "sku": "ROB-SERVO-MG996",
        "name": "MG996R Metal Dişlili Servo Motor",
        "slug": "mg996r-servo-motor",
        "description": "11kg.cm tork kapasiteli metal dişlili dijital servo. Robot kolu, pan-tilt gimbal ve RC araç uygulamaları için ideal.",
        "price": 119.90,
        "stock": 180,
        "category_slug": "robotik",
        "image_urls": ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600"],
        "spec_data": {"Tork": "11kg.cm (6V)", "Hız": "0.17s/60°", "Dişli": "Metal", "Kontrol": "PWM"}
    },
    {
        "sku": "ROB-KIT-4WD",
        "name": "4WD Akıllı Robot Araba Kiti",
        "slug": "4wd-akilli-robot-araba-kiti",
        "description": "Arduino uyumlu 4 tekerlekli robot araba platformu. DC motorlar, L298N motor sürücü, ultrasonik sensör ve şasi dahil.",
        "price": 449.00,
        "stock": 45,
        "category_slug": "robotik",
        "image_urls": ["https://images.unsplash.com/photo-1561144257-e32e8506ae3e?w=600"],
        "spec_data": {"Motor": "4x TT DC", "Sürücü": "L298N", "Sensör": "HC-SR04 ultrasonik"}
    },
    {
        "sku": "ROB-ARM-6DOF",
        "name": "6 Eksenli Robot Kolu (Alüminyum)",
        "slug": "6-eksenli-robot-kolu",
        "description": "6 DOF alüminyum profil robot kolu. MG996R x6 servo dahil, Arduino/Raspberry Pi kontrollü. Öğretim ve araştırma için.",
        "price": 1249.00,
        "stock": 18,
        "category_slug": "robotik",
        "image_urls": ["https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600"],
        "spec_data": {"DOF": "6", "Yük Kapasitesi": "500g", "Malzeme": "Alüminyum alaşım"}
    },
    {
        "sku": "ROB-STEP-NEMA17",
        "name": "NEMA 17 Step Motor 42x40mm",
        "slug": "nema-17-step-motor-42x40",
        "description": "3D yazıcı ve CNC projeleri için 1.8°/adım NEMA17 step motor. 45N.cm tork, 2 fazlı bipolar.",
        "price": 189.90,
        "stock": 140,
        "category_slug": "robotik",
        "image_urls": ["https://images.unsplash.com/photo-1608292772253-53d1e793a9a7?w=600"],
        "spec_data": {"Adım Açısı": "1.8°", "Tork": "45N.cm", "Akım": "1.5A", "Faz": "2"}
    },
    {
        "sku": "ROB-JETSON-NANO",
        "name": "NVIDIA Jetson Nano 4GB (Geliştirici Kit)",
        "slug": "nvidia-jetson-nano-4gb",
        "description": "128-çekirdek Maxwell GPU ve Quad-Core ARM A57 işlemcili yapay zeka geliştirme kartı. Görüntü işleme ve derin öğrenme için.",
        "price": 3499.00,
        "stock": 12,
        "category_slug": "robotik",
        "image_urls": ["https://images.unsplash.com/photo-1620459137207-c6f7a7b54b43?w=600"],
        "spec_data": {"GPU": "128-core Maxwell", "CPU": "Quad ARM A57", "RAM": "4GB LPDDR4"}
    },
    {
        "sku": "ROB-GRIPPER-SG",
        "name": "Servo Kontrollü Robotic Gripper",
        "slug": "servo-robotik-gripper",
        "description": "Tek servo ile çalışan paralel mekanizmalı robotik pençe. Alüminyum gövde, Arduino/ROS uyumlu.",
        "price": 329.00,
        "stock": 60,
        "category_slug": "robotik",
        "image_urls": ["https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=600"],
        "spec_data": {"Açılış": "0-80mm", "Servo": "MG90S dahil", "Ağırlık": "120g"}
    },
    {
        "sku": "ROB-ENCODER-500",
        "name": "Optik Enkoder Modülü 500PPR",
        "slug": "optik-enkoder-500ppr",
        "description": "Motor hız ve pozisyon geri bildirimi için 500 darbe/tur çözünürlüklü fotoelektrik enkoder. Şaft adaptörü dahil.",
        "price": 149.90,
        "stock": 95,
        "category_slug": "robotik",
        "image_urls": ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"],
        "spec_data": {"PPR": "500", "Tip": "Artımsal optik", "Çıkış": "A/B kanalı TTL"}
    },
]


async def seed():
    async with AsyncSessionLocal() as db:
        # ── Kategorileri ekle ────────────────────────────────────────────────
        cat_map = {}  # slug -> id
        for cat_data in CATEGORIES:
            result = await db.execute(
                select(Category).where(Category.slug == cat_data["slug"])
            )
            existing = result.scalars().first()
            if not existing:
                cat = Category(**cat_data)
                db.add(cat)
                await db.flush()
                cat_map[cat_data["slug"]] = cat.id
                print(f"✅ Kategori oluşturuldu: {cat_data['name']}")
            else:
                cat_map[cat_data["slug"]] = existing.id
                print(f"⏭️  Kategori zaten var: {cat_data['name']}")

        await db.commit()

        # ── Ürünleri ekle ────────────────────────────────────────────────────
        for prod_data in PRODUCTS:
            cat_slug = prod_data.pop("category_slug")
            cat_id = cat_map.get(cat_slug)
            if not cat_id:
                print(f"⚠️  Kategori bulunamadı: {cat_slug}")
                continue

            result = await db.execute(
                select(Product).where(Product.sku == prod_data["sku"])
            )
            existing = result.scalars().first()
            if not existing:
                prod = Product(**prod_data, category_id=cat_id)
                db.add(prod)
                print(f"✅ Ürün oluşturuldu: {prod_data['name']}")
            else:
                print(f"⏭️  Ürün zaten var: {prod_data['name']}")

        await db.commit()
        print("\n🎉 Seed işlemi tamamlandı!")


if __name__ == "__main__":
    asyncio.run(seed())
