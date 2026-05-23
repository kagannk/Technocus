# Technocus — Proje Rehberi

## Geliştirici
- GitHub: kagannk
- Repo: https://github.com/kagannk/Technocus

## Son Güncelleme
- Tarih: Mayıs 2026
- Son odak: Railway + Vercel deploy, giriş/sepet/ödeme akışları

## Çalışma Kuralı — ÖNEMLİ
Her görev tamamlandığında CLAUDE.md otomatik güncellenir.
Bu sayede Kagan nerede kaldığını takip etmek zorunda kalmaz.
Her promptun sonuna şunu ekle:
  git add CLAUDE.md
  git commit -m "docs: CLAUDE.md güncellendi — [yapılan iş]"
  git push

## Tech Stack

| Katman     | Teknoloji                                              |
|------------|--------------------------------------------------------|
| Frontend   | Next.js 14, TypeScript, TailwindCSS (port 3000)        |
| Backend    | FastAPI, Python, SQLAlchemy Async, Alembic (port 8000) |
| Veritabanı | PostgreSQL                                             |
| Container  | Docker Compose (lokal geliştirme)                      |
| Görsel     | Cloudinary                                             |
| Ödeme      | iyzico sandbox                                         |
| Otomasyon  | n8n (port 5678)                                        |

## Deploy Durumu — GÜNCEL

| Servis     | Platform | Durum             | Notlar                          |
|------------|----------|-------------------|---------------------------------|
| Frontend   | Vercel   | ✅ Canlı          | NEXT_PUBLIC_API_URL set edilecek|
| Backend    | Railway  | ✅ Canlı          | URL .env.local'a eklenecek      |
| Database   | Railway  | ✅ Canlı          | DATABASE_URL Railway'den alınır |

### Kritik Bağlantı Notları
- Frontend (Vercel) → Backend (Railway): NEXT_PUBLIC_API_URL = Railway backend URL
- CORS'a Vercel URL'i eklenecek: backend/main.py → FRONTEND_URL env variable
- Alembic migration'ları Railway backend başlarken otomatik çalışacak
- Railway panelinden: DATABASE_URL, SECRET_KEY kontrol et
- Vercel panelinden: NEXT_PUBLIC_API_URL = Railway backend URL set et

## Çalıştırma (Lokal)

docker compose up --build   # ilk çalıştırma
docker compose up           # sonraki çalıştırmalar
docker compose down         # durdur

## Mevcut Durum

### ✅ Çalışan / Hazır
- Docker Compose yapılandırması sağlam
- Tüm .env değerleri tanımlı (Cloudinary, iyzico, DB)
- Backend self-healing: main.py eksik kolonları otomatik ekler
- iyzico sandbox entegrasyonu kurulu
- Cloudinary entegrasyonu kurulu
- Admin paneli sayfaları mevcut
- Backend ve Database Railway'de canlı
- Frontend Vercel'de canlı

### ❌ Kritik Buglar
- Müşteri login/register 401 hatası — ÇÖZÜLMEDEN DEVAM ETMEYİN
- Frontend'de NEXT_PUBLIC_API_URL henüz set edilmemiş
- FRONTEND_URL env değişkeni CORS'a eklenmemiş
- Alembic Railway'de devre dışı

### ⏳ Bekleyen Görevler (öncelik sırasıyla)
1. [AKTİF] Railway URL → Vercel NEXT_PUBLIC_API_URL ve CORS ayarı
2. [AKTİF] Giriş sistemi 401 hatası çözülecek
3. [AKTİF] Admin hesabı + test müşteri hesabı oluşturulacak
4. [AKTİF] Sepete ekleme akışı eksiksiz çalışacak
5. [AKTİF] Satın alma akışı (iyzico) uçtan uca çalışacak
6. [AKTİF] Her ürüne ayrı Cloudinary fotoğrafı eklenecek
7. Alembic migration Railway'de aktif edilecek
8. n8n workflow'ları kurulacak

## Test Hesapları

### Admin
- URL: /admin/login
- Email: admin@technocus.com
- Şifre: .env → ADMIN_PASSWORD

### Müşteri (Test)
- URL: /login
- Email: test@technocus.com
- Şifre: Test1234!

Her iki hesap da migration/seed script ile otomatik oluşturulacak.

## Giriş & Satın Alma Akışı — Kritik Gereksinimler

Bu 3 akış eksiksiz çalışmadan başka hiçbir şeye geçilmez:

1. GİRİŞ
   - /login → JWT token alınır → httpOnly cookie'ye yazılır
   - /register → hesap oluşturulur → otomatik login olunur
   - 401 hatası tamamen ortadan kalkar

2. SEPET
   - Giriş yapmadan sepete eklenebilir (guest cart)
   - Giriş yapınca guest cart kullanıcıya merge edilir
   - Sepet kalıcı (sayfa yenilenince kaybolmaz)

3. SATIN ALMA
   - Checkout'ta iyzico formu açılır
   - Test kartı: 5526080000000006, SKT: 12/26, CVV: 123
   - Başarılı ödeme sonrası sipariş DB'ye kaydedilir
   - /account/orders'da görünür

## Ürün Fotoğrafları — Gereksinim
- Her ürünün kendine özgü gerçekçi fotoğrafı olacak
- Fotoğraflar Cloudinary'e yüklenecek
- Placeholder/stok fotoğraf kullanılmayacak
- Kategoriye göre eşleşme: drone → drone fotoğrafı vb.
- Admin panelinden ürün bazlı fotoğraf yükleme çalışır olacak

## Kategoriler (DB slug'ları)
- drone
- elektronik
- robotik

## Environment Variables
Gerçek değerler .env dosyasında (GitHub'a gitmez).
Şablon için .env.example dosyasına bak.

- DATABASE_URL          ✅ Railway'de tanımlı
- SECRET_KEY            ✅ Tanımlı
- CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET  ✅ Tanımlı
- IYZICO_API_KEY / SECRET_KEY / BASE_URL        ✅ Tanımlı
- FRONTEND_URL          ❌ CORS için Railway'e eklenecek
- NEXT_PUBLIC_API_URL   ❌ Vercel'e eklenecek
- ADMIN_PASSWORD        ❌ Seed script için eklenecek

## Sayfalar

### Müşteri
/ → Ana sayfa
/products → Tüm ürünler
/products/[id] → Ürün detay
/cart → Sepet
/checkout → Ödeme (iyzico)
/login, /register, /forgot-password
/account/orders, /account/profile, /account/addresses
/search, /about, /contact, /faq, /kvkk, /privacy, /terms

### Admin
/admin → Dashboard
/admin/products → Ürün yönetimi (CRUD + CSV/Excel import)
/admin/categories, /admin/orders, /admin/customers
/admin/stock, /admin/campaigns, /admin/reports
/admin/settings, /admin/integrations, /admin/workflows

## Kritik Teknik Notlar
- Backend self-healing: main.py başlangıçta eksik kolonları otomatik ekler
- CORS: localhost:3000 + FRONTEND_URL env variable
- next.config.mjs: ignoreDuringBuilds ve output standalone açık
- iyzico test kartı: 5526080000000006, SKT: 12/26, CVV: 123
- Alembic: lokalde aktif, Railway'de devre dışı — aktif edilecek
- Son 6 commit sadece startup fix: deploy loop'ta takılındı

## Çalışma Yöntemi
- Kagan, Antigravity adlı AI ajanı kullanıyor
- Komutları "Antigravity'e ver" formatında hazırla
- Terminal komutlarını kopyala/yapıştır formatında sun
- Her görev sonunda CLAUDE.md güncellenir ve commit atılır
- Bir görev bitmeden bir sonrakine geçilmez
