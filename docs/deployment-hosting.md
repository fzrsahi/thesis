# Deployment & Hosting Guide

Dokumen ini menjelaskan status hosting saat ini dan panduan untuk memigrasikan aplikasi Scout ke layanan lain.

---

## 🏗️ Status Hosting Saat Ini

Saat ini, aplikasi dan database (PostgreSQL + pgvector) di-deploy secara penuh di **Heroku**.

- **URL Aplikasi:** [https://thesis.fzrsahi.com/](https://thesis.fzrsahi.com/)
- **Platform:** Heroku (Dynos untuk App & Heroku Postgres untuk DB)
- **Database:** Menggunakan Heroku Postgres dengan ekstensi `pgvector` yang telah diaktifkan.

Aplikasi berjalan di environment production tersebut. Jika ingin memindahkan hosting, silakan ikuti panduan migrasi di bawah.

---

## 🚀 Opsi Migrasi 1: VPS (Virtual Private Server) - Ubuntu

Hosting mandiri memberikan kontrol penuh dan biaya yang lebih terprediksi.

### Persiapan Server
1. Sewa VPS (Contoh: DigitalOcean Droplet, AWS EC2, Biznet Gio) dengan OS **Ubuntu 22.04 LTS**.
2. Masuk via SSH: `ssh root@ip-address-server`.

### Langkah Instalasi di VPS

1. **Install Node.js & PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Setup Database (Docker):**
   Cara termudah mendapatkan `pgvector` di VPS adalah dengan Docker, sama seperti di lokal.
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Jalankan Database
   mkdir -p ~/scout-db
   # ... (Copy file docker-compose.yml ke server lalu jalankan docker-compose up -d)
   ```

3. **Deploy App:**
   ```bash
   git clone https://github.com/username/scout-thesis.git
   cd scout-thesis
   npm install
   
   # Setup .env (Gunakan konfigurasi Production!)
   nano .env 
   
   # Build Aplikasi
   npm run build
   
   # Jalankan dengan PM2 (agar jalan terus di background)
   pm2 start npm --name "scout-app" -- start
   pm2 save
   ```

4. **Setup Nginx (Reverse Proxy):**
   Gunakan Nginx agar aplikasi bisa diakses via domain (port 80/443), bukan port 3000.
   ```bash
   sudo apt install nginx
   # Konfigurasi proxy pass ke localhost:3000
   ```

---

## ☁️ Opsi Migrasi 2: Vercel + Supabase (Recommended)

Kombinasi ini paling mudah dikelola dan performanya tinggi untuk Next.js.

### 1. Database (Supabase)
Supabase adalah layanan PostgreSQL yang sudah mendukung `pgvector` secara bawaan.
1. Buat project baru di [Supabase.com](https://supabase.com).
2. Pergi ke **SQL Editor** di dashboard Supabase dan aktifkan ekstensi vector:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Ambil **Connection String (URI)** dari menu Database Settings.

### 2. Aplikasi (Vercel)
1. Push kode Anda ke GitHub.
2. Buka [Vercel.com](https://vercel.com) dan "Import Project" dari GitHub.
3. Di bagian **Environment Variables**, masukkan:
   - `DATABASE_URL`: Isi dengan URI dari Supabase (Mode Transaction/Session pooler).
   - `OPENAI_API_KEY`: Key OpenAI Anda.
   - `NEXTAUTH_SECRET`: Generate string acak.
4. Klik **Deploy**.

Vercel akan otomatis mendeteksi Next.js, menjalankan `npm run build`, dan mendeploy aplikasi Anda.
