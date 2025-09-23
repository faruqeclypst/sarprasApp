# Sistem Inventaris Sarana Prasarana Sekolah

Aplikasi dashboard modern berbasis **React + Vite + TypeScript** dengan styling **Tailwind CSS** dan komponen **shadcn/ui** untuk mengelola data inventaris sarana prasarana sekolah. Data tersinkronisasi real-time menggunakan **Firebase Realtime Database**, sementara berkas media diunggah langsung ke **Cloudflare R2 (kompatibel S3)** menggunakan kredensial S3.

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

Buat berkas `.env` di root proyek dengan konfigurasi Firebase dan kredensial Cloudflare R2:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_AUTH_USERNAME_DOMAIN=inventory.local
VITE_R2_BUCKET=<nama-bucket-r2>
VITE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
VITE_R2_ACCESS_KEY_ID=<access-key-id>
VITE_R2_SECRET_ACCESS_KEY=<secret-access-key>
# Opsional apabila menggunakan domain CDN publik khusus
# VITE_R2_PUBLIC_BASE_URL=cdn.sekolah.id/assets
```

> **Penting:** Pendekatan ini menyematkan kredensial R2 langsung di aplikasi frontend dan hanya direkomendasikan untuk lingkungan tepercaya atau prototipe internal. Untuk produksi, pertimbangkan membangun endpoint Cloudflare Worker/Server yang menerbitkan URL bertanda tangan sehingga kunci rahasia tidak terekspos ke pengguna akhir.

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

- Helper `uploadInventoryImage(folder, file)` membuat nama unik, mengunggah berkas langsung ke bucket R2 memakai `@aws-sdk/client-s3`, dan mengembalikan URL publiknya.
- URL publik secara default memakai pola `https://<bucket>.<account-id>.r2.cloudflarestorage.com/<key>`. Jika Anda menggunakan domain CDN kustom, setel `VITE_R2_PUBLIC_BASE_URL` agar helper menghasilkan URL sesuai domain tersebut.
- Pastikan bucket R2 Anda mengizinkan akses baca publik terhadap objek yang diunggah (mis. melalui kebijakan `Public Bucket` atau CF Worker yang melakukan proxy).
- Karena kredensial tertanam di frontend, sebaiknya batasi hak akses akun R2 (mis. hanya `PutObject` dan `GetObject` untuk bucket terkait) dan rotasi kunci secara berkala.

### Otorisasi & Login

- **Username & Password** – masukkan username (misal `operator`) yang otomatis dikonversi menjadi email internal
  (`operator@<VITE_AUTH_USERNAME_DOMAIN>`) sebelum diproses oleh Firebase Authentication.
- **Google Sign-In** – tersedia tombol khusus untuk autentikasi cepat menggunakan akun Google.
- **Proteksi Dashboard** – seluruh halaman di dalam `InventoryLayout` hanya dirender setelah pengguna terverifikasi; jika belum
  login akan diarahkan ke `/login`.

### Unggah Foto Inventaris

- Form barang, ruang, dan peminjaman kini menerima **unggahan berkas gambar langsung** (JPG/PNG/WEBP) alih-alih URL.
- Helper `uploadInventoryImage(folder, file)` mengunggah berkas langsung menggunakan kredensial R2 dan mengembalikan URL-nya.
- Validasi ukuran/tipe file dilakukan di sisi klien melalui schema Zod; Anda dapat menambahkan validasi tambahan pada bucket atau melalui Cloudflare Rules.

## Standar Kode

- TypeScript strict mode aktif.
- ESLint + Prettier siap digunakan (`npm run lint`, `npm run format`).
- Komponen mengikuti pola shadcn/ui untuk konsistensi gaya.

## Lisensi

Proyek ini dirancang sebagai pondasi internal. Gunakan atau modifikasi sesuai kebutuhan institusi Anda.
