# PROMPT UNTUK CLAUDE DESIGN — Website Warung Menu MBG

> Copy-paste prompt ini ke Claude (claude.ai atau Claude Code) untuk membangun website.
> Infrastruktur: Next.js · Supabase · Vercel · GitHub

---

## KONTEKS BISNIS

Saya membangun **Warung Menu MBG** — bisnis kuliner komersial berbasis program Makan Bergizi Gratis (MBG) yang menggunakan 80 resep dari **Buku Rasa Bhayangkara Nusantara** (buku resep resmi Polri).

Konsepnya seperti warteg modern — makanan dimasak di **central kitchen**, lalu didistribusikan ke beberapa outlet. Outlet awal:
- **Pasar Santa** (Jakarta Selatan) — 3 unit konter
- **Lippo Mall Nusantara** (Jakarta) — 1 konter

Target: 200 pembeli per outlet per hari. Harga per porsi: Rp 25.000–45.000.

Tagline: **"80 Menu Nusantara. Satu Omprengan."**
Sub-tagline: "Masak di dapur pusat, kirim setiap hari — tiap porsi sudah dihitung gizinya."

---

## IDENTITAS VISUAL BRAND

```
Nama brand   : Warung Menu MBG
Warna utama  : Navy  #1B2753
Warna aksen  : Gold  #C8A227
Warna cream  : #F8F4E8
Font heading : Cormorant Garamond (Google Fonts)
Font body    : Raleway (Google Fonts)
Aesthetic    : Art Deco / Luxury Indonesian Heritage
               — geometric gold lines, navy panels, cream content sections
               — bukan template AI generik, harus terasa premium dan human
Logo         : Lingkaran navy dengan border gold, teks "MBG" tengah + "WARUNG MENU MBG"
```

**Larangan copy (banned words):** revolutionary, seamless, empower, inovatif, solusi holistik, cutting-edge, ekosistem, synergy. Tulis seperti manusia bicara ke manusia — langsung, jelas, real.

---

## INFRASTRUKTUR TEKNIS

```
Framework    : Next.js 14 (App Router)
Database     : Supabase (PostgreSQL)
Storage      : Supabase Storage (untuk foto menu + video cards)
Deploy       : Vercel
Repo         : GitHub
Seed data    : JSON files di /data/ folder
Auth         : Tidak perlu (public website, tanpa login user)
Bahasa       : Bilingual ID/EN — toggle di navbar
```

### Struktur Database Supabase

```sql
-- Tabel menu
CREATE TABLE menus (
  id          SERIAL PRIMARY KEY,
  no          TEXT NOT NULL,           -- '01', '02', dst
  name_id     TEXT NOT NULL,           -- nama menu Bahasa Indonesia
  name_en     TEXT NOT NULL,           -- nama menu English
  region      TEXT NOT NULL,           -- 'Aceh', 'Sumatera Barat', dst
  province    TEXT NOT NULL,           -- 'Aceh', 'Sumatera Barat', dst
  origin      TEXT,                    -- 'Polda Aceh', dst
  desc_id     TEXT,                    -- deskripsi ID
  desc_en     TEXT,                    -- deskripsi EN
  tag         TEXT,                    -- 'ayam' | 'ikan' | 'daging' | 'seafood' | 'vegetarian'
  comp_karbo  TEXT,                    -- komponen karbohidrat
  comp_protein TEXT,                   -- komponen protein
  comp_sayur  TEXT,                    -- komponen sayur
  comp_buah   TEXT,                    -- komponen buah
  nut_energi  TEXT,                    -- 'XXX,X kkal'
  nut_protein TEXT,                    -- 'XX,Xg'
  nut_lemak   TEXT,                    -- 'XX,Xg'
  nut_karbo   TEXT,                    -- 'XX,Xg'
  photo_url   TEXT,                    -- Supabase Storage URL
  video_url   TEXT,                    -- Supabase Storage URL untuk video card MP4
  is_weekly   BOOLEAN DEFAULT false,   -- apakah masuk rotasi menu minggu ini
  is_featured BOOLEAN DEFAULT false,   -- tampil di homepage
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabel outlet
CREATE TABLE outlets (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT,
  area        TEXT,
  city        TEXT DEFAULT 'Jakarta',
  maps_url    TEXT,
  gofood_url  TEXT,
  grabfood_url TEXT,
  is_active   BOOLEAN DEFAULT true
);

-- Tabel catering_inquiries
CREATE TABLE catering_inquiries (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  phone       TEXT,
  email       TEXT,
  event_date  DATE,
  portions    INTEGER,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### JSON Seed Files

Buat file `/data/menus.json` dengan struktur:
```json
[
  {
    "no": "01",
    "name_id": "Ayam Tangkap Khas Aceh",
    "name_en": "Acehnese Fried Herb Chicken",
    "region": "Aceh",
    "province": "Aceh",
    "origin": "Polda Aceh",
    "desc_id": "Ayam goreng khas Aceh dengan daun kari, pandan & salam — gurih rempah, kering sempurna.",
    "desc_en": "Acehnese fried chicken with curry leaves, pandan & bay leaf — crispy, deeply spiced.",
    "tag": "ayam",
    "comp_karbo": "Nasi Putih",
    "comp_protein": "Ayam Tangkap",
    "comp_sayur": "Capcay",
    "comp_buah": "Pisang",
    "nut_energi": "658,6",
    "nut_protein": "19,4g",
    "nut_lemak": "20,1g",
    "nut_karbo": "98,0g",
    "is_featured": true,
    "is_weekly": true
  }
  // ... dst untuk 80 menu
]
```

---

## STRUKTUR HALAMAN (5 Pages)

### 1. HOME (/)

**Section A — Hero**
- Full-screen (100vh), background navy #1B2753
- Foto omprengan steel tray sebagai hero image (overlay gelap navy 40%)
- Art Deco geometric SVG decoration: gold lines, fan shapes di sudut
- Heading besar serif: "80 Menu Nusantara." (gold) + "Satu Omprengan." (white)
- Sub: "Tiap porsi sudah dihitung gizinya. Masak di dapur pusat, kirim setiap hari."
- 2 CTA buttons: [Lihat Menu] (gold, solid) + [Pesan Catering] (outline gold)

**Section B — Brand numbers strip**
- Background navy, horizontal row dengan 3 angka besar:
  - **80** Menu Nusantara
  - **2** Outlet Jakarta
  - **200+** Porsi / Hari
- Gold separator lines antar angka

**Section C — 3 Menu Unggulan**
- Heading: "Menu Pilihan Minggu Ini"
- 3 cards menu dari `is_featured = true`
- Setiap card: foto menu, nomor menu (gold), nama, asal daerah, badge kalori
- Hover: expand dengan deskripsi singkat + tombol "Lihat Detail"

**Section D — Marquee daerah asal**
- Strip scrolling horizontal, background cream, gold text:
  `ACEH · SUMATERA BARAT · BENGKULU · RIAU · JAMBI · JAWA BARAT · YOGYAKARTA · JAWA TIMUR · BALI · SULAWESI SELATAN · MALUKU · PAPUA ·`

**Section E — Lokasi Outlet**
- 2 cards lokasi: Pasar Santa + Lippo Mall Nusantara
- Setiap card: nama, alamat, jam buka, tombol GoFood + GrabFood
- Background navy dengan border gold

**Section F — CTA Catering**
- Banner wide, background gold texture, text navy:
  "Butuh makan siang buat tim? Kami antar dalam omprengan."
- Tombol: [Hubungi Kami] → link ke WA

---

### 2. MENU (/menu)

**Filter & Search Bar**
- Search input realtime (query Supabase)
- Filter chips: Semua | Ayam | Ikan | Daging | Seafood | Vegetarian
- Filter provinsi: dropdown select (34 provinsi)
- Badge count: "Menampilkan 80 menu"

**Grid Menu Cards**
- Layout: 4 kolom desktop, 2 kolom tablet, 1 kolom mobile
- Setiap card:
  - Foto menu (dari Supabase Storage, fallback: gradient navy)
  - Badge kecil atas-kiri: nomor menu (gold background)
  - Badge kecil atas-kanan: "Menu Minggu Ini" (jika `is_weekly = true`)
  - Nama menu (serif, bold)
  - Asal daerah (kecil, muted)
  - Tag protein (chip: ayam/ikan/daging/seafood)
  - Kalori (bold, gold)

**Modal Detail Menu** (buka saat card diklik)
- Full info menu: foto besar, nama, deskripsi, asal daerah
- Komponen menu dalam 4 chip: 🍚 Karbo | 🥩 Protein | 🥦 Sayur | 🍊 Buah
- Tabel gizi 4 kolom: Energi | Protein | Lemak | Karbohidrat
- Tombol: [Tutup] + [Lihat Video Card]

**Rotasi Menu**
- Banner kecil di atas grid: "Menu minggu ini: 10 dari 80 menu tersedia di outlet"
- Filter cepat: [Tampilkan Menu Minggu Ini]

---

### 3. VIDEO (/video)

**Gallery Portrait Videos**
- Grid 3 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- Setiap item: video portrait 9:16, thumbnail dari frame pertama
- Autoplay (muted) saat hover, pause saat mouse keluar
- Overlay info: nomor menu + nama menu
- Tombol: [Download] + [Share]

**Video dari Supabase Storage**
- Nama file: `MBG-Menu-01-AyamTangkap.mp4`, dst
- Ambil URL dari field `video_url` di tabel menus

**Info section**
- "Video ini dibuat untuk konten media sosial Warung Menu MBG"
- Link ke Instagram / TikTok

---

### 4. CATERING (/catering)

**Section A — Hero Catering**
- Background cream, foto omprengan steel tray dari atas
- Heading: "Makan siang kantor. Dalam omprengan."
- Sub: "Dipesan hari ini, dikirim besok pagi. Minimum 10 porsi."

**Section B — Paket Catering**
- Tabel 3 paket:

| Paket | Porsi | Harga/porsi | Bonus |
|-------|-------|-------------|-------|
| Harian | 10–50 | Rp 35.000 | Omprengan pinjam gratis |
| Mingguan | 50–200 | Rp 32.000 | Variasi 5 menu/minggu |
| Event | >200 | Rp 29.000 | Setup prasmanan + SDM |

**Section C — How it works**
- 4 langkah dengan ikon:
  1. Pilih menu & tanggal → 2. Konfirmasi WA → 3. Transfer / QRIS → 4. Dikirim dalam omprengan

**Section D — Order Buttons**
- 2 tombol besar: [Pesan via GoFood] (green) + [Pesan via GrabFood] (green)
- Di bawah: atau scan QRIS
- QR Code placeholder (static image, bisa diupdate)

**Section E — Form Catering Inquiry**
- Form: Nama, Nomor HP, Tanggal event, Jumlah porsi, Catatan menu
- Submit → simpan ke tabel `catering_inquiries` di Supabase
- Konfirmasi: "Kami akan hubungi Anda dalam 2 jam via WhatsApp"

---

### 5. TENTANG (/tentang)

**Section A — Cerita Brand**
- Heading: "Dari dapur polisi, ke meja makan Anda."
- Teks: cerita asal-usul program MBG, buku resep Bhayangkara Nusantara, dan kenapa Warung Menu MBG lahir
- Foto: cover buku resep (navy-biru, gold)

**Section B — Central Kitchen Model**
- Diagram sederhana: [Central Kitchen] → [Pasar Santa] + [Lippo Mall] + [Coming Soon ×3]
- "Satu dapur. Lima outlet. Kualitas sama dari batch yang sama."

**Section C — Standar Gizi**
- Penjelasan singkat: setiap porsi memenuhi standar kalori MBG (±600–800 kkal)
- 4 icon: Energi seimbang | Protein cukup | Sayur ada | Buah ada
- "Data gizi diambil langsung dari Buku Rasa Bhayangkara Nusantara"

**Section D — Merch**
- 3 produk:
  1. **Omprengan Steel MBG** — steel sheet food tray + logo MBG engraved — Rp 150.000
  2. **Buku Rasa Bhayangkara Nusantara** — edisi komersial — Rp 250.000
  3. **Tote Bag MBG** — canvas navy + gold print — Rp 75.000
- Tombol: [Hubungi untuk Pemesanan] → WA

**Section E — Kontak**
- Email, Instagram, TikTok, WhatsApp Business
- Alamat central kitchen (bila sudah fix)

---

## KOMPONEN GLOBAL

### Navbar
- Fixed top, background navy #1B2753 dengan slight blur
- Logo kiri: lingkaran gold + teks "WARUNG MENU MBG" (Cormorant Garamond, gold, letter-spacing lebar)
- Links: Home · Menu · Video · Catering · Tentang
- Kanan: toggle bahasa [ID / EN] + tombol CTA "ORDER" (gold pill)
- Mobile: hamburger menu

### Footer
- Background navy dark #111A3A
- 3 kolom: Logo + tagline | Navigasi | Kontak + sosmed
- Bottom strip: "© 2025 Warung Menu MBG · Resep dari Buku Rasa Bhayangkara Nusantara"
- Gold geometric divider line

### Art Deco Elements (reusable)
- Gold horizontal line divider: `<div class="gold-divider">` — 1px solid #C8A227, lebar penuh
- Fan shape SVG di sudut section (dekorasi, tidak interaktif)
- Section header dengan roman numerals: "I. MENU · II. VIDEO · III. CATERING"

---

## DESIGN RULES

```
DO:
✓ Warna hanya navy + gold + cream + white (tidak ada warna lain)
✓ Heading: Cormorant Garamond — elegant, serif, berat 400/600
✓ Body: Raleway — clean geometric sans
✓ Angka menu ditulis dengan leading zero: 01, 02, ... 80
✓ Asal daerah selalu ditulis dengan huruf kapital: ACEH, BALI, dll
✓ Foto menu menggunakan aspect ratio 4:3 (landscape) atau 1:1 (square)
✓ Video card menggunakan aspect ratio 9:16 (portrait)
✓ Setiap section punya padding vertikal minimum 80px

DON'T:
✗ Jangan pakai warna selain palette di atas
✗ Jangan pakai Inter, Roboto, atau Space Grotesk sebagai heading font
✗ Jangan tulis copy AI: "inovatif", "seamless", "solusi", "ekosistem"
✗ Jangan pakai template card yang terlihat generik
✗ Jangan pakai drop shadow berlebihan — max 1 shadow layer
```

---

## FILE STRUCTURE (Next.js App Router)

```
warung-mbg/
├── app/
│   ├── layout.tsx           # Root layout + navbar + footer
│   ├── page.tsx             # Home
│   ├── menu/
│   │   └── page.tsx         # Menu gallery + filter
│   ├── video/
│   │   └── page.tsx         # Video gallery
│   ├── catering/
│   │   └── page.tsx         # Catering + order
│   └── tentang/
│       └── page.tsx         # About
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MenuCard.tsx
│   ├── MenuModal.tsx
│   ├── VideoCard.tsx
│   ├── OutletCard.tsx
│   ├── ArtDecoElements.tsx  # Reusable SVG decorations
│   └── LanguageToggle.tsx
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── i18n.ts              # Bilingual strings
├── data/
│   ├── menus.json           # 80 menu seed data
│   └── outlets.json         # Outlet data
├── public/
│   └── images/              # Logo, placeholder photos
└── styles/
    └── globals.css          # Design tokens + base styles
```

---

## ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOFOOD_URL=https://gofood.co.id/...
NEXT_PUBLIC_GRABFOOD_URL=https://food.grab.com/...
NEXT_PUBLIC_WA_NUMBER=628xxxxxxxxxx
```

---

## FITUR PRIORITY ORDER

Build dalam urutan ini:

1. **Navbar + Footer + Design tokens** (semua halaman butuh ini)
2. **Database schema** — setup Supabase tables + seed dari JSON
3. **Halaman Menu** — ini halaman terpenting, most traffic
4. **Halaman Home** — hero + featured menu + outlet cards
5. **Halaman Catering** — form inquiry + order buttons
6. **Halaman Video** — gallery video cards
7. **Halaman Tentang** — static content
8. **Bilingual toggle** — ID/EN switch
9. **QA + Deploy ke Vercel**

---

## CATATAN KHUSUS

- **Foto menu**: sementara gunakan gradient navy sebagai placeholder. URL foto akan diupdate dari Supabase Storage setelah foto masuk.
- **Video cards**: 2 video sudah ada (`MBG-Menu-01-AyamTangkap.mp4` dan `MBG-Menu-13-RendangSapi.mp4`). Upload ke Supabase Storage bucket `menu-videos`.
- **QRIS**: gunakan placeholder QR code image. File final QR akan diberikan setelah rekening bisnis aktif.
- **80 menu**: data JSON lengkap akan diberikan terpisah. Untuk development, gunakan 5–10 menu sample dulu.
- **GoFood/GrabFood**: URL deeplink akan diberikan setelah toko terdaftar. Sementara gunakan placeholder button.
- **Domain**: belum ada. Deploy ke `warung-mbg.vercel.app` dulu.
