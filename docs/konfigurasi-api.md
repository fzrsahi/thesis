# Konfigurasi API LLM (OpenAI / Azure / Gemini)

Aplikasi Scout sangat bergantung pada **Large Language Models (LLM)** untuk fitur rekomendasi cerdas (RAG) dan Chatbot Advisor. 

Sistem ini mendukung provider berikut:
- **OpenAI** (Model: GPT-4o, GPT-3.5-turbo)
- **Azure OpenAI** (Untuk penggunaan enterprise/kampus)
- **Google Gemini**

---

## 1. Cara Mengatur API Key

Scout memiliki sistem manajemen konfigurasi "Hybrid". Anda bisa mengatur API Key melalui Environment Variable (untuk default sistem) atau melalui Halaman Pengaturan (untuk fleksibilitas ganti key tanpa restart server).

### Opsi A: Melalui Halaman Pengaturan (Disarankan)

Admin atau User dapat mengupdate konfigurasi LLM langsung dari aplikasi tanpa menyentuh kode. Data ini disimpan di tabel database `ModelSetting`.

1. Login ke aplikasi Scout.
2. Pergi ke menu **Settings** atau **Profile**.
3. Cari bagian **Konfigurasi Model AI** atau **API Key**.
4. Anda dapat memasukkan:
   - **Provider**: Pilih antara `openai`, `azure-openai`, atau `google-gemini`.
   - **API Key**: Masukkan secret key Anda.
   - **Model**: Misal `gpt-4o`.
   - **Instance Name / Endpoint**: Khusus untuk Azure OpenAI.
5. Klik **Simpan**. Sistem akan memprioritaskan pengaturan ini dibanding file `.env`.

### Opsi B: Melalui Environment Variable (`.env`)

Untuk konfigurasi level server, Anda bisa mengedit file `.env` di root project.

```env
# OpenAI Standard
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxx"

# Google Gemini
GEMINI_API_KEY="AIzaSyBxxxxxxxxxxxxxxx"

# Azure OpenAI
AZURE_OPENAI_API_KEY="xxxxxxxxxxxxxxxxx"
AZURE_OPENAI_CHAT_DEPLOYMENT="gpt-4o"
AZURE_OPENAI_INSTANCE_NAME="nama-instance-azure"
AZURE_OPENAI_GPT_ENDPOINT="https://nama-instance.openai.azure.com/"
```

> **Catatan:** Jika Anda mengubah file `.env`, Anda harus merestart server (`Ctrl+C` lalu `npm run dev`) agar perubahan terbaca.

---

## 2. Token & Biaya (Wajib Tahu)

Fitur Chatbot dan Analisis Lomba menggunakan layanan berbayar dari provider AI. Aplikasi ini **TIDAK** menyediakan saldo gratis. Anda harus memiliki kredit aktif di akun provider masing-masing.

### Estimasi Biaya (OpenAI / Azure GPT-4o)

Scout menggunakan model **GPT-4o** yang canggih namun efisien. Berikut estimasi kasarnya (per Desember 2024):

- **Input (Prompt mahasiswa + Konteks Lomba):** ~$2.50 / 1 Juta Token.
- **Output (Jawaban Advisor):** ~$10.00 / 1 Juta Token.

*1 Juta Token setara dengan sekitar 750.000 kata atau ratusan dokumen lomba full-text.*

### Cara Top-up Saldo AI

1. **Untuk OpenAI:**
   - Masuk ke [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing).
   - Tambahkan kartu kredit dan beli kredit (Pre-paid credit).
   - Pastikan limit penggunaan (Usage Limits) cukup.

2. **Untuk Google Gemini:**
   - Gunakan Google AI Studio atau Google Cloud Console.
   - Aktifkan billing pada project Google Cloud Anda.

---

## 3. Masalah Umum (Troubleshooting)

- **Error: "Rate limit exceeded"**
  - Penyebab: Saldo API Anda habis atau Anda mengirim request terlalu cepat dalam waktu singkat.
  - Solusi: Cek billing di dashboard provider AI.

- **Error: "Model not found"**
  - Penyebab: Model yang Anda tulis (misal `gpt-4o`) belum tersedia di akun API Anda (terutama di Azure yang perlu deployment manual).
  - Solusi: Pastikan nama deployment di Azure sama persis dengan yang diinput di setting.
