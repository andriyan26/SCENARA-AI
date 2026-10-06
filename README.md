# 🎬 SCENARA AI — AI-Powered Filmmaking & Video Creation Studio

> **"From Script to Screen."**  
> Platform pembuatan film dan video sinematik otonom berbasis kecerdasan buatan (AI) yang mengubah ide, naskah, atau narasi sederhana menjadi karya film visual berkualitas tinggi secara menyeluruh.

---

## 🌟 Tentang SCENARA AI

**SCENARA AI** adalah platform SaaS *autonomous filmmaking* mutakhir yang dirancang khusus untuk kreator konten, filmmaker independen, pendidik, dan agensi kreatif. Tidak seperti generator teks-ke-video sederhana, SCENARA AI bertindak layaknya **Studio Kreatif Lengkap** dengan **AI Director** yang mengorkestrasi seluruh alur produksi:

```
💡 IDE / PROMPT 
   └── 🎬 AI DIRECTOR 
       └── 📝 SCREENPLAY (3-ACT FORMAT)
           └── 🎨 STORYBOARD & VISUAL GENERATION
               └── 👤 CHARACTER CONSISTENCY
                   └── 🎙️ VOICE ACTING & AUDIO SCORING
                       └── 🎞️ MULTI-TRACK TIMELINE EDITOR
                           └── ⚙️ FFMPEG MASTER RENDER 
                               └── 🚀 FINAL EXPORT (1080P/4K)
```

---

## ✨ Fitur-Fitur Utama

1. **AI Director & Autonomous Creative Pipeline**
   - Mengubah satu premis cerita menjadi naskah standar industri 3 babak (*Act I: Setup*, *Act II: Confrontation*, *Act III: Resolution*).
   - Memecah naskah menjadi adegan terperinci (*scene breakdown*) lengkap dengan sudut kamera, gerakan lensa, pencahayaan, dialog, dan narasi.

2. **Konsistensi Karakter (Character Consistency Engine)**
   - Menjaga konsistensi identitas visual aktor (*face structure, wardrobe, demeanor*) di setiap adegan menggunakan acuan profil karakter terpadu.

3. **Storyboard Sinematik & Keyframe Generator**
   - Menghasilkan konsep seni (*concept art*) resolusi tinggi untuk setiap adegan sebelum proses *render* akhir.

4. **Multi-Track Audio & Voice Acting Studio**
   - Mendukung sintesis suara karakter yang ekspresif, efek suara (*SFX*), musik tema sinematik latar belakang, dan lapisan *ambient sound*.

5. **Mesin Render Video FFmpeg (High Performance)**
   - Pemrosesan video lokal berkecepatan tinggi dengan integrasi `@ffmpeg-installer/ffmpeg` dan `fluent-ffmpeg` untuk *video stitching*, *audio leveling*, serta ekspor master video berkualitas tinggi.

6. **Dual Mode AI (Mock Local & Live Cloud API)**
   - **Mode Mock (Bawaan)**: Berfungsi 100% secara lokal tanpa memerlukan API Key berbayar, ideal untuk pengembangan, demonstrasi, dan pengujian cepat.
   - **Mode Live**: Terkoneksi dengan Google Gemini, Google Veo, Runway Gen-3, dan ElevenLabs untuk pemrosesan produksi tingkat lanjut.

7. **Pro Studio Theme & Antarmuka Responsif**
   - Desain gelap berstandar sinematik (*Cinematic Studio Dark Palette*) dengan aksen *Neon Cyan*, *Amber Gold*, dan *Royal Purple*.
   - Responsive di desktop (3-column pro editor workspace) dan mobile (bottom navigation bar).

---

## 🏆 Proyek Unggulan Bawaan: *"THE LAST CHANCE"*

SCENARA AI hadir dengan proyek demonstrasi lengkap berdurasi **120 Detik (2 Menit)** berjudul **"THE LAST CHANCE"** yang sudah tersinkronisasi di database:

- **Protagonis**: *Andrian Pratama* (24 tahun, lulusan baru di Jakarta dengan tekad pantang menyerah).
- **Rincian 8 Adegan Sinematik (Total 120 Detik)**:
  1. `SC 01: The Silent Dawn` (8 detik) — Renungan saat fajar di kosan sederhana setelah rentetan penolakan kerja.
  2. `SC 02: The Concrete Sea` (12 detik) — Melangkah tegap menembus hiruk-pikuk Jalan Sudirman, Jakarta.
  3. `SC 03: The Glass Corridor` (15 detik) — Menunggu panggilan wawancara di lobi megah gedung pencakar langit.
  4. `SC 04: The Boardroom Trial` (15 detik) — Menjawab pertanyaan tajam para direksi dengan penuh keyakinan.
  5. `SC 05: The Rainy Overpass` (18 detik) — Menatap guyuran hujan Jakarta di jembatan penyeberangan dengan harapan baru.
  6. `SC 06: The Midnight Forge` (16 detik) — Merancang ide inovatif di kedai kopi hingga larut malam.
  7. `SC 07: The Breakthrough` (18 detik) — Presentasi sukses dan jabat tangan persetujuan dengan para eksekutif.
  8. `SC 08: The Golden Call` (18 detik) — Menelepon sang ibu dengan air mata bahagia saat matahari terbenam.

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

### Antarmuka Pengguna (Frontend - `client/`)
- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS (Kustomisasi tema studio sinematik)
- **Ikon**: Lucide React
- **HTTP Client**: Axios / Fetch API

### Server Backend (Backend - `server/`)
- **Runtime**: Node.js + Express.js + TypeScript (`tsx`)
- **Database**: MySQL 8.0 (Menggunakan *connection pool* `mysql2/promise`)
- **Video & Audio Engine**: `fluent-ffmpeg` & `@ffmpeg-installer/ffmpeg`
- **Keamanan**: JWT Authentication, Hashing Sandi Bcrypt, CORS, Sanitasi Input

---

## 📁 Struktur Direktori Proyek

```text
SCENARA AI/
├── client/                     # Aplikasi Frontend (React + Vite + Tailwind)
│   ├── public/                 # Aset publik statis
│   ├── src/
│   │   ├── components/         # Komponen UI (Timeline, Player, Sidebar, dll)
│   │   ├── pages/              # Halaman aplikasi (Dashboard, Studio, Export, dll)
│   │   ├── services/           # Komunikasi API ke backend
│   │   └── App.tsx             # Entry point komponen React
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Backend API & Media Processing Engine
│   ├── src/
│   │   ├── database/           # Skema MySQL, koneksi, & script inisialisasi
│   │   ├── routes/             # REST API endpoint (proyek, naskah, adegan, dll)
│   │   ├── video/              # Layanan FFmpeg video rendering & concatenator
│   │   └── utils/              # Generator audio, media migration, sync media
│   ├── storage/                # Media lokal (karakter, storyboard, audio, video)
│   │   ├── audio/              # File WAV/MP3 efek suara dan musik tema
│   │   ├── characters/         # Foto referensi karakter utama
│   │   ├── storyboards/        # Gambar keyframe adegan 1-8
│   │   └── videos/             # Video potongan adegan & hasil master render
│   ├── .env.example            # Contoh konfigurasi environment
│   └── package.json
├── package.json                # Root package runner (concurrently)
├── SCENARA_STUDIO_GUIDE.md     # Panduan arsitektur sistem teknis
└── README.md                   # Dokumentasi lengkap proyek (Bahasa Indonesia)
```

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terinstal:
- **Node.js** versi 18 ke atas
- **NPM** atau **Yarn**
- **MySQL Server** (bisa menggunakan **Laragon**, **XAMPP**, atau MySQL Standalone)
- **Git**

### 2. Kloning Repository
```bash
git clone https://github.com/andriyan26/SCENARA-AI.git
cd SCENARA-AI
```

### 3. Instalasi Dependensi
Jalankan perintah ini di root folder untuk menginstal seluruh dependensi (root, server, dan client):
```bash
npm run install:all
```
*Atau lakukan instalasi secara manual:*
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 4. Konfigurasi Environment (`.env`)
Salin file `.env.example` di folder `server/` menjadi `.env`:
```bash
cd server
copy .env.example .env   # Di Windows Command Prompt / PowerShell
# atau: cp .env.example .env (Linux/macOS)
```

Buka file `server/.env` dan sesuaikan koneksi database MySQL Anda:
```env
PORT=5000
NODE_ENV=development
AI_MODE=mock
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=scenara_ai
JWT_SECRET=scenara_super_secret_jwt_key_2026_cinematic_studio
STORAGE_PATH=./storage
APP_URL=http://localhost:5000
```

### 5. Inisialisasi Database MySQL
Pastikan MySQL service di Laragon / XAMPP sudah berjalan, lalu inisialisasi tabel dan data awal dengan perintah:
```bash
npm run db:init
```
Perintah ini akan secara otomatis:
- Membuat database `scenara_ai` jika belum ada.
- Mengeksekusi seluruh 14 tabel relasional.
- Mengisi data *seed* proyek unggulan *"THE LAST CHANCE"* lengkap dengan 8 adegan.

### 6. Menjalankan Aplikasi
Cukup jalankan satu perintah dari root folder:
```bash
npm run dev
```
Perintah ini akan menyalakan server backend dan client secara bersamaan (*concurrently*):
- 🌐 **Frontend (Client)**: `http://localhost:5173`
- ⚙️ **Backend (API Server)**: `http://localhost:5000`

---

## 🗄️ Skema Database Relasional (MySQL)

SCENARA AI menggunakan 14 tabel relasional terstruktur:
1. `users` — Akun pengguna, level paket, dan kuota kredit.
2. `projects` — Entitas proyek film utama, durasi target, rasio aspek (16:9, 9:16, 2.39:1).
3. `project_settings` — Arahan teknis visual, pergerakan kamera, palet warna, dan gaya audio.
4. `scripts` — Naskah skenario format industri 3-babak.
5. `characters` — Profil visual, referensi wajah, usia, dan penugasan aktor suara.
6. `scenes` — Pemecahan nomor adegan, durasi detik, sudut kamera, narasi, dan dialog.
7. `scene_versions` — Riwayat iterasi render adegan (v1, v2, v3).
8. `storyboards` — Gambar keyframe dan *concept art* per adegan.
9. `voices` — Pustaka suara aktor dengan karakteristik gender dan gaya bahasa.
10. `audio_assets` — Batang audio terpisah (*stem tracks*: Voice, SFX, Score, Ambience).
11. `assets` — Manajemen media statis yang diunggah pengguna.
12. `generation_jobs` — Antrean tugas render AI asinkronus dan pelacakan progres.
13. `exports` — Berkas master render video final (resolusi 1080p/4K).
14. `ai_usage` — Buku besar pencatatan penggunaan token dan estimasi biaya AI.

---

## 📜 Lisensi & Pengembang

Dikembangkan dengan dedikasi untuk memajukan industri kreatif dan perfilman digital.  
Repository Resmi: [https://github.com/andriyan26/SCENARA-AI](https://github.com/andriyan26/SCENARA-AI)

© 2026 **SCENARA AI**. Seluruh hak cipta dilindungi.
