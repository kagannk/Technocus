# Technocus — Proje Rehberi

## Geliştirici
- GitHub: kagannk
- Repo: https://github.com/kagannk/Technocus

## Son Güncelleme
- Tarih: Mayıs 2026
- Son odak: Railway + Vercel deploy döngüsü

## Çalışma Kuralı — ÖNEMLİ
Her görev tamamlandığında CLAUDE.md otomatik güncellenir.
Bu sayede Kagan nerede kaldığını takip etmek zorunda kalmaz.
Her promptun sonuna şunu ekle:
  git add CLAUDE.md
  git commit -m "docs: CLAUDE.md güncellendi — [yapılan iş]"
  git push

## Tech Stack

| Katman      | Teknoloji                                              |
|-------------|--------------------------------------------------------|
| Frontend    | Next.js 14, TypeScript, TailwindCSS (port 3000)        |
| Backend     | FastAPI, Python, SQLAlchemy Async, Alembic (port 8000) |
| Veritabanı  | PostgreSQL                                             |
| Container   | Docker Compose (lokal), Railway + Vercel (deploy)      |
| Görsel      | Cloudinary                                             |
| Ödeme       | iyzico sandbox                                         |
| Otomasyon   | n8n (port 5678)                                        |

## Çalıştırma

docker compose up --build   # ilk çalıştırma
docker compose up           # sonraki çalıştırmalar
docker compose down         # durdur

NOT: Docker şu an kapalı. Yapılandırma sağlam, direkt up yapılabilir.

## Mevcut Durum

### ✅ Çalışan / Hazır
- Docker Compose yapılandırması sağlam
- Tüm .env değerleri tanımlı (Cloudinary, iyzico, DB)
- Backend self-healing: main.py eksik kolonları otomatik ekler
- iyzico sandbox entegrasyonu kurulu
- Cloudinary entegrasyonu kurulu
- Admin paneli sayfaları mevcut

### ❌ Kritik Buglar
- Müşteri login/register 401 hatası — ÇÖZÜLMEDEN DEVAM ETMEYİN
- Frontend'de Railway URL hâlâ placeholder (gerçek URL girilmemiş)
- FRONTEND_URL env değişkeni tanımsız

### ⏳ Bekleyen Görevler (öncelik sırasıyla)
1. [AKTİF] Giriş sistemi — admin + test hesabı çalışır hale getirilecek
2. [AKTİF] Sepete ekleme akışı eksiksiz çalışacak
3. [AKTİF] Satın alma akışı (iyzico) uçtan uca çalışacak
4. [AKTİF] Her ürüne ayrı, spesifik Cloudinary fotoğrafı eklenecek
5. Alembic migration'larını Railway'de aktif et
6. Railway deploy (Student Pack aktif)
7. Vercel deploy + FRONTEND_URL env'e ekle
8. n8n workflow'larını kur

## Test Hesapları

### Admin
- URL: http://localhost:3000/admin/login
- Email: admin@technocus.com
- Şifre: .env → ADMIN_PASSWORD

### Müşteri (Test)
- URL: http://localhost:3000/login
- Email: test@technocus.com
- Şifre: Test1234!

Her iki hesap da migration/seed script ile otomatik oluşturulacak.

## Giriş & Satın Alma Akışı — Kritik Gereksinimler

Bu 3 akış eksiksiz çalışmadan başka hiçbir şeye geçilmez:

1. GİRİŞ
   - /login → JWT token alınır → localStorage veya httpOnly cookie'ye yazılır
   - /register → hesap oluşturulur → otomatik login olunur
   - 401 hatası tamamen ortadan kalkar

2. SEPET
   - Giriş yapmadan sepete eklenebilir (guest cart)
   - Giriş yapınca guest cart kullanıcıya merge edilir
   - Sepet kalıcı (sayfa yenilenince kaybolmaz)

3. SATIN ALMA
   - Checkout sayfasında iyzico form açılır
   - Test kartı: 5526080000000006, SKT: 12/26, CVV: 123
   - Başarılı ödeme sonrası sipariş DB'ye kaydedilir
   - /account/orders'da görünür

## Ürün Fotoğrafları — Gereksinim

- Her ürünün kendine özgü, gerçekçi bir fotoğrafı olacak
- Fotoğraflar Cloudinary'e yüklenecek
- Placeholder / stok fotoğraf kullanılmayacak
- Kategoriye göre: drone fotoğrafı drone'a, robot fotoğrafı robota ait olacak
- Admin panelinden ürün bazlı fotoğraf yükleme çalışır olacak

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
- FRONTEND_URL (deploy sonrası Vercel URL'i) ← henüz tanımsız
- ADMIN_PASSWORD

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
- Alembic: lokalde aktif, Railway'de devre dışı (env ile yönetilecek)
- Son 6 commit sadece startup fix içeriyor — deploy loop'ta takıldık

## Çalışma Yöntemi
- Kagan, Antigravity adlı AI ajanı kullanıyor
- Komutları "Antigravity'e ver" formatında hazırla
- Terminal komutlarını kopyala/yapıştır formatında sun
- Her görev sonunda CLAUDE.md güncellenir ve commit atılır
- Bir görev bitmeden bir sonrakine geçilmez
