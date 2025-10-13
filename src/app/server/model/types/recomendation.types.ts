import { z } from "zod";

export const SkillsProfileItemSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(1)
    .describe("Skor kemampuan mahasiswa pada skill tertentu, rentang 0.00-1.00"),
  breakdown: z
    .string()
    .describe(
      "Penjelasan detail bagaimana skor dihitung berdasarkan bukti konkret dari profil mahasiswa"
    ),
});

export const SkillsProfileSchema = z.object({
  technicalExpertise: SkillsProfileItemSchema.describe(
    "Keahlian teknis dalam bidang studi, termasuk pemrograman, tools, dan implementasi"
  ),
  scientificWriting: SkillsProfileItemSchema.describe(
    "Kemampuan menulis karya tulis ilmiah, laporan penelitian, dan dokumentasi formal"
  ),
  problemSolving: SkillsProfileItemSchema.describe(
    "Kemampuan menganalisis masalah kompleks dan menemukan solusi efektif"
  ),
  creativityInnovation: SkillsProfileItemSchema.describe(
    "Kemampuan berpikir kreatif dan menghasilkan ide-ide inovatif"
  ),
  communication: SkillsProfileItemSchema.describe(
    "Kemampuan berkomunikasi efektif, presentasi, dan menyampaikan ide"
  ),
  teamworkCollaboration: SkillsProfileItemSchema.describe(
    "Kemampuan bekerja dalam tim, kolaborasi, dan kepemimpinan"
  ),
  projectManagement: SkillsProfileItemSchema.describe(
    "Kemampuan mengelola proyek, timeline, dan koordinasi aktivitas"
  ),
  businessAcumen: SkillsProfileItemSchema.describe(
    "Pemahaman bisnis, strategi pasar, dan aspek komersialisasi"
  ),
  designThinking: SkillsProfileItemSchema.describe(
    "Kemampuan berpikir desain, user experience, dan human-centered approach"
  ),
  selfLearning: SkillsProfileItemSchema.describe(
    "Kemampuan belajar mandiri dan adaptasi dengan teknologi/konsep baru"
  ),
});

export const OverallAssessmentSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("Daftar kekuatan utama mahasiswa berdasarkan analisis profil"),
  weaknesses: z
    .array(z.string())
    .describe("Daftar area yang perlu dikembangkan berdasarkan analisis profil"),
});

export const MatchScoreSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(1)
    .describe("Skor kesesuaian mahasiswa dengan kompetisi, rentang 0.00-1.00"),
  reason: z
    .string()
    .describe("Penjelasan logis bagaimana skor kesesuaian dihitung berdasarkan analisis skill"),
});

export const SkillRequirementItemSchema = z.object({
  weight: z
    .number()
    .min(0)
    .max(1)
    .describe("Bobot kepentingan skill untuk sukses di kompetisi, rentang 0.00-1.00"),
  breakdown: z
    .string()
    .describe("Penjelasan mengapa skill ini penting untuk kompetisi dan seberapa krusial perannya"),
});

export const SkillRequirementsSchema = z.object({
  technicalExpertise: SkillRequirementItemSchema.describe(
    "Kebutuhan keahlian teknis untuk kompetisi"
  ),
  scientificWriting: SkillRequirementItemSchema.describe(
    "Kebutuhan kemampuan penulisan ilmiah untuk kompetisi"
  ),
  problemSolving: SkillRequirementItemSchema.describe(
    "Kebutuhan kemampuan pemecahan masalah untuk kompetisi"
  ),
  creativityInnovation: SkillRequirementItemSchema.describe(
    "Kebutuhan kreativitas dan inovasi untuk kompetisi"
  ),
  communication: SkillRequirementItemSchema.describe(
    "Kebutuhan kemampuan komunikasi untuk kompetisi"
  ),
  teamworkCollaboration: SkillRequirementItemSchema.describe(
    "Kebutuhan kemampuan kerja tim untuk kompetisi"
  ),
  projectManagement: SkillRequirementItemSchema.describe(
    "Kebutuhan kemampuan manajemen proyek untuk kompetisi"
  ),
  businessAcumen: SkillRequirementItemSchema.describe("Kebutuhan pemahaman bisnis untuk kompetisi"),
  designThinking: SkillRequirementItemSchema.describe(
    "Kebutuhan kemampuan design thinking untuk kompetisi"
  ),
  selfLearning: SkillRequirementItemSchema.describe(
    "Kebutuhan kemampuan belajar mandiri untuk kompetisi"
  ),
});

export const ReasoningSchema = z.object({
  summary: z
    .string()
    .describe("Ringkasan mengapa kompetisi ini cocok atau tidak cocok untuk mahasiswa"),
  pros: z.array(z.string()).describe("Daftar keunggulan dan kesesuaian mahasiswa dengan kompetisi"),
  cons: z
    .array(z.string())
    .describe("Daftar tantangan atau kelemahan yang mungkin dihadapi mahasiswa"),
});

export const RecommendationSchema = z.object({
  id: z
    .number()
    .describe("ID kompetisi sesuai dengan urutan dalam daftar kompetisi yang diberikan"),
  competitionName: z.string().describe("Nama kompetisi yang direkomendasikan"),
  rank: z.number().describe("Peringkat rekomendasi berdasarkan kesesuaian dan nilai strategis"),
  matchScore: MatchScoreSchema.describe("Skor dan alasan kesesuaian mahasiswa dengan kompetisi"),
  skillRequirements: SkillRequirementsSchema.describe(
    "Analisis kebutuhan skill untuk kompetisi ini"
  ),
  reasoning: ReasoningSchema.describe("Analisis mendalam mengapa kompetisi ini direkomendasikan"),
  keyFactors: z
    .array(z.string())
    .nullable()
    .describe("Faktor-faktor kunci yang menentukan kesuksesan di kompetisi ini"),
  preparationTips: z
    .array(z.string())
    .nullable()
    .describe("Tips konkret untuk mempersiapkan diri mengikuti kompetisi"),
});

export const DevelopmentSuggestionSchema = z.object({
  type: z.string().describe("Jenis saran pengembangan: course, practice, certification, dll"),
  title: z.string().describe("Judul atau nama sumber daya pengembangan"),
  link: z.string().describe("URL link ke sumber daya yang disarankan"),
  reason: z
    .string()
    .describe("Alasan mengapa sumber daya ini penting untuk pengembangan mahasiswa"),
});

export const StudentProfileSchema = z.object({
  name: z.string().describe("Nama lengkap mahasiswa"),
  email: z.string().email().describe("Email mahasiswa"),
  studentId: z.string().nullable().describe("Nomor Induk Mahasiswa (NIM)"),
  entryYear: z.number().describe("Tahun masuk mahasiswa"),
  gpa: z.string().nullable().describe("Indeks Prestasi Kumulatif (IPK)"),
  studyProgram: z.string().describe("Program studi mahasiswa"),
});

export const RecommendationResponseSchema = z.object({
  studentProfile: StudentProfileSchema.describe("Profil dasar mahasiswa"),
  studentSummary: z
    .string()
    .describe("Ringkasan profil mahasiswa yang mencakup kekuatan utama dan karakteristik"),
  skillsProfile: SkillsProfileSchema.describe(
    "Penilaian detail kemampuan mahasiswa di 10 area skill utama"
  ),
  overallAssessment: OverallAssessmentSchema.describe(
    "Penilaian keseluruhan kekuatan dan kelemahan mahasiswa"
  ),
  recommendations: z
    .array(RecommendationSchema)
    .describe("Daftar rekomendasi kompetisi yang diurutkan berdasarkan kesesuaian"),
  developmentSuggestions: z
    .array(DevelopmentSuggestionSchema)
    .describe("Saran sumber daya untuk mengembangkan area yang lemah"),
});

export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;

export type SkillsProfileKey = keyof z.infer<typeof SkillsProfileSchema>;

export type SkillsProfileEntry = {
  skillName: SkillsProfileKey;
  score: number;
  breakdown: string;
};
