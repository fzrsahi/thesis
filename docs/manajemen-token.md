# Manajemen Token, Biaya, dan Pembaruan API

Dokumen ini menjelaskan secara detail teknis mengenai penggunaan token AI, estimasi biaya, dan panduan langkah demi langkah untuk memperbarui atau membeli kredit API ketika masa berlaku akun kampus habis.

---

## 1. Analisis & Estimasi Penggunaan Token

Aplikasi Scout menggunakan teknologi **RAG (Retrieval-Augmented Generation)** yang "memperkaya" pertanyaan user dengan potongan dokumen (Chunks) sebelum dikirim ke AI. Ini membuat konsumsi token lebih besar daripada chat biasa.

### Rincian Token per Transaksi (Estimasi)

Setiap kali Admin meng-generate data lomba atau Mahasiswa bertanya ke Advisor, sistem melakukan:

1.  **Pencarian Konteks**: Mengambil 10 potongan dokumen yang relevan (`TOP_K=10`).
    *   Fitur dokumen: `Chunk Size` diset ke **1000 karakter**.
    *   Total Konteks: ~10.000 karakter (sekitar **2.500 - 3.500 token**).
2.  **System Prompt**: Instruksi dasar untuk AI (~500 token).
3.  **Output Model**: Jawaban yang dihasilkan (~500 - 1.000 token).

**Total Rata-rata:** **~4.000 - 5.000 Token** per interaksi.

### Estimasi Kapasitas Kredit $100

Dengan asumsi biaya rata-rata model **GPT-4o** adalah ~$5.00 per 1 Juta Token (Input + Output blended):

*   **Total Kapasitas Token:** ~$100 / $5 * 1.000.000 = **20 Juta Token**.
*   **Total Interaksi:** 20.000.000 / 5.000 = **~4.000 Interaksi/Chat**.

> *Catatan: Angka ini adalah estimasi kasar. Penggunaan nyata bisa bervariasi tergantung panjang dokumen lomba dan panjang jawaban.*

---

## 2. Status Akun Kampus Saat Ini

Berdasarkan konfigurasi saat ini, aplikasi menggunakan akun Educational/Student:

*   **Provider:** **Azure OpenAI Service**.
*   **Jenis Akun:** Azure for Students (Kemungkinan besar).
*   **Kredit Gratis:** **$100 (USD)**.
*   **Masa Berlaku:** Hingga **Maret 2026** (Atau sampai saldo $100 habis).

### Risiko
Jika saldo $100 habis sebelum Maret 2026, atau jika tanggal tersebut terlewat, API akan berhenti bekerja (Error `401 Unauthorized` atau `429 Quota Exceeded`). Anda **HARUS** migrasi ke akun berbayar.

---

## 3. Panduan Migrasi & Beli Token (PENTING)

Ketika kredit gratis habis, Anda harus mengganti API Key dengan akun pribadi atau organisasi yang berbayar. Kami menyarankan dua opsi:

### Opsi A: Pindah ke OpenAI "Direct" (Paling Mudah)
Ini adalah cara termudah untuk perorangan/bisnis kecil tanpa proses verifikasi bank yang rumit seperti Azure.

**Langkah-langkah:**

1.  **Registrasi Akun:**
    *   Buka [platform.openai.com](https://platform.openai.com/signup).
    *   Login atau Daftar akun baru.
2.  **Masuk ke Billing:**
    *   Klik menu **Settings** > **Billing**.
    *   Klik **Add payment details** dan masukkan kartu kredit/debit (Jenius/Jago/dll bisa).
    *   **PENTING:** Beli kredit awal (misal $5 atau $10). Sistem OpenAI sekarang menggunakan sistem *Pre-paid* (Bayar dulu baru pakai).
3.  **Generate API Key:**
    *   Buka menu [API Keys](https://platform.openai.com/api-keys).
    *   Klik **+ Create new secret key**.
    *   Beri nama (misal: "Scout App").
    *   Salin kode key yang muncul (dimulai dengan `sk-...`). **Simpan baik-baik, key tidak akan muncul lagi!**
4.  **Update di Aplikasi Scout:**
    *   Login ke Scout sebagai Admin/User.
    *   Pergi ke **Settings** / **Profile**.
    *   Ubah Provider ke `OpenAI`.
    *   Ubah Model ke `gpt-4o`.
    *   Paste API Key baru Anda.
    *   Klik Simpan.

### Opsi B: Lanjut Menggunakan Azure OpenAI (Skala Enterprise)
Jika kampus/kantor akan membiayai, opsi ini lebih stabil dan aman.

**Langkah-langkah:**

1.  **Upgrade Subscription:**
    *   Login ke [portal.azure.com](https://portal.azure.com).
    *   Ubah subscription dari "Azure for Students" ke "Pay-As-You-Go". Ini memerlukan kartu kredit korporat/pribadi.
2.  **Pastikan Resource Aktif:**
    *   Cek resource "Azure OpenAI" Anda di portal. Pastikan statusnya "Succeeded" dan tidak terhapus.
3.  **Ambil Key Baru (Jika berubah):**
    *   Masuk ke resource OpenAI Anda > menu **Keys and Endpoint**.
    *   Salin **Key 1**.
4.  **Update di Aplikasi Scout:**
    *   Di menu Settings aplikasi, pastikan Provider tetap `Azure OpenAI`.
    *   Masukkan Key baru jika berubah. Endpoint dan Instance Name biasanya tetap sama.

---

## 4. Cara Cek Sisa Token

Aplikasi tidak menampilkan sisa token secara real-time karena API Provider tidak memberikan data saldo via API chat biasa.

**Cara Manual:**
1.  **Untuk Azure:** Cek [Azure Cost Management](https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/overview) di portal Azure untuk melihat tagihan berjalan.
2.  **Untuk OpenAI:** Cek menu [Usage](https://platform.openai.com/usage) di dashboard OpenAI untuk melihat grafik penggunaan harian dan sisa kredit.

---

## 5. Tips Penghematan Token

Jika anggaran terbatas, Anda bisa melakukan langkah berikut di kode:

1.  **Ganti Model:**
    *   Gunakan `gpt-3.5-turbo` (OpenAI) atau `gpt-4o-mini` yang **jauh lebih murah** (bisa 10-20x lebih murah) daripada GPT-4o standar, dengan performa yang masih cukup baik untuk chatbot sederhana.
