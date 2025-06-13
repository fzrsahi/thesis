import { CreateCompetitionGeneratePayload } from "@/app/shared/schema/competition/CompetitionGenerateSchema";
import { sendPrompt } from "../../model/azure/azure-openai.service";

export const generateCompetitionUsecase = async (payload: CreateCompetitionGeneratePayload) => {
  const systemMessage = `Anda adalah Spesialis Ekstraksi Informasi yang teliti dengan tugas mengekstrak detail spesifik dari teks tidak terstruktur pada website kompetisi, yang disediakan bersama dengan nama kompetisi, deskripsi, dan URL website. Tujuan Anda adalah mengisi database untuk sistem rekomendasi kompetisi yang mencocokkan kesempatan dengan profil mahasiswa (termasuk minat dan keterampilan). Akurasi, kelengkapan, dan kepatuhan ketat terhadap format JSON sangat penting untuk menghindari kesalahan sistem.

LANGKAH PROSES:
1. Baca dan pahami teks yang diberikan, deskripsi input, dan konten website.
2. Untuk informasi yang hilang, kembalikan null. Jangan menebak atau menyimpulkan di luar teks yang diberikan.
3. Untuk nama peserta, tuliskan sebagai array string.
4. Keluarkan satu objek JSON yang valid tanpa teks penjelasan di luar JSON.
5. Identifikasi mata kuliah akademik dan keterampilan yang relevan yang tepat sesuai dengan fokus kompetisi (teknis atau non-teknis), berdasarkan deskripsi dan bidang, tanpa membuat-buat detail.

FORMAT OUTPUT WAJIB (JSON):
{
  "title": "string (Nama lengkap kompetisi)",
  "description": "string (Gambaran singkat tentang tujuan dan ruang lingkup kompetisi, sesuai yang diberikan atau diekstrak)",
  "field": ["string"] (Bidang utama kompetisi)",
  "type": "string ('Individual' atau 'Team', menunjukkan apakah peserta berkompetisi solo atau dalam kelompok)",
  "minGPA": "string | null (Persyaratan IPK minimum untuk kelayakan, jika disebutkan; jika tidak, null)",
  "requirements": {
    "team_composition": "string | null (Detail tentang ukuran dan komposisi tim)",
    "originality": "string | null (Aturan tentang orisinalitas submission)",
    "other": "string | null (Kriteria kelayakan tambahan)"
  },
  "startDate": "string (format YYYY-MM-DD, tanggal mulai kompetisi atau pendaftaran)",
  "endDate": "string (format YYYY-MM-DD, tanggal akhir kompetisi atau tanggal final)",
  "location": "string | null (Lokasi acara, misal 'Online' atau kota/universitas tertentu; null jika tidak disebutkan)",
  "organizer": "string | null (Entitas penyelenggara)",
  "evaluation_criteria": {
    "preliminary_round": "string | null (Kriteria untuk penilaian awal)",
    "final_round": "string | null (Kriteria untuk penilaian final)",
    "other": "string | null"
  },
  "competition_statistics": {
    "summary": "string (Gambaran singkat data partisipasi historis, termasuk tahun dan sumber)",
    "total_applicants_past_year": {
      "count": "integer | null (Jumlah tim atau individu yang mendaftar pada tahun terbaru)",
      "year": "string | null (Tahun data pelamar)"
    },
    "finalist_count_past_year": {
      "count": "integer | null (Jumlah tim atau individu yang mencapai final pada tahun terbaru)",
      "year": "string | null (Tahun data finalis)"
    },
    "past_ung_participants": ["string"] | null (Nama peserta masa lalu dari Universitas Negeri Gorontalo, jika tersedia)"
  },
  "source_url": "string | null (URL website atau dokumen utama untuk kompetisi)",
  "relevant_courses": ["string"] (Mata kuliah akademik yang langsung relevan dengan fokus teknis atau non-teknis kompetisi)",
  "relevant_skills": ["string"] (Keterampilan yang langsung relevan dengan persyaratan teknis atau non-teknis kompetisi)"
}`;

  const userMessage = `Ekstrak data kompetisi dari informasi berikut:
    Nama Kompetisi: ${payload.title}
    Deskripsi: ${payload.description}
    Website: ${payload.website}
    ${payload.addition_details ? `Detail Tambahan: ${payload.addition_details}` : ""}
    Mohon ekstrak informasi tersebut dan kembalikan dalam format JSON yang telah ditentukan.`;

  const competitionData = await sendPrompt(
    {
      systemMessage,
      userMessage,
    },
    "gpt-4o",
    "json_object"
  );

  return JSON.parse(competitionData || "{}");
};
