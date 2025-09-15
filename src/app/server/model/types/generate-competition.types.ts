import { z } from "zod";

export const generateCompetitionResponseSchema = z.object({
  title: z
    .string()
    .nullable()
    .describe(
      "Ekstrak judul resmi dan lengkap dari kompetisi, termasuk akronim jika ada (contoh: 'Program Kreativitas Mahasiswa Karsa Cipta (PKM-KC)')."
    ),
  description: z
    .string()
    .nullable()
    .describe(
      "Buatkan ringkasan atau rangkuman singkat (1-2 kalimat) yang menjelaskan tujuan utama, fokus, dan esensi dari kompetisi. Cari informasi ini di bagian Pendahuluan atau Latar Belakang."
    ),
  organizer: z
    .string()
    .nullable()
    .describe(
      "Identifikasi nama penyelenggara utama kompetisi. Cari nama kementerian, direktorat, universitas, atau organisasi mahasiswa yang bertanggung jawab."
    ),
  sourceUrl: z
    .string()
    .nullable()
    .describe(
      "Ekstrak URL atau alamat website resmi dari kompetisi. Biasanya tertera di bagian header, footer, atau kontak informasi."
    ),
  field: z
    .array(z.string())
    .nullable()
    .describe(
      "Identifikasi dan list semua bidang ilmu atau area fokus yang menjadi cakupan kompetisi. Contoh: 'Semua bidang keilmuan', 'Teknologi Informasi', 'Desain Produk', 'Agribisnis'. Jika tidak spesifik, tulis 'Semua Bidang'."
    ),
  type: z
    .string()
    .nullable()
    .describe(
      "Klasifikasikan jenis atau kategori utama dari kompetisi berdasarkan output yang diminta. Contoh: 'Business Plan Competition', 'Lomba Karya Tulis Ilmiah (LKTI)', 'Rancang Bangun Prototipe', 'Debat Bahasa Inggris', 'UI/UX Design'."
    ),
  requirements: z
    .object({
      teamComposition: z
        .string()
        .nullable()
        .describe(
          "Jelaskan syarat komposisi tim, mencakup jumlah minimal dan maksimal anggota, asal universitas (apakah boleh berbeda atau harus sama), dan syarat angkatan atau jenjang studi jika ada. Contoh: '3-5 mahasiswa dari universitas yang sama, minimal dari 2 angkatan berbeda'."
        ),
      originality: z
        .string()
        .nullable()
        .describe(
          "Sebutkan aturan mengenai keaslian atau orisinalitas karya. Cari kata kunci seperti 'asli', 'orisinal', 'bukan plagiat', 'surat pernyataan keaslian', atau 'belum pernah diikutsertakan'."
        ),
      other: z
        .string()
        .nullable()
        .describe(
          "List semua persyaratan penting lainnya untuk peserta yang belum tercakup, seperti status kemahasiswaan (aktif, D3/S1), batasan semester, atau larangan mengikuti kompetisi lain secara bersamaan."
        ),
    })
    .nullable()
    .describe("Rangkuman semua persyaratan utama untuk bisa mengikuti kompetisi."),
  minGPA: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Cari persyaratan Indeks Prestasi Kumulatif (IPK) atau Grade Point Average (GPA) minimum untuk bisa mendaftar. Jika tidak disebutkan sama sekali, gunakan null."
    ),
  startDate: z
    .string()
    .nullable()
    .describe(
      "Ekstrak tanggal dimulainya kompetisi, prioritaskan tanggal awal pendaftaran. Wajib dalam format YYYY-MM-DD. Jika hanya ada bulan (e.g., 'Juni 2024'), gunakan '2024-06-01'."
    ),
  endDate: z
    .string()
    .nullable()
    .describe(
      "Ekstrak tanggal berakhirnya kompetisi, prioritaskan tanggal akhir pendaftaran atau deadline pengumpulan final. Wajib dalam format YYYY-MM-DD. Jika hanya ada bulan, gunakan tanggal akhir bulan tersebut."
    ),
  location: z
    .string()
    .nullable()
    .describe(
      "Sebutkan lokasi fisik atau platform pelaksanaan kompetisi. Contoh: 'Luring di Universitas Gadjah Mada', 'Daring via Zoom', 'Hybrid'."
    ),
  evaluationCriteria: z
    .object({
      preliminaryRound: z
        .string()
        .nullable()
        .describe(
          "Rangkum kriteria penilaian untuk tahap seleksi awal atau proposal. Jika ada bobot persentase, sertakan. Contoh: 'Kreativitas (40%), Potensi Dampak (30%), Sistematika Penulisan (30%)'."
        ),
      finalRound: z
        .string()
        .nullable()
        .describe(
          "Rangkum kriteria penilaian untuk tahap final, seperti presentasi atau penilaian produk. Jika ada bobot persentase, sertakan. Contoh: 'Penguasaan Materi (50%), Kualitas Produk Demo (50%)'."
        ),
      other: z
        .string()
        .nullable()
        .describe(
          "Sebutkan kriteria penilaian lain yang tidak termasuk dalam babak penyisihan atau final, misalnya penilaian untuk laporan kemajuan, laporan akhir, atau pameran poster."
        ),
    })
    .nullable()
    .describe("Rangkuman kriteria yang digunakan juri untuk menilai peserta."),
  competitionStatistics: z
    .object({
      summary: z
        .string()
        .nullable()
        .describe("Cari ringkasan atau poin-poin statistik menarik tentang kompetisi jika ada."),
      totalApplicantsPastYear: z
        .array(
          z.object({
            count: z.number().describe("Jumlah pendaftar."),
            year: z.string().describe("Tahun pendaftaran."),
          })
        )
        .nullable()
        .describe(
          "Cari data historis mengenai jumlah total pendaftar pada tahun-tahun sebelumnya."
        ),
      pastUngParticipants: z
        .array(
          z.object({
            year: z.string().describe("Tahun partisipasi."),
            name: z.string().describe("Nama peserta dari UNG."),
            count: z.number().describe("Jumlah peserta dari UNG."),
          })
        )
        .nullable()
        .describe(
          "Cari data spesifik mengenai partisipasi atau prestasi mahasiswa dari Universitas Negeri Gorontalo (UNG) di tahun-tahun sebelumnya."
        ),
    })
    .nullable()
    .describe(
      "Cari data statistik terkait penyelenggaraan kompetisi di masa lalu. Jika tidak ada data sama sekali, gunakan null untuk seluruh objek ini."
    ),

  relevantCourses: z
    .array(z.string())
    .nullable()
    .describe(
      "Berdasarkan topik dan sifat kompetisi, simpulkan atau ekstrak nama mata kuliah yang relevan. Jika dokumen menyebutkan konversi SKS, sebutkan bentuk kegiatannya. Contoh: 'Studi/Proyek Independen', 'Kalkulus', 'Manajemen Pemasaran', 'Kewirausahaan'."
    ),
  relevantSkills: z
    .array(z.string())
    .nullable()
    .describe(
      "Berdasarkan deskripsi dan tugas dalam kompetisi, simpulkan atau ekstrak keterampilan (soft skills atau hard skills) yang dibutuhkan. Contoh: 'Python', 'Desain UI/UX', 'Public Speaking', 'Analisis Data', 'Penulisan Ilmiah'."
    ),
});

export type GenerateCompetitionResponse = z.infer<typeof generateCompetitionResponseSchema>;
