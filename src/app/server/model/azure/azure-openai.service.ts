import { AzureChatOpenAI } from "@langchain/openai";
import { Competition } from "@prisma/client";
import { AzureOpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { RecommendationResponse, RecommendationResponseSchema } from "./azure.types";
import { prisma } from "../../prisma/prisma";
import { customError } from "../../utils/error/custom-error";
import { RECOMMENDATION_ERROR_RESPONSE } from "../../recommendation/recomendation.error";
import { HttpStatusCode } from "axios";

const AZURE_CONFIG = {
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: "2024-08-01-preview",
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  chatDeployment: "gpt-4o",
};

const AZURE_EMBEDDING_CONFIG = {
  apiKey: process.env.AZURE_EMBEDDINGS_API_KEY!,
  endpoint: process.env.AZURE_EMBEDDINGS_ENDPOINT!,
  deploymentName: "text-embedding-3-small",
  apiInstanceName: "text-embedding-3-small",
  apiVersion: "2024-02-01",
};

const createOpenAIClient = () => {
  const options = {
    endpoint: AZURE_CONFIG.endpoint,
    apiKey: AZURE_CONFIG.apiKey,
    deployment: AZURE_CONFIG.chatDeployment,
    apiVersion: AZURE_CONFIG.apiVersion,
  };

  return new AzureOpenAI(options);
};

const createEmbeddingClient = () =>
  new AzureOpenAI({
    apiKey: AZURE_EMBEDDING_CONFIG.apiKey,
    apiVersion: AZURE_EMBEDDING_CONFIG.apiVersion,
    endpoint: AZURE_EMBEDDING_CONFIG.endpoint,
  });

export const sendPrompt = async (
  prompt: {
    systemMessage?: string;
    userMessage: string;
  },
  model = "gpt-4o",
  responseFormat: "text" | "json_object" = "text"
) => {
  const client = createOpenAIClient();

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt.systemMessage || "You are a helpful assistant.",
      },
      {
        role: "user",
        content: prompt.userMessage,
      },
    ],
    model,
    response_format: { type: responseFormat },
  });

  return response.choices[0].message.content;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const embeddings = createEmbeddingClient();

  const vector = await embeddings.embeddings.create({
    model: AZURE_EMBEDDING_CONFIG.deploymentName,
    input: text,
  });

  return vector.data[0].embedding;
};

export const generateStructuredResponse = async (
  profileData: string,
  promptTemplate: string,
  options: {
    temperature?: number;
    modelName?: string;
  } = {}
): Promise<RecommendationResponse> => {
  const client = createOpenAIClient();
  const { temperature = 0.7, modelName = "gpt-4o" } = options;

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Kamu adalah seorang konselor Lomba yang ahli dalam menganalisis profil mahasiswa dan memberikan rekomendasi kompetisi yang sesuai. Kamu memiliki pengalaman 10+ tahun dalam mengevaluasi kemampuan mahasiswa dan mencocokkan mereka dengan kompetisi yang tepat.",
      },
      {
        role: "user",
        content: promptTemplate.replace("{profile}", profileData),
      },
    ],
    model: modelName,
    temperature,
    response_format: zodResponseFormat(RecommendationResponseSchema, "recommendation"),
  });

  const parsedResponse = response.choices[0].message.content;
  if (!parsedResponse) {
    throw customError(
      RECOMMENDATION_ERROR_RESPONSE.NO_RESPONSE_CONTENT.code,
      RECOMMENDATION_ERROR_RESPONSE.NO_RESPONSE_CONTENT.message,
      HttpStatusCode.InternalServerError
    );
  }

  return JSON.parse(parsedResponse) as RecommendationResponse;
};

export const findSimilarCompetitions = async (
  queryText: string,
  limit: number = 5,
  threshold: number = 0.5
) => {
  const queryVector = await generateEmbedding(queryText);
  const similarCompetitions: unknown[] = await prisma.$queryRaw`
      SELECT 
        e.metadata,
        e.vector <=> ${queryVector}::vector as distance,
        1 - (e.vector <=> ${queryVector}::vector) as similarity
      FROM embeddings e
      WHERE e.metadata->>'type' = 'competition'
      AND 1 - (e.vector <=> ${queryVector}::vector) > ${threshold}
      ORDER BY e.vector <=> ${queryVector}::vector
      LIMIT ${limit}
    `;

  return similarCompetitions || [];
};

export const generateRecommendationWithCompetitions = async (
  profileText: string,
  competitions: Competition[]
): Promise<{ result: RecommendationResponse; prompt: string }> => {
  const competitionContext = competitions
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

  const promptTemplate = `  
    PROFIL MAHASISWA:
    {profile}
    
    DAFTAR KOMPETISI YANG TERSEDIA:
    ${competitionContext}
    
    Berdasarkan profil mahasiswa dan daftar kompetisi yang tersedia, lakukan analisis mendalam dan berikan rekomendasi yang terstruktur sesuai dengan skema JSON yang telah ditentukan.
    
    INSTRUKSI & RUBRIK
    1. WAJIB JSON: Output harus sesuai dengan skema JSON yang telah ditentukan.
    2. DATA-DRIVEN: Semua analisis harus berdasarkan bukti konkret dari profil.
    3. RENTANG SKOR: Semua score dan weight harus antara 0.00 dan 1.00.
    4. PENILAIAN skillsProfile: Gunakan rubrik penilaian sebagai panduan utama.
    5. BOBOT skillRequirements: Weight harus akurat merefleksikan pentingnya skill untuk sukses di kompetisi.
    6. matchScore.score: Berikan estimasi logis; jangan hitung matematis.
    7. PERAN PENJELASAN: Semua penjelasan harus informatif dan berbasis data.
    8. RANKING: Rank harus berdasarkan matchScore dan nilai strategis kompetisi.
    9. SARAN PENGEMBANGAN: developmentSuggestions harus menargetkan weaknesses dan memberikan link ke sumber daya nyata.
    
    RUBRIK PENILAIAN (Panduan untuk skillsProfile)
    Technical Expertise:
    - Ahli (0.85-1.0): Juara lomba teknis nasional atau magang di perusahaan teknologi ternama dengan kontribusi jelas.
    - Mahir (0.70-0.84): Finalis lomba teknis, magang, atau memiliki portofolio proyek kompleks.
    - Cukup (0.50-0.69): Pengalaman praktis terbatas pada tugas kuliah.
    
    Teamwork & Collaboration:
    - Ahli (0.85-1.0): Memimpin proyek tim atau menjadi pengurus inti organisasi lebih dari satu periode.
    - Mahir (0.70-0.84): Aktif dalam beberapa proyek kelompok atau anggota aktif organisasi.
    - Cukup (0.50-0.69): Dapat bekerja dalam tim untuk tugas kuliah.
  `;

  const result = await generateStructuredResponse(profileText, promptTemplate);

  return { result, prompt: promptTemplate };
};

export const generateCompetitionEmbedding = async (competitionData: CreateCompetitionPayload) => {
  const competitionTextParts = [
    `Title: ${competitionData.title}`,
    `Description: ${competitionData.description}`,
    `Fields: ${competitionData.field.join(", ")}`,
    `Type: ${competitionData.type}`,
    `Source URL: ${competitionData.sourceUrl}`,
    `Relevant Courses: ${competitionData.relevantCourses.join(", ")}`,
    `Relevant Skills: ${competitionData.relevantSkills.join(", ")}`,
  ];

  if (competitionData.minGPA) {
    competitionTextParts.push(`Minimal IPK: ${competitionData.minGPA}`);
  }

  if (competitionData.requirements) {
    const requirementsText = [];
    if (competitionData.requirements.teamComposition) {
      requirementsText.push(`Komposisi Tim: ${competitionData.requirements.teamComposition}`);
    }
    if (competitionData.requirements.originality) {
      requirementsText.push(`Kreativitas: ${competitionData.requirements.originality}`);
    }
    if (competitionData.requirements.other) {
      requirementsText.push(`Lainnya: ${competitionData.requirements.other}`);
    }
    if (requirementsText.length > 0) {
      competitionTextParts.push(`Persyaratan: ${requirementsText.join(", ")}`);
    }
  }

  if (competitionData.location) {
    competitionTextParts.push(`Lokasi: ${competitionData.location}`);
  }

  if (competitionData.organizer) {
    competitionTextParts.push(`Organizer: ${competitionData.organizer}`);
  }

  if (competitionData.startDate) {
    competitionTextParts.push(`Tanggal Mulai: ${competitionData.startDate}`);
  }

  if (competitionData.endDate) {
    competitionTextParts.push(`Tanggal Selesai: ${competitionData.endDate}`);
  }

  if (competitionData.evaluationCriteria) {
    const criteriaText = [];
    if (competitionData.evaluationCriteria.preliminaryRound) {
      criteriaText.push(`Babak Penyisihan: ${competitionData.evaluationCriteria.preliminaryRound}`);
    }
    if (competitionData.evaluationCriteria.finalRound) {
      criteriaText.push(`Babak Final: ${competitionData.evaluationCriteria.finalRound}`);
    }
    if (competitionData.evaluationCriteria.other) {
      criteriaText.push(`Lainnya: ${competitionData.evaluationCriteria.other}`);
    }
    if (criteriaText.length > 0) {
      competitionTextParts.push(`Kriteria Evaluasi: ${criteriaText.join(", ")}`);
    }
  }

  if (competitionData.competitionStatistics) {
    const statisticsText = [];
    if (competitionData.competitionStatistics.summary) {
      statisticsText.push(`Ringkasan: ${competitionData.competitionStatistics.summary}`);
    }
    if (
      competitionData.competitionStatistics.totalApplicantsPastYear &&
      competitionData.competitionStatistics.totalApplicantsPastYear.length > 0
    ) {
      const applicantsText = competitionData.competitionStatistics.totalApplicantsPastYear
        .filter((item) => item.count !== null && item.year !== null)
        .map((item) => `${item.year}: ${item.count} applicants`)
        .join(", ");
      if (applicantsText) {
        statisticsText.push(`Total Pendaftar: ${applicantsText}`);
      }
    }
    if (
      competitionData.competitionStatistics.pastUngParticipants &&
      competitionData.competitionStatistics.pastUngParticipants.length > 0
    ) {
      const ungParticipantsText = competitionData.competitionStatistics.pastUngParticipants
        .map((item) => `${item.year}: ${item.name} (${item.count} members)`)
        .join(", ");
      statisticsText.push(
        `Peserta Mahasiswa Universitas Negeri Gorontalo sebelumnya: ${ungParticipantsText}`
      );
    }
    if (statisticsText.length > 0) {
      competitionTextParts.push(`Statistik Kompetisi: ${statisticsText.join("; ")}`);
    }
  }

  const competitionText = competitionTextParts.join("\n    ");

  return generateEmbedding(competitionText);
};
