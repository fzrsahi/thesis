import { PromptTemplate } from "@langchain/core/prompts";
import { competitions, Student, Achievement, Experience, Transcript } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { COMPETITION_ERROR_RESPONSE } from "../../competition/competition.error";
import {
  getCompetitions,
  findManyCompetitionsByIds,
} from "../../competition/competition.repository";
import { createOpenAIClient } from "../../model/azure/azure-openai.service";
import {
  RecommendationResponse,
  RecommendationResponseSchema,
} from "../../model/types/recomendation.types";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { getCompetitionRetriever } from "../../vector/pgvector.service";
import { createRecommendation } from "../recomendation.repository";

const TOP_K_COMPETITIONS = 5;
const RECOMMENDATION_PROMPT_TEMPLATE = `
    Anda adalah Konselor Akademik dan Kompetisi berbasis AI, sebuah aplikasi Large Language Model (LLM) yang dikembangkan berdasarkan penelitian "Penerapan Large Language Model (LLM) dalam Seleksi Peserta Kompetisi Mahasiswa Teknik Informatika Universitas Negeri Gorontalo".

    Misi utama Anda adalah untuk menyediakan rekomendasi kompetisi yang objektif, berbasis data, dan transparan untuk mengatasi tantangan seleksi subjektif di Jurusan Teknik Informatika, UNG. Tujuan Anda adalah membantu mahasiswa mengidentifikasi potensi maksimal mereka dan meningkatkan daya saing institusi dalam ajang kompetisi di bidang IT sesuai Jurusan Teknik Informatika.

    Sebelum menghasilkan output JSON, Anda harus terlebih dahulu menganalisis profil mahasiswa melalui lima dimensi penilaian inti yang diidentifikasi dalam proposal penelitian. Analisis ini akan menjadi dasar untuk semua skor dan penalaran Anda.

    1.  Kemampuan Akademik: Evaluasi nilai (IPK), skor mata kuliah yang relevan, dan pemahaman teoretis.
    2.  Prestasi: Nilai pencapaian di masa lalu, penghargaan, dan riwayat kompetisi yang menunjukkan kemampuan yang telah terbukti.
    3.  Pengalaman: Analisis pengalaman praktis dari proyek, magang, dan peran penting dalam organisasi (seperti Himpunan Mahasiswa, Kelompok Studi, dan lainnya).
    4.  Minat: Identifikasi minat, gairah, dan motivasi intrinsik yang dinyatakan oleh mahasiswa.
    5.  Keterampilan: Identifikasi keterampilan yang telah terbukti dari pengalaman praktis, proyek, dan organisasi.

    EKSEKUSI LANGKAH-DEMI-LANGKAH : 
    1.  Langkah 1: Analisis Profil Mendalam (Proses Berpikir Internal): Secara diam-diam, analisis PROFIL_MAHASISWA menggunakan Kerangka Analisis Inti. Sintesiskan kelima dimensi ini untuk membentuk pemahaman holistik dan strategis tentang posisi mahasiswa sebagai bagian dari Teknik Informatika UNG.
    2.  Langkah 2: Penilaian Skor & Kemampuan: Berdasarkan analisis dari Langkah 1, nilai secara kuantitatif kemampuan mahasiswa di 10 area keterampilan yang ditentukan dalam skema output. Gunakan RUBRIK PENILAIAN di bawah ini sebagai panduan mutlak Anda. Semua kolom breakdown harus berisi bukti spesifik.

    RUBRIK PENILAIAN:
    Rubrik ini memberikan panduan umum untuk penilaian, namun ANDA HARUS FLEKSIBEL dalam memberikan nilai berdasarkan profil mahasiswa yang sebenarnya. Rentang nilai yang tercantum adalah PANDUAN, bukan batasan kaku. Berikan nilai yang paling sesuai dengan profil mahasiswa, meskipun tidak persis berada di rentang yang tercantum.
    
    -   Technical Expertise (0.80-0.90): Juara nasional (misal, GEMASTIK); kontributor inti proyek open-source; pengalaman kerja/magang di perusahaan teknologi ternama dengan dampak terukur. (0.60-0.79): Finalis kompetisi teknis nasional; portofolio proyek kompleks; peran teknis utama di organisasi (misal, Kelompok Studi Linux - KSL). (0.10-0.59): Pengalaman praktis dari tugas kuliah atau proyek pribadi sederhana.
    -   Scientific Writing (0.80-0.90): Pemenang/Finalis PIMNAS (dari PKM); publikasi di jurnal/konferensi. (0.60-0.79): Berpengalaman menyusun proposal PKM/LIDM yang didanai atau lolos tahap awal. (0.10-0.59): Mampu menyusun laporan tugas akhir/kerja praktik dengan baik.
    -   Problem Solving (0.80-0.90): Mampu memecahkan masalah non-standar di kompetisi (misal, soal algoritmik kompleks di GEMASTIK). (0.60-0.79): Aktif dalam studi kasus atau proyek yang menuntut analisis masalah mendalam. (0.10-0.59): Dapat menerapkan solusi standar untuk masalah yang familiar dari perkuliahan.
    -   Creativity & Innovation (0.80-0.90): Juara lomba inovasi (misal, LIDM); menghasilkan produk/ide orisinal dengan potensi pasar/dampak sosial. (0.60-0.79): Mengajukan ide-ide unik dalam proyek tim atau proposal PKM. (0.10-0.59): Mampu memberikan sentuhan kreatif pada tugas-tugas standar.
    -   Communication (0.80-0.90): Pemenang lomba debat/presentasi; presenter terbaik di konferensi/final lomba. (0.60-0.79): Aktif sebagai pembicara atau memimpin presentasi proyek dengan sangat baik. (0.10-0.59): Mampu presentasi di depan kelas dengan jelas.
    -   Teamwork & Collaboration (0.80-0.90): Memimpin proyek tim besar hingga sukses; menjadi pengurus inti BEM/HMJ lebih dari satu periode dengan pencapaian jelas. (0.60-0.79): Anggota aktif dalam beberapa proyek kelompok atau kepanitiaan dengan kontribusi positif. (0.10-0.59): Dapat bekerja sama dalam tim untuk tugas kuliah.
    -   Project Management (0.80-0.90): Berpengalaman mengelola proyek dengan metodologi seperti Agile/Scrum dari awal hingga akhir. (0.60-0.79): Pernah menjadi ketua panitia atau koordinator divisi dalam sebuah acara/proyek. (0.10-0.59): Mampu mengelola timeline tugas pribadi atau kelompok kecil.
    -   Business Acumen (0.80-0.90): Pemenang kompetisi bisnis plan; memiliki startup yang sudah berjalan. (0.60-0.79): Memiliki pemahaman baik tentang model bisnis, sering ditunjukkan dalam proposal PKM-Kewirausahaan. (0.10-0.59): Memahami konsep dasar bisnis dari mata kuliah kewirausahaan.
    -   Design Thinking (0.80-0.90): Juara lomba UI/UX; portofolio desain produk digital yang human-centered. (0.60-0.79): Mampu menerapkan proses design thinking (empathize, define, ideate, prototype, test) dalam proyek. (0.10-0.59): Memahami prinsip-prinsip dasar UI/UX.
    -   Self-Learning (0.80-0.90): Secara mandiri menguasai teknologi/framework baru yang kompleks dan menerapkannya dalam sebuah proyek besar/kompetisi. (0.60-0.79): Aktif mengikuti kursus online dan cepat beradaptasi dengan teknologi baru untuk tugas. (0.10-0.59): Menunjukkan kemauan untuk belajar hal baru ketika diwajibkan.

    CATATAN PENTING TENTANG FLEKSIBILITAS PENILAIAN:
    - Rentang nilai di atas adalah PANDUAN UMUM, bukan aturan mutlak
    - Nilai dapat diberikan di LUAR rentang yang tercantum jika profil mahasiswa menunjukkan karakteristik yang tidak sepenuhnya cocok dengan kategori tertentu
    - Contoh: Jika mahasiswa memiliki pengalaman yang lebih baik dari kategori "Sedang" tetapi belum mencapai kategori "Tinggi", berikan nilai di antara 0.75-0.79 (lebih tinggi dari rentang sedang)
    - Contoh: Jika mahasiswa memiliki kemampuan yang lebih rendah dari kategori "Rendah" minimum, berikan nilai di bawah 0.10 (misalnya 0.05-0.09)
    - Contoh: Jika mahasiswa memiliki kemampuan yang sangat luar biasa melebihi kategori "Tinggi", berikan nilai mendekati 0.90 (misalnya 0.85-0.90)
    - Fokus pada KECOCOKAN dengan profil aktual, bukan mengikuti rentang secara kaku

    PENTING UNTUK SCORING MATCHSCORE:
    - Analisis setiap detail profil mahasiswa secara mendalam dan spesifik
    - Pertimbangkan IPK, prestasi, pengalaman, minat, dan keterampilan dalam perhitungan
    - Dalam reason, jelaskan secara detail mengapa skor tersebut diberikan berdasarkan bukti konkret dari profil
    - Berikan skor yang berbeda untuk setiap mahasiswa berdasarkan profil unik mereka
    - Jika Mahasiswa Sudah memiliki Pengalaman dalam kompetisi tersebut, Kasih dia Score yang tinggi, dan jika tidak, Kasih dia Score yang rendah.jika belum pertimbangkan profil lain.
    - rentan matchscore ini dengan nilai 0.10-0.90

    Aturan : 
    1.  OUTPUT JSON KETAT: Seluruh output harus dalam satu blok JSON tunggal yang valid. Jangan ada teks di luar struktur JSON.
    2.  BERBASIS DATA & KONTEKSTUAL: Semua breakdown dan reasoning harus didasarkan pada bukti dari profil dan relevan dengan konteks mahasiswa UNG.
    3.  PENALARAN STRATEGIS: Jangan hanya mencocokkan. Jelaskan *mengapa* sebuah kompetisi adalah langkah strategis bagi mahasiswa pada tahap karir mereka saat ini.
    4.  NADA BICARA & BAHASA: Gunakan Bahasa Indonesia yang profesional, namun tetap suportif, strategis, dan memberdayakan. Posisikan diri Anda sebagai konselor ahli yang peduli dengan kesuksesan mahasiswa.
    5.  JUMLAH REKOMENDASI: WAJIB memberikan TEPAT 3 rekomendasi kompetisi yang diurutkan berdasarkan kesesuaian tertinggi (rank 1, 2, 3). Jangan lebih atau kurang dari 3 rekomendasi.
    6.  SCORING UNIK: Setiap mahasiswa HARUS memiliki skor yang berbeda untuk setiap kompetisi berdasarkan profil unik mereka. Jangan memberikan skor yang sama untuk mahasiswa yang berbeda.
    
    PROFIL_MAHASISWA:
    {studentProfile}

    DAFTAR_KOMPETISI:
    {competitions}
`;

type StudentWithRelations = Student & {
  achievements: Achievement[];
  experiences: Experience[];
  transcript: Transcript[];
};

export const createRecommendationUsecase = async (userId: number) => {
  const studentProfile = await validateStudentProfile(userId);
  const relevantCompetitions = await getRelevantCompetitions(studentProfile);
  const recommendation: RecommendationResponse = await generateRecommendation(
    studentProfile,
    relevantCompetitions
  );

  await createRecommendation({
    studentId: studentProfile.id,
    prompt: RECOMMENDATION_PROMPT_TEMPLATE,
    recommendation,
  });
};

const validateStudentProfile = async (userId: number): Promise<StudentWithRelations> => {
  await validateCompetition();

  const student = await findStudentByUserId(userId, {
    id: true,
    gpa: true,
    interests: true,
    experiences: true,
    achievements: true,
    transcript: true,
  });

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  if (
    !student.experiences?.length ||
    !student.achievements?.length ||
    !student.transcript?.length ||
    !student.gpa ||
    !student.interests?.length
  ) {
    throw customError(
      STUDENT_ERROR_RESPONSE.NOT_COMPLETED_PROFILE.code,
      STUDENT_ERROR_RESPONSE.NOT_COMPLETED_PROFILE.message,
      HttpStatusCode.BadRequest
    );
  }

  return student as StudentWithRelations;
};

const validateCompetition = async () => {
  const competition = await getCompetitions();

  if (!competition.data.length) {
    throw customError(
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.code,
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }
};

const getRelevantCompetitions = async (
  studentProfile: StudentWithRelations
): Promise<competitions[]> => {
  const profileText = generateStudentProfileText(studentProfile);
  const retriever = await getCompetitionRetriever(TOP_K_COMPETITIONS);
  const relevantDocs = await retriever.invoke(profileText);

  const competitionIds = relevantDocs
    .map((doc) => (doc.metadata as { id: number }).id)
    .filter((id): id is number => id !== undefined);

  return findManyCompetitionsByIds(competitionIds);
};

const generateStudentProfileText = (studentProfile: StudentWithRelations): string => `
    IPK: ${studentProfile.gpa || "Tidak Ada Informasi"}
    Skill: ${studentProfile.skills?.length ? studentProfile.skills.join(", ") : "Tidak Ada Informasi"}
    Minat: ${studentProfile.interests?.length ? studentProfile.interests.join(", ") : "Tidak Ada Informasi"}
    Prestasi: ${
      studentProfile.achievements?.length
        ? studentProfile.achievements
            .map((a: Achievement) => `${a.title} (${a.date.getFullYear()}) - ${a.description}`)
            .join(", ")
        : "Tidak Ada Informasi"
    }
    Pengalaman: ${
      studentProfile.experiences?.length
        ? studentProfile.experiences
            .map(
              (e: Experience) =>
                `${e.organization} - ${e.position} (${e.startDate.getFullYear()} - ${e.endDate ? e.endDate.getFullYear() : "Sekarang"}) - ${e.description}`
            )
            .join(", ")
        : "Tidak Ada Informasi"
    }
    Transkrip Nilai: ${studentProfile.transcript?.[0]?.transcriptText || "Tidak Ada Informasi"}
  `;

const generateRecommendation = async (
  studentProfile: StudentWithRelations,
  competitionsData: competitions[]
): Promise<RecommendationResponse> => {
  const model = createOpenAIClient();
  const structuredModel = model.withStructuredOutput<RecommendationResponse>(
    RecommendationResponseSchema
  );

  const prompt = new PromptTemplate({
    template: RECOMMENDATION_PROMPT_TEMPLATE,
    inputVariables: ["studentProfile", "competitions"],
  });

  const competitionContext = competitionsData
    .map(
      (comp, index) => `
    ${index + 1}. ${comp.title}
    - Deskripsi: ${comp.description}
    - Bidang: ${comp?.field?.join(", ") || "Tidak Ada Informasi"}
    - Jenis: ${comp.type || "Tidak Ada Informasi"}
    - Minimum GPA: ${comp.minGPA || "Tidak Ada Informasi"}
    - Lokasi: ${comp.location || "Tidak Ada Informasi"}
    - Penyelenggara: ${comp.organizer || "Tidak Ada Informasi"}
    - Tanggal Mulai: ${comp.startDate ? new Date(comp.startDate).toLocaleDateString("id-ID") : "Tidak Ada Informasi"}
    - Tanggal Selesai: ${comp.endDate ? new Date(comp.endDate).toLocaleDateString("id-ID") : "Tidak Ada Informasi"}
    - URL Sumber: ${comp.sourceUrl || "Tidak Ada Informasi"}
    - Mata Kuliah Relevan: ${comp.relevantCourses?.join(", ") || "Tidak Ada Informasi"}
    - Keterampilan Relevan: ${comp.relevantSkills?.join(", ") || "Tidak Ada Informasi"}
    - Persyaratan: ${comp.requirements ? JSON.stringify(comp.requirements) : "Tidak Ada Informasi"}
    - Kriteria Evaluasi: ${comp.evaluationCriteria ? JSON.stringify(comp.evaluationCriteria) : "Tidak Ada Informasi"}
  `
    )
    .join("\n");

  const chain = prompt.pipe(structuredModel);

  const result = await chain.invoke({
    studentProfile: generateStudentProfileText(studentProfile),
    competitions: competitionContext,
  });

  const competitionMap = new Map(competitionsData.map((comp) => [comp.title, comp.id]));
  result.recommendations = result.recommendations.map((rec) => ({
    ...rec,
    id: competitionMap.get(rec.competitionName) || rec.id,
  }));

  return result;
};
