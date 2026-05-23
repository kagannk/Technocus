# Technocus — Proje Rehberi

## Geliştirici
- GitHub: kagannk
- Repo: https://github.com/kagannk/Technocus

## Son Güncelleme
- Tarih: 23 Mayıs 2026
- Son odak: CORS + API bağlantısı + seed users + 401 fix

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

| Servis     | Platform | URL                                               | Durum    |
|------------|----------|----------------------------------------------------|----------|
| Frontend   | Vercel   | https://technocus.vercel.app                       | ✅ Canlı |
| Backend    | Railway  | https://technocus-production.up.railway.app        | ✅ Canlı |
| Database   | Railway  | (Railway internal)                                 | ✅ Canlı |

### Kritik Bağlantı Notları
- Frontend (Vercel) → Backend (Railway): NEXT_PUBLIC_API_URL = https://technocus-production.up.railway.app
- CORS ayarlandı: localhost:3000, technocus.vercel.app, Railway URL, FRONTEND_URL env
- Alembic: lokalde aktif, Railway'de CMD ile çalışıyor
- SSR API URL düzeltildi: api.ts artık tek NEXT_PUBLIC_API_URL kullanıyor

### ❗ Vercel'de Yapılması Gereken (Manuel)
Vercel Dashboard → Settings → Environment Variables:
- NEXT_PUBLIC_API_URL = https://technocus-production.up.railway.app

### ❗ Railway'de Yapılması Gereken (Manuel)
Railway Dashboard → Variables:
- FRONTEND_URL = https://technocus.vercel.app

## Çalıştırma (Lokal)

docker compose up --build   # ilk çalıştırma
docker compose up           # sonraki çalıştırmalar
docker compose down         # durdur

## Mevcut Durum

### ✅ Tamamlanan Görevler
- CORS ayarı: localhost:3000, Vercel URL, Railway URL hepsi eklendi
- API bağlantısı: api.ts SSR/client ayrımı kaldırıldı, NEXT_PUBLIC_API_URL kullanılıyor
- Seed users: admin@technocus.com + test@technocus.com startup'ta otomatik oluşturuluyor
- 401 analizi: Backend login çalışıyor (form-data ile), frontend doğru gönderiyor
- Register endpoint çalışıyor (test@test.com başarıyla oluşturuldu)
- Health endpoint çalışıyor
- Giriş sistemi ✅ Tamamlandı

### ⚠️ Kullanıcının Yapması Gereken
- Vercel'e NEXT_PUBLIC_API_URL env variable eklenecek (yukarıya bak)
- Railway'e FRONTEND_URL env variable eklenecek (yukarıya bak)
- Her iki platformda redeploy tetiklenecek

### ⏳ Bekleyen Görevler (öncelik sırasıyla)
1. [AKTİF] Sepete ekleme akışı eksiksiz çalışacak
2. [BEKLEYEN] Satın alma akışı (iyzico) uçtan uca çalışacak
3. [BEKLEYEN] Her ürüne ayrı Cloudinary fotoğrafı eklenecek
4. n8n workflow'ları kurulacak

## Test Hesapları

### Admin
- URL: /admin/login
- Email: admin@technocus.com
- Şifre: Admin1234!
- Startup'ta otomatik oluşturuluyor/güncelleniyor

### Müşteri (Test)
- URL: /login
- Email: test@technocus.com
- Şifre: Test1234!
- Startup'ta otomatik oluşturuluyor/güncelleniyor

## Giriş & Satın Alma Akışı — Kritik Gereksinimler

Bu 3 akış eksiksiz çalışmadan başka hiçbir şeye geçilmez:

1. GİRİŞ
   - /login → JWT token alınır → localStorage'a yazılır
   - /register → hesap oluşturulur → otomatik login olunur
   - Backend OAuth2PasswordRequestForm kullanıyor = form-data (username+password)
   - Frontend doğru gönderiyor: URLSearchParams ile form-urlencoded

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
- CLOUDINARY_*          ✅ Tanımlı
- IYZICO_*              ✅ Tanımlı (sandbox)
- FRONTEND_URL          ❌ Railway'e eklenecek = https://technocus.vercel.app
- NEXT_PUBLIC_API_URL   ❌ Vercel'e eklenecek = https://technocus-production.up.railway.app

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

## Teknik Mimari Notları
- Backend self-healing: main.py başlangıçta eksik kolonları otomatik ekler
- CORS: localhost:3000 + technocus.vercel.app + Railway URL + FRONTEND_URL env
- api.ts: NEXT_PUBLIC_API_URL kullanıyor (SSR/client fark etmez)
- Auth: localStorage token + Bearer header (apiFetch otomatik ekler)
- Auth state: Merkezi store YOK, her component localStorage'dan okur
- iyzico test kartı: 5526080000000006, SKT: 12/26, CVV: 123

## Çalışma Yöntemi
- Kagan, Antigravity adlı AI ajanı kullanıyor
- Komutları "Antigravity'e ver" formatında hazırla
- Terminal komutlarını kopyala/yapıştır formatında sun
- Her görev sonunda CLAUDE.md güncellenir ve commit atılır
- Bir görev bitmeden bir sonrakine geçilmez
