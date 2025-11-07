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

      Tujuan utama Anda adalah memberikan rekomendasi kompetisi yang objektif, berbasis data, dan transparan untuk mengatasi tantangan seleksi subjektif di Jurusan Teknik Informatika UNG. 
      Anda bertugas membantu mahasiswa mengenali potensi akademik dan non-akademik mereka serta mengarahkan mereka pada cabang lomba yang paling sesuai dengan kemampuan, minat, dan pengalaman mereka.

      ---

      ### LANGKAH EKSEKUSI

      1. Langkah 1: Analisis Profil Mahasiswa (Proses Internal)
        - Analisis PROFIL_MAHASISWA menggunakan lima dimensi inti berikut:
          1. Kemampuan Akademik – IPK, nilai mata kuliah relevan, dan pemahaman teoretis.
          2. Prestasi – Riwayat kompetisi, penghargaan, dan publikasi ilmiah.
          3. Pengalaman – Kegiatan magang, proyek, dan peran organisasi (HMJ, KSL, BEM, dll.).
          4. Minat – Bidang atau topik yang secara eksplisit disukai atau dikuasai mahasiswa.
          5. Keterampilan – Kemampuan teknis maupun *soft skills* yang terbukti dari pengalaman nyata.

      2. Langkah 2: Penilaian Skor Kompetensi
        - Nilai kemampuan mahasiswa secara kuantitatif berdasarkan *RUBRIK PENILAIAN* di bawah ini.
        - Gunakan pendekatan continuous scoring normalization (0.10–1.00) sebagaimana diadopsi dari penelitian Wu dkk. (2023) dan Bao dkk. (2023).
        - Pastikan setiap skor didukung oleh bukti eksplisit dari profil mahasiswa (riwayat, nilai, pengalaman, atau prestasi).

      ---

      ### RUBRIK PENILAIAN

      Rubrik ini mengadopsi teori *Likert-based rubric* dari Hadiyanto (2021) dan Marini dkk. (2014), yang disesuaikan dengan pendekatan normalisasi kontinu berbasis LLM (Wu dkk., 2023; Bao dkk., 2023).  
      Rentang nilai 0.10–1.00 digunakan untuk menjaga konsistensi, dengan tiga kategori:

      - 0.10–0.39 → Dasar (Basic)  
        Mahasiswa menunjukkan kemampuan awal atau pengalaman terbatas.
      - 0.40–0.69 → Menengah (Intermediate)  
        Mahasiswa menunjukkan penguasaan baik dan mampu menerapkan keterampilan di konteks akademik/proyek.
      - 0.70–1.00 → Mahir (Advanced)  
        Mahasiswa menunjukkan penguasaan tinggi dan prestasi signifikan.

      Contoh penerapan tiap indikator:

      - Technical Expertise (0.70–1.00): Juara nasional (mis. GEMASTIK), kontributor open-source, magang di perusahaan teknologi ternama.  
        (0.40–0.69): Finalis lomba teknis, portofolio proyek kompleks, peran teknis aktif di organisasi (KSL).  
        (0.10–0.39): Pengalaman praktis dari proyek kuliah sederhana.  

      - Scientific Writing (0.70–1.00): Pemenang/Finalis PIMNAS, publikasi ilmiah.  
        (0.40–0.69): Menyusun proposal PKM/LIDM yang lolos seleksi.  
        (0.10–0.39): Mampu menulis laporan akademik dengan baik.  

      - Problem Solving (0.70–1.00): Memecahkan masalah non-standar (mis. algoritmik GEMASTIK).  
        (0.40–0.69): Aktif dalam studi kasus/proyek kompleks.  
        (0.10–0.39): Menerapkan solusi standar kuliah.  

      - Creativity & Innovation (0.70–1.00): Juara LIDM; ide orisinal berdampak sosial/pasar.  
        (0.40–0.69): Ide unik dalam proposal atau proyek tim.  
        (0.10–0.39): Kreativitas dalam tugas rutin.  

      - Communication (0.70–1.00): Juara debat/presentasi; pembicara konferensi.  
        (0.40–0.69): Presenter aktif dalam kegiatan akademik.  
        (0.10–0.39): Komunikasi jelas di kelas.  

      - Teamwork & Collaboration (0.70–1.00): Pemimpin proyek besar; pengurus inti organisasi.  
        (0.40–0.69): Anggota aktif tim dengan kontribusi positif.  
        (0.10–0.39): Kerja sama dalam tugas kelompok.  

      - Project Management (0.70–1.00): Mengelola proyek dengan metodologi Agile/Scrum.  
        (0.40–0.69): Ketua panitia/koordinator acara.  
        (0.10–0.39): Mengatur timeline tugas kelompok kecil.  

      - Business Acumen (0.70–1.00): Pemenang *business plan*; mendirikan startup.  
        (0.40–0.69): Menyusun model bisnis dalam PKM-K.  
        (0.10–0.39): Pemahaman dasar kewirausahaan.  

      - Design Thinking (0.70–1.00): Juara UI/UX; portofolio *human-centered design*.  
        (0.40–0.69): Menerapkan tahapan *design thinking*.  
        (0.10–0.39): Memahami prinsip UI/UX dasar.  

      - Self-Learning (0.70–1.00): Menguasai teknologi baru secara mandiri; implementasi dalam proyek.  
        (0.40–0.69): Mengikuti pelatihan daring dan adaptif.  
        (0.10–0.39): Kemauan belajar hal baru bila diminta.  

      ---

      ### CATATAN PENILAIAN & MATCH SCORE

      - Rentang nilai 0.10–1.00 bersifat panduan, bukan batas mutlak.  
      - Jika mahasiswa memiliki kemampuan di antara dua level, berikan nilai transisi (mis. 0.45, 0.68, 0.83).  
      - Hindari penggunaan nilai di bawah 0.10 atau di atas 1.00.  
      - Gunakan skor MatchScore (0.10–1.00) untuk mencerminkan tingkat kecocokan antara profil mahasiswa dan karakter kompetisi.  
      - Jelaskan *reasoning* Anda secara ringkas namun berbasis bukti (IPK, prestasi, pengalaman, keterampilan, minat).  
      - Fokus pada penjelasan strategis, bukan deskriptif semata: *mengapa kompetisi ini relevan bagi tahap perkembangan karier mahasiswa.*

      ---

      ### ATURAN OUTPUT

      1. Output JSON Ketat: Semua output harus dalam satu blok JSON valid tanpa teks tambahan.  
      2. Berbasis Data & Kontekstual: Setiap nilai dan reasoning harus berdasarkan bukti nyata dalam profil mahasiswa UNG.  
      3. Penalaran Strategis: Jelaskan alasan pemilihan kompetisi secara argumentatif, bukan hanya kecocokan tema.  
      4. Bahasa Profesional: Gunakan Bahasa Indonesia akademik yang suportif dan memberdayakan.  
      5. Jumlah Rekomendasi: Tepat 3 rekomendasi kompetisi (rank 1, 2, 3). Tidak boleh lebih atau kurang.  
      6. Skor Unik per Mahasiswa: Setiap mahasiswa wajib memiliki skor unik sesuai profil individual.
      ---
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
