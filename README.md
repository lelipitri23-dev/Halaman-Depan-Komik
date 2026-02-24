# KomikVerse — Frontend Next.js

Frontend website baca komik manga, manhwa, manhua. Dibangun dengan **Next.js 14 App Router**, **Tailwind CSS**, SEO-optimized, dan tampilan mobile seperti aplikasi.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Buat file environment
cp .env.example .env.local

# 3. Edit .env.local, isi URL API backend kamu:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_SITE_URL=https://komikverse.com

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Proyek

```
komik-app/
├── app/
│   ├── layout.jsx              # Root layout + SEO metadata global
│   ├── page.jsx                # 🏠 Home page (recent, trending, dll)
│   ├── globals.css             # Global styles + Tailwind
│   ├── not-found.jsx           # 404 page
│   ├── sitemap.js              # ✅ Sitemap dinamis (auto-generate)
│   ├── robots.js               # ✅ robots.txt
│   ├── manga/
│   │   ├── page.jsx            # 🔍 Browse + Filter + Search
│   │   └── [slug]/page.jsx     # 📖 Detail manga + daftar chapter
│   ├── read/
│   │   └── [slug]/[chapterSlug]/page.jsx  # 📱 Chapter reader
│   └── genres/
│       └── page.jsx            # 🏷️ Daftar genre
├── components/
│   ├── Navbar.jsx              # Top bar + Bottom nav + Search modal
│   ├── MangaCard.jsx           # Card komik reusable
│   ├── MangaSection.jsx        # Section horizontal scroll + grid
│   └── TrendingSlider.jsx      # Auto-sliding hero trending
├── lib/
│   └── api.js                  # API helper functions
└── public/
    └── manifest.json           # PWA manifest
```

---

## 🗺️ Route Mapping (API → Frontend)

| API Endpoint | Frontend Page |
|---|---|
| `GET /api/home` | `/` (Home) |
| `GET /api/manga` | `/manga` (Browse) |
| `GET /api/manga/:slug` | `/manga/[slug]` (Detail) |
| `GET /api/read/:slug/:chapterSlug` | `/read/[slug]/[chapterSlug]` (Reader) |
| `GET /api/genres` | `/genres` (Genre list) |

---

## ✨ Fitur

### SEO
- **Metadata dinamis** per halaman (title, description, OG tags)
- **Sitemap.xml dinamis** — auto-generate dari semua manga di database
- **robots.txt** — blokir AI crawler, izinkan Google
- **JSON-LD structured data** untuk Website & Book schema
- **Canonical URLs** setiap halaman
- **PWA manifest** — bisa "Add to Home Screen"

### Mobile UX
- **Bottom navigation bar** (Home, Cari, Genre)
- **Horizontal scroll** untuk setiap section
- **Auto-hide UI** saat membaca chapter (tap untuk tampilkan)
- **Progress bar** baca chapter real-time
- **Prev/Next chapter** navigation
- **Pull-to-refresh ready**

### Performance
- **Next.js ISR** (Incremental Static Regeneration)
- **Image optimization** dengan next/image
- **Lazy loading** gambar chapter
- **Revalidation** tiap 5 menit untuk halaman dinamis

---

## ⚙️ Environment Variables

| Variable | Deskripsi | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL API backend | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SITE_URL` | URL website live | `https://komikverse.com` |
| `GOOGLE_SITE_VERIFICATION` | Kode verifikasi Google Search Console | — |

---

## 🏗️ Build & Deploy

```bash
# Build production
npm run build

# Start production server
npm start
```

### Deploy ke Vercel (Recommended)
1. Push ke GitHub
2. Import di vercel.com
3. Set environment variables di Settings → Environment Variables
4. Deploy!

---

## 🎨 Kustomisasi

### Ganti nama site
Edit di `app/layout.jsx`:
```js
const SITE_NAME = 'NamaSitemu';
```

### Ganti warna aksen
Edit `tailwind.config.js` bagian `colors.accent`:
```js
accent: {
  red: '#e63946',     // ← ganti warna utama
}
```

### Tambah/kurangi filter
Edit array `TYPES`, `STATUSES`, `ORDERS` di `app/manga/page.jsx`
