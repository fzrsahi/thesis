# Panduan Instalasi Scout (Local Development)

Dokumen ini menjelaskan langkah-langkah untuk menginstal dan menjalankan aplikasi **Scout** di lingkungan pengembangan lokal (Localhost).

---

## 1. Persiapan Lingkungan

Pastikan Anda sudah menginstal aplikasi berikut:
- [Node.js](https://nodejs.org/) (Saran: v20.x ke atas)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Wajib untuk database `pgvector`)
- [Git](https://git-scm.com/)

---

## 2. Clone Repository

Buka terminal dan jalankan perintah berikut untuk mengunduh kode sumber:

```bash
git clone https://github.com/username/scout-thesis.git
cd scout-thesis
```
*(Ganti URL git sesuai dengan repository asli Anda)*

---

## 3. Instalasi Dependencies

Instal paket-paket library yang dibutuhkan menggunakan `npm`:

```bash
npm install
```

---

## 4. Setup Database (PostgreSQL + pgvector)

Aplikasi ini membutuhkan PostgreSQL dengan ekstensi `pgvector`. Kami telah menyediakan konfigurasi Docker untuk mempermudah hal ini.

1. **Jalankan Container Database:**
   Pastikan Docker Desktop sudah berjalan, lalu ketik:

   ```bash
   docker-compose up -d
   ```
   
   Perintah ini akan menjalankan PostgreSQL di port `5432` dengan user `root` dan password `root` (sesuai file `docker-compose.yml`).

2. **Setup File `.env`:**
   Salin file contoh konfigurasi:
   
   ```bash
   cp .env.example .env
   ```

   Buka file `.env` dan pastikan konfigurasi database sesuai dengan settingan Docker Anda:

   ```env
   # Database Connection String
   # Format: postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
   DATABASE_URL="postgresql://root:root@localhost:5432/thesis?schema=public"
   
   # Setup Auth (Ganti dengan string acak untuk keamanan)
   NEXTAUTH_SECRET="rahasia_dapur_bunda"
   NEXTAUTH_URL="http://localhost:3000"
   
   # (Opsional) API Key Default - Bisa diatur nanti via UI Admin
   OPENAI_API_KEY="sk-..."
   AZURE_OPENAI_API_KEY="..."
   GEMINI_API_KEY="..."
   ```

---

## 5. Migrasi & Seeding Database

Setelah database berjalan, kita perlu membuat tabel-tabel (Schema) dan mengisi data awal.

1. **Generate Prisma Client:**
   
   ```bash
   npx prisma generate
   ```

2. **Jalankan Migrasi Database:**
   Ini akan membuat tabel `User`, `competitions`, `documentChunks` (dengan kolom vector), dll.

   ```bash
   npm run generate:migration
   # Atau: npx prisma migrate dev
   ```

3. **Seeding Data (Data Dummy):**
   Isi database dengan data awal (User Admin, contoh Lomba) agar aplikasi tidak kosong.

   ```bash
   npm run seed
   ```

   *Script ini akan menjalankan `src/script/seed.ts` yang membuat user admin dan data uji coba.*

---

## 6. Menjalankan Aplikasi

Sekarang Anda siap menjalankan server pengembangan:

```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## Troubleshooting Umum

- **Error: `Vector extension not found`**: 
  Pastikan Anda menggunakan image Docker `pgvector/pgvector:pg16` yang ada di `docker-compose.yml`, bukan image postgres biasa.
  
- **Error Koneksi Database**: 
  Pastikan container Docker berjalan dengan `docker ps`.

- **Prisma Error**:
  Jika Anda mengubah schema, jangan lupa jalankan `npx prisma generate` lagi.
