# Panduan Penggunaan Aplikasi Scout

Panduan ini ditujukan untuk dua peran pengguna utama: **Administrator** (Pengelola Data) dan **Mahasiswa** (Pencari Lomba).

---

## 👨‍💼 Untuk Administrator: Manajemen Data Lomba

Admin bertugas memastikan database Scout terisi dengan data kompetisi terbaru agar sistem rekomendasi (RAG) dapat bekerja.

### Cara Upload Dokumen Lomba (PDF)

Sistem Scout menggunakan teknologi cerdas yang dapat "membaca" file PDF lomba.

1. **Login sebagai Admin.**
2. Masuk ke halaman **Dashboard Admin**.
3. Pilih menu **Manajemen Kompetisi** atau **Tambah Lomba**.
4. Upload file PDF (Buku Panduan / Flyer Lomba).
   - Pastikan PDF berisi teks yang bisa diseleksi (bukan hasil scan gambar penuh) agar AI bisa membacanya.
5. Lengkapi Meta Data Manual:
   - **Judul Kompetisi**: Tulis nama lengkap lomba.
   - **Tanggal Penting**: Batas pendaftaran, tanggal pelaksanaan.
   - **Kategori**: Pilih bidang (IT, Bisnis, Desain, dll).
6. Klik **Simpan / Proses AI**.
   - *Di balik layar, sistem akan memecah dokumen PDF (Chunking) dan menyimpannya sebagai vector agar bisa dicari oleh mahasiswa.*

---

## 👨‍🎓 Untuk Mahasiswa: Mendapatkan Rekomendasi

Agar Scout bisa merekomendasikan lomba yang tepat ("Jodoh Lomba" Anda), Anda harus melengkapi profil terlebih dahulu.

### 1. Mengisi Profil Mahasiswa
1. **Login** menggunakan akun mahasiswa Anda.
2. Klik foto profil di pojok kanan atas, pilih **Profile** atau **Settings**.
3. Isi data berikut dengan lengkap:
   - **Data Akademik**: IPK Semester terakhir (Sistem akan memfilter lomba yang punya syarat IPK).
   - **Program Studi**: Misal "Sistem Informasi".
   - **Minat (Interests)**: Ketik topik yang Anda suka, misal "Web Development", "UI/UX", "Kewirausahaan".
   - **Skill (Keterampilan)**: Ketik skill teknis, misal "Figma", "React.js", "Public Speaking".
4. Klik **Simpan**.

### 2. Mencari Rekomendasi Lomba
1. Masuk ke halaman **Beranda (Home)** atau **Rekomendasi**.
2. Sistem akan otomatis menampilkan daftar lomba dengan skor **"Match Percentage"** (Kecocokan).
   - *Misal: "Lomba UI/UX Nasional - 95% Cocok".*
3. Klik lomba tersebut untuk melihat detail "Kenapa lomba ini cocok untuk saya?". AI akan memberikan alasan berdasarkan profil Anda.

### 3. Chat dengan Advisor
1. Jika Anda bingung, klik ikon **Chat** di pojok kanan bawah.
2. Tanyakan hal seperti:
   - *"Halo Scout, saya mahasiswa semester 4 jurusan SI, ada lomba coding yang cocok bulan ini?"*
   - *"Apa saja syarat administrasi untuk Gemastik?"*
3. Advisor AI akan menjawab berdasarkan database data lomba yang sudah diupload Admin.
