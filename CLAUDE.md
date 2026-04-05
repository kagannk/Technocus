# Technocus — Proje Rehberi

## Geliştirici
- GitHub: kagannk
- Repo: https://github.com/kagannk/Technocus

## Tech Stack
| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 14, TypeScript, TailwindCSS (port 3000) |
| Backend | FastAPI, Python, SQLAlchemy Async, Alembic (port 8000) |
| Veritabanı | PostgreSQL |
| Container | Docker Compose (lokal), Railway + Vercel (deploy) |
| Görsel | Cloudinary |
| Ödeme | iyzico sandbox |
| Otomasyon | n8n (port 5678) |

## Çalıştırma
docker compose up --build   # ilk çalıştırma
docker compose up           # sonraki çalıştırmalar
docker compose down         # durdur

## Admin Paneli
URL: http://localhost:3000/admin/login
Credentials: .env dosyasına bak

## Kategoriler (DB slug'ları)
- drone
- elektronik
- robotik

## Environment Variables
Gerçek değerler .env dosyasında (GitHub'a gitmez).
Şablon için .env.example dosyasına bak.

Gerekli değişkenler:
- DATABASE_URL
- SECRET_KEY
- CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
- IYZICO_API_KEY / SECRET_KEY / BASE_URL
- FRONTEND_URL (deploy sonrası Vercel URL'i)

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

## Bekleyen Görevler
- [ ] Railway deploy (Student Pack aktif olunca)
- [ ] Vercel deploy
- [ ] iyzico ödeme akışı testi
- [ ] n8n workflow kurulumu
- [ ] Müşteri login/register 401 sorunu

## Çalışma Yöntemi
Kagan, Antigravity adlı AI ajanı kullanıyor.
Komutları "Antigravity'e ver" formatında hazırla.
