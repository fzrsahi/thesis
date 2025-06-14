import { CreateCompetitionGeneratePayload } from "@/app/shared/schema/competition/CompetitionGenerateSchema";

import { sendPrompt } from "../../model/azure/azure-openai.service";

export const generateCompetitionUsecase = async (payload: CreateCompetitionGeneratePayload) => {
  const { description, title, website, additionalDetails, file, startPage, endPage } = payload;
  const competitionData = await generateCompetitionWithAzure(payload);
  return competitionData;
};

const generateCompetitionWithAzure = async (payload: CreateCompetitionGeneratePayload) => {
  const systemMessage = `Anda adalah seorang Spesialis Ekstraksi Informasi yang sangat teliti. Tugas Anda adalah membaca input teks (nama kompetisi, deskripsi, informasi lainnya, dan URL) dan menghasilkan sebuah objek JSON valid yang berisi informasi penting mengenai kompetisi mahasiswa. Informasi ini akan digunakan dalam sistem rekomendasi lomba yang mencocokkan minat, keterampilan, dan latar belakang mahasiswa.
  Tujuan utama: hasil ekstraksi harus lengkap, akurat, dan tidak menggunakan null kecuali benar-benar tidak ada datanya. Anda diperbolehkan menarik informasi eksplisit dan implisit dari deskripsi kompetisi, proyek contoh, teknologi yang disebutkan, dan pola umum lomba mahasiswa di Indonesia.

`;

  const prompt = `
    INPUT YANG DIBERIKAN:
    - Nama Kompetisi: ${payload.title}
    - Deskripsi: ${payload.description}
    - Website: ${payload.website}
    ${payload.addition_details ? `- Detail Tambahan: ${payload.addition_details}` : ""}

    PROSES EKSTRAKSI:
    1. Baca dan pahami semua teks yang diberikan: deskripsi input, teks tidak terstruktur, serta konten situs jika relevan.
    2. Jika suatu informasi tidak tersedia di teks, tetapkan nilai null—jangan menebak atau menambahkan asumsi di luar data yang ada.
    3. Untuk nama peserta (jika muncul), tampilkan sebagai array string.
    4. Identifikasi kursus akademik dan keterampilan yang relevan secara tepat berdasarkan fokus teknis atau non-teknis kompetisi, tanpa mengarang detail baru.
    5. Semua tanggal harus dalam format YYYY-MM-DD jika tersedia; jika hanya tahun atau rentang yang disebutkan, sesuaikan dengan format yang memungkinkan (misalnya "2023-05" menjadi "2023-05-01" jika dianggap tanggal awal) atau tetapkan null jika tidak cukup informasi untuk tanggal pasti.
    6. Pastikan output adalah satu objek JSON valid saja, tanpa teks penjelas di luar JSON. Struktur dan tipe data harus sesuai spesifikasi.

    OUTPUT JSON (FORMAT WAJIB):
    {
        "title": "string // Nama resmi kompetisi, sesuai dengan yang tercantum di sumber (misalnya situs resmi atau dokumen panduan). Tidak boleh disingkat atau diganti.",
        "description": "string // Ringkasan yang menjelaskan tujuan, ruang lingkup, dan karakter umum dari kompetisi. Ambil dari deskripsi resmi atau simpulkan dari narasi panjang secara akurat.",
        "field": [
          "string // Bidang utama kompetisi yang relevan, seperti 'Teknologi Informasi', 'Kesehatan', 'Inovasi Sosial'. Bisa lebih dari satu tergantung cakupan kompetisi."
        ],
        "type": "string // 'Tim' jika kompetisi dilakukan secara kelompok, 'Individual' jika dilakukan sendiri. Jika disebut kolaborasi atau tim, pilih 'Tim'.",
        "minGPA": "string | null // IPK minimal jika disebutkan secara eksplisit. Jika tidak disebut, isi dengan null.",
        "requirements": {
          "teamComposition": "string | null // Struktur tim, jumlah anggota, atau ketentuan asal jurusan (contoh: '2-3 mahasiswa dari jurusan terkait'). Null jika tidak disebut.",
          "originality": "string | null // Syarat keaslian karya, misalnya 'Karya harus orisinal'. Null jika tidak disebut.",
          "other": "string | null // Syarat lain seperti 'Mengunggah proposal PDF', 'Mengisi formulir pendaftaran'. Null jika tidak ada informasi tambahan."
        },
        "startDate": "string | null // Tanggal mulai pendaftaran atau penyelenggaraan. Format YYYY-MM-DD. Jika hanya disebut bulan/tahun, gunakan tanggal 01.",
        "endDate": "string | null // Tanggal akhir pendaftaran atau kompetisi. Format YYYY-MM-DD. Null jika tidak tersedia.",
        "location": "string | null // Tempat pelaksanaan, bisa 'Online' atau lokasi fisik (contoh: 'Universitas Indonesia'). Null jika tidak disebutkan.",
        "organizer": "string | null // Nama penyelenggara utama, misalnya 'Kemdikbud', 'Kampus Merdeka', atau lembaga pemerintah/pendidikan lainnya.",
        "evaluationCriteria": {
          "preliminary_round": "string | null // Kriteria penilaian di babak awal jika dibagi beberapa tahap. Contoh: 'Proposal 40%, Inovasi 60%'. Null jika tidak disebut.",
          "final_round": "string | null // Kriteria penilaian di babak final. Contoh: 'Demo Produk dan Presentasi'. Null jika tidak disebut.",
          "other": "string | null // Kriteria tambahan jika ada. Null jika tidak disebut."
        },
        "competitionStatistics": {
          "summary": "string | null // Ringkasan statistik peserta historis. Contoh: '500 tim dari 100 universitas pada 2023'. Null jika tidak tersedia.",
          "total_applicants_past_year": [
            {
              "count": "integer | null // Jumlah pendaftar pada tahun tertentu. Null jika tidak diketahui.",
              "year": "string | null // Tahun terkait. Null jika tidak disebut."
            }
          ],
          "finalistCountPastYear": [
            {
              "count": "integer | null // Jumlah finalis pada tahun tertentu. Null jika tidak diketahui.",
              "year": "string | null // Tahun terkait. Null jika tidak disebut."
            }
          ],
          "pastUngParticipants": [
            {
              "year": "string // Tahun partisipasi peserta dari Universitas Negeri Gorontalo (UNG).",
              "name": "string // Nama peserta dari UNG.",
              "count": "integer // Jumlah anggota dalam tim atau 1 jika individu."
            }
          ]
        },
        "sourceUrl": "string // URL resmi kompetisi yang digunakan sebagai sumber utama data.",
        "relevantCourses": [
          "string // Nama mata kuliah yang relevan dengan kompetisi. Contoh: 'Machine Learning', 'Kecerdasan Buatan', 'Penulisan Proposal'."
        ],
        "relevantSkills": [
          "string // Keterampilan teknis atau non-teknis yang relevan dengan kompetisi. Contoh: 'Python', 'UI/UX', 'Public Speaking'."
        ]
      }
    `;

  const competitionData = await sendPrompt(
    {
      systemMessage,
      userMessage: prompt,
    },
    "gpt-4o",
    "json_object"
  );

  return JSON.parse(competitionData || "{}");
};
