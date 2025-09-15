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
    3.  Langkah 3: Analisis Kompetisi & Pencocokan Strategis: Untuk setiap kompetisi di DAFTAR_KOMPETISI, terutama untuk kompetisi penting seperti GEMASTIK dan LIDM, tentukan keterampilan yang dibutuhkan dan bobot kepentingannya (skillRequirements.weight). Kemudian, hasilkan matchScore holistik dan pering

    RUBRIK PENILAIAN:
    -   Technical Expertise (0.85-1.0): Juara nasional (misal, GEMASTIK); kontributor inti proyek open-source; pengalaman kerja/magang di perusahaan teknologi ternama dengan dampak terukur. (0.70-0.84): Finalis kompetisi teknis nasional; portofolio proyek kompleks; peran teknis utama di organisasi (misal, Kelompok Studi Linux - KSL). (0.50-0.69): Pengalaman praktis dari tugas kuliah atau proyek pribadi sederhana.
    -   Scientific Writing (0.85-1.0): Pemenang/Finalis PIMNAS (dari PKM); publikasi di jurnal/konferensi. (0.70-0.84): Berpengalaman menyusun proposal PKM/LIDM yang didanai atau lolos tahap awal. (0.50-0.69): Mampu menyusun laporan tugas akhir/kerja praktik dengan baik.
    -   Problem Solving (0.85-1.0): Mampu memecahkan masalah non-standar di kompetisi (misal, soal algoritmik kompleks di GEMASTIK). (0.70-0.84): Aktif dalam studi kasus atau proyek yang menuntut analisis masalah mendalam. (0.50-0.69): Dapat menerapkan solusi standar untuk masalah yang familiar dari perkuliahan.
    -   Creativity & Innovation (0.85-1.0): Juara lomba inovasi (misal, LIDM); menghasilkan produk/ide orisinal dengan potensi pasar/dampak sosial. (0.70-0.84): Mengajukan ide-ide unik dalam proyek tim atau proposal PKM. (0.50-0.69): Mampu memberikan sentuhan kreatif pada tugas-tugas standar.
    -   Communication (0.85-1.0): Pemenang lomba debat/presentasi; presenter terbaik di konferensi/final lomba. (0.70-0.84): Aktif sebagai pembicara atau memimpin presentasi proyek dengan sangat baik. (0.50-0.69): Mampu presentasi di depan kelas dengan jelas.
    -   Teamwork & Collaboration (0.85-1.0): Memimpin proyek tim besar hingga sukses; menjadi pengurus inti BEM/HMJ lebih dari satu periode dengan pencapaian jelas. (0.70-0.84): Anggota aktif dalam beberapa proyek kelompok atau kepanitiaan dengan kontribusi positif. (0.50-0.69): Dapat bekerja sama dalam tim untuk tugas kuliah.
    -   Project Management (0.85-1.0): Berpengalaman mengelola proyek dengan metodologi seperti Agile/Scrum dari awal hingga akhir. (0.70-0.84): Pernah menjadi ketua panitia atau koordinator divisi dalam sebuah acara/proyek. (0.50-0.69): Mampu mengelola timeline tugas pribadi atau kelompok kecil.
    -   Business Acumen (0.85-1.0): Pemenang kompetisi bisnis plan; memiliki startup yang sudah berjalan. (0.70-0.84): Memiliki pemahaman baik tentang model bisnis, sering ditunjukkan dalam proposal PKM-Kewirausahaan. (0.50-0.69): Memahami konsep dasar bisnis dari mata kuliah kewirausahaan.
    -   Design Thinking (0.85-1.0): Juara lomba UI/UX; portofolio desain produk digital yang human-centered. (0.70-0.84): Mampu menerapkan proses design thinking (empathize, define, ideate, prototype, test) dalam proyek. (0.50-0.69): Memahami prinsip-prinsip dasar UI/UX.
    -   Self-Learning (0.85-1.0): Secara mandiri menguasai teknologi/framework baru yang kompleks dan menerapkannya dalam sebuah proyek besar/kompetisi. (0.70-0.84): Aktif mengikuti kursus online dan cepat beradaptasi dengan teknologi baru untuk tugas. (0.50-0.69): Menunjukkan kemauan untuk belajar hal baru ketika diwajibkan.

    Aturan : 
    1.  OUTPUT JSON KETAT: Seluruh output harus dalam satu blok JSON tunggal yang valid. Jangan ada teks di luar struktur JSON.
    2.  BERBASIS DATA & KONTEKSTUAL: Semua breakdown dan reasoning harus didasarkan pada bukti dari profil dan relevan dengan konteks mahasiswa UNG.
    3.  PENALARAN STRATEGIS: Jangan hanya mencocokkan. Jelaskan *mengapa* sebuah kompetisi adalah langkah strategis bagi mahasiswa pada tahap karir mereka saat ini.
    4.  NADA BICARA & BAHASA: Gunakan Bahasa Indonesia yang profesional, namun tetap suportif, strategis, dan memberdayakan. Posisikan diri Anda sebagai konselor ahli yang peduli dengan kesuksesan mahasiswa.

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

  if (!competition.length) {
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
  const retriever = getCompetitionRetriever(TOP_K_COMPETITIONS);
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
