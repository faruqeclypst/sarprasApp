# Sistem Inventaris Sarana Prasarana Sekolah

Aplikasi dashboard modern berbasis **React + Vite + TypeScript** dengan styling **Tailwind CSS** dan komponen **shadcn/ui** untuk mengelola data inventaris sarana prasarana sekolah. Data tersinkronisasi real-time menggunakan **Firebase Realtime Database**, sementara berkas media didesain untuk diunggah ke **Cloudflare R2 (kompatibel S3)** melalui mekanisme pre-signed URL.

## Fitur Utama

- 💼 **Manajemen Barang** – catat detail barang (kode, nama, merk, spesifikasi, jumlah, harga, sumber dana, ruang, foto, kondisi).
- 🏫 **Manajemen Ruang** – simpan kondisi dan dokumentasi ruang (nama ruang, kode gedung, foto, kondisi, keterangan).
- 🌱 **Manajemen Tanah** – rekam data aset tanah (lokasi, kode, luas, tahun perolehan, alamat, sertifikat, asal, harga, keterangan).
- 🔄 **Manajemen Peminjaman** – monitor proses peminjaman barang (tanggal pinjam/kembali, peminjam, foto, keterangan) dengan status otomatis.
- 📊 **Dashboard Realtime** – statistik modern dengan animasi Framer Motion, pencarian global, dan ringkasan sebaran aset.
- 🧩 **Komponen Reusable** – komponen formulir, kartu statistik, dan tabel menggunakan shadcn/ui untuk memudahkan pengembangan lanjutan.
- 🔐 **Autentikasi Aman** – login username + password dan Google Sign-In menggunakan Firebase Authentication.

## Struktur Proyek

```
├── src
│   ├── components
│   │   ├── dashboard      # Komponen ringkasan dan visualisasi
│   │   ├── forms          # Form reusable berbasis react-hook-form + zod
│   │   ├── layout         # Sidebar, top navigation, loading state
│   │   ├── tables         # Tabel data barang, ruang, tanah, peminjaman
│   │   └── ui             # Komponen shadcn/ui (button, card, dialog, dll)
│   ├── context            # InventoryContext untuk komunikasi Firebase
│   ├── lib                # Firebase init & helper upload R2
│   ├── pages              # Halaman dashboard & modul master data
│   ├── styles             # Konfigurasi Tailwind global
│   └── types              # Definisi tipe TypeScript
├── public                 # (opsional) aset statis
├── index.html
└── package.json
```

## Persiapan Lingkungan

### 1. Instalasi Dependensi

```bash
npm install
```

> Catatan: jika repository dijalankan di lingkungan tanpa akses langsung ke registry npm, gunakan mirror internal atau siapkan cache dependensi terlebih dahulu.

### 2. Variabel Lingkungan

Buat berkas `.env` di root proyek dengan konfigurasi Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_AUTH_USERNAME_DOMAIN=inventory.local
VITE_R2_SIGNER_URL=https://<api-backend>/presign
```

Konfigurasi Cloudflare R2 dilakukan melalui endpoint backend yang menghasilkan *pre-signed URL* lalu dipanggil menggunakan helper `uploadFileToR2`.

### 3. Menjalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173` secara default.

### 4. Build Produksi

```bash
npm run build
```

Hasil build akan berada di folder `dist/`. Gunakan `npm run preview` untuk melakukan pratinjau build.

## Integrasi Firebase Realtime Database

- Seluruh data tersimpan pada path `inventory/{items|rooms|lands|loans}`.
- `InventoryProvider` melakukan *subscription* real-time dengan `onValue` sehingga seluruh halaman otomatis memperbarui data tanpa refresh.
- Fungsi CRUD (`createItem`, `updateItem`, dll.) siap dihubungkan dengan mekanisme autentikasi tambahan bila diperlukan.

## Integrasi Cloudflare R2

Helper `uploadFileToR2` menerima berkas dan pre-signed URL (POST/PUT) sehingga frontend tetap aman tanpa menyimpan kredensial R2. Implementasikan endpoint backend yang mengembalikan struktur berikut:

```json
{
  "url": "https://<account-id>.r2.cloudflarestorage.com/<bucket>/<object>?signature=...",
  "fields": {
    "key": "uploads/uuid-file.png",
    "policy": "..."
  }
}
```

Kemudian panggil helper tersebut sebelum menyimpan URL file ke database.

### Otorisasi & Login

- **Username & Password** – masukkan username (misal `operator`) yang otomatis dikonversi menjadi email internal
  (`operator@<VITE_AUTH_USERNAME_DOMAIN>`) sebelum diproses oleh Firebase Authentication.
- **Google Sign-In** – tersedia tombol khusus untuk autentikasi cepat menggunakan akun Google.
- **Proteksi Dashboard** – seluruh halaman di dalam `InventoryLayout` hanya dirender setelah pengguna terverifikasi; jika belum
  login akan diarahkan ke `/login`.

### Unggah Foto Inventaris

- Form barang, ruang, dan peminjaman kini menerima **unggahan berkas gambar langsung** (JPG/PNG/WEBP) alih-alih URL.
- Helper `uploadInventoryImage(folder, file)` akan:
  - menggenerasi nama file unik dengan timestamp,
  - meminta pre-signed URL ke endpoint `VITE_R2_SIGNER_URL`,
  - mengunggah berkas ke Cloudflare R2 dan mengembalikan `photoUrl` untuk disimpan ke database.
- Pastikan endpoint backend melakukan validasi ukuran/tipe file sebelum menerbitkan pre-signed URL.

## Standar Kode

- TypeScript strict mode aktif.
- ESLint + Prettier siap digunakan (`npm run lint`, `npm run format`).
- Komponen mengikuti pola shadcn/ui untuk konsistensi gaya.

## Lisensi

Proyek ini dirancang sebagai pondasi internal. Gunakan atau modifikasi sesuai kebutuhan institusi Anda.
