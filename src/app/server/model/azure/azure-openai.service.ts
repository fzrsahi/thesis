import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { AzureChatOpenAI } from "@langchain/openai";
import { Competition } from "@prisma/client";
import { AzureOpenAI } from "openai";

import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { RecommendationResponse } from "./azure.types";
import { prisma } from "../../prisma/prisma";

const AZURE_CONFIG = {
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: "2024-04-01-preview",
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

const createChatModel = (
  options: {
    temperature?: number;
    modelName?: string;
  } = {}
) => {
  const { temperature = 0.7, modelName = "gpt-4o" } = options;

  return new AzureChatOpenAI({
    modelName,
    azureOpenAIApiKey: AZURE_CONFIG.apiKey,
    azureOpenAIApiVersion: AZURE_CONFIG.apiVersion,
    azureOpenAIEndpoint: AZURE_CONFIG.endpoint,
    deploymentName: AZURE_CONFIG.chatDeployment,
    temperature,
  });
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
) => {
  const model = createChatModel(options);

  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  const chain = prompt.pipe(model).pipe(new JsonOutputParser());

  const result = await chain.invoke({
    profile: profileData,
  });

  return result;
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
    - Bidang: ${comp?.field?.join(", ") || "Not specified"}
    - Jenis: ${comp.type}
    - Minimum GPA: ${comp.minGPA || "Not specified"}
    - Lokasi: ${comp.location || "Online"}
    - Organizer: ${comp.organizer || "TBD"}
    - Tanggal Mulai: ${comp.startDate}
    - Tanggal Selesai: ${comp.endDate}
    - Persyaratan: ${JSON.stringify(comp.requirements).replace(/{/g, "{{").replace(/}/g, "}}")}
  `
    )
    .join("\n");

  const promptTemplate = `
    Kamu adalah seorang konselor Lomba yang ahli dalam menganalisis profil mahasiswa dan memberikan rekomendasi kompetisi yang sesuai. Kamu memiliki pengalaman 10+ tahun dalam mengevaluasi kemampuan mahasiswa dan mencocokkan mereka dengan kompetisi yang tepat.
    
    PROFIL MAHASISWA:
    {profile}
    
    DAFTAR KOMPETISI YANG TERSEDIA:
    ${competitionContext}
    
    Berdasarkan profil mahasiswa dan daftar kompetisi yang tersedia, lakukan analisis mendalam dan berikan rekomendasi yang terstruktur dalam format JSON yang sesuai dengan struktur berikut:
    
    {{
      "skillsProfile": {{
        "technicalExpertise": 0.78,
        "scientificWriting": 0.65,
        "problemSolving": 0.82,
        "creativityInnovation": 0.7,
        "communication": 0.6,
        "teamworkCollaboration": 0.75,
        "projectManagement": 0.68,
        "businessAcumen": 0.5,
        "designThinking": 0.58,
        "selfLearning": 0.9
      }},
      "skillsProfileBreakdown": {{
        "technicalExpertise": "Analisis kemampuan teknis berdasarkan IPK mata kuliah teknis, proyek programming, pengalaman magang teknologi, dan prestasi lomba teknis",
        "scientificWriting": "Evaluasi berdasarkan nilai mata kuliah metodologi penelitian, pengalaman menulis paper/jurnal, prestasi karya tulis ilmiah, dan kualitas dokumentasi proyek",
        "problemSolving": "Penilaian dari prestasi olimpiade/lomba algoritma, kemampuan analisis kasus, pengalaman debugging, dan pendekatan sistematis dalam menyelesaikan tugas",
        "creativityInnovation": "Berdasarkan partisipasi hackathon, ide original dalam proyek, kemampuan berpikir out-of-the-box, dan solusi kreatif yang pernah dibuat",
        "communication": "Evaluasi dari pengalaman presentasi, kemampuan public speaking, aktivitas organisasi, dan feedback komunikasi dari pengalaman kerja/magang",
        "teamworkCollaboration": "Anal  isis dari pengalaman kerja tim, peran dalam organisasi, feedback kolaborasi, dan kemampuan koordinasi dalam proyek kelompok",
        "projectManagement": "Penilaian berdasarkan pengalaman memimpin proyek, kemampuan planning dan organizing, penggunaan tools manajemen, dan track record penyelesaian deadline",
        "businessAcumen": "Evaluasi dari pengalaman magang bisnis/startup, pemahaman model bisnis, analisis market, dan kemampuan business development",
        "designThinking": "Berdasarkan pengalaman UX/UI design, kemampuan empathy mapping, user research, dan pendekatan human-centered design",
        "selfLearning": "Analisis dari kemampuan adaptasi teknologi baru, inisiatif belajar mandiri, sertifikasi online, dan perkembangan skill dari waktu ke waktu"
      }},
      "categoryDistribution": {{
        "Teknologi": 0.7,
        "Data Science": 0.2,
        "Bisnis": 0.1
      }},
      "performanceMetrics": {{
        "participationRate": 0.75,
        "avgMatchScore": 0.78,
        "competitionSuccessRate": 0.33,
        "skillGrowth": {{
          "Skill1": "+0.15 (dari pengalaman spesifik yang disebutkan)",
          "Skill2": "+0.1 (dari pengalaman spesifik yang disebutkan)"
        }}
      }},
      "recommendations": [
        {{
          "id": 1,
          "competition": "Nama Kompetisi PERSIS dari daftar yang tersedia",
          "matchScore": 0.92,
          "matchScoreBreakdown": "Perhitungan detail: Technical skills (skor_mahasiswa/requirement_kompetisi * bobot_skill), Problem solving (skor/requirement * bobot), dst. Formula: Σ(skill_match * skill_weight) dengan penjelasan setiap komponen",
          "skillDistribution": {{
            "technicalExpertise": 0.9,
            "scientificWriting": 0.4,
            "problemSolving": 0.8,
            "creativityInnovation": 0.7,
            "communication": 0.4,
            "teamworkCollaboration": 0.6,
            "projectManagement": 0.3,
            "businessAcumen": 0.2,
            "designThinking": 0.5,
            "selfLearning": 0.8
          }},
          "skillDistributionBreakdown": {{
            "technicalExpertise": "Bobot tinggi (0.9) karena kompetisi ini membutuhkan kemampuan programming dan implementasi teknis yang tinggi sesuai dengan requirement kompetisi",
            "scientificWriting": "Bobot rendah (0.4) karena fokus kompetisi lebih ke implementasi daripada dokumentasi akademis",
            "problemSolving": "Bobot tinggi (0.8) karena kompetisi menuntut analisis kompleks dan solusi inovatif",
            "creativityInnovation": "Bobot sedang-tinggi (0.7) karena diperlukan ide original dan pendekatan baru",
            "communication": "Bobot sedang (0.4) untuk presentasi final dan pitching",
            "teamworkCollaboration": "Bobot sedang (0.6) jika kompetisi berbasis tim",
            "projectManagement": "Bobot rendah (0.3) karena waktu kompetisi relatif singkat",
            "businessAcumen": "Bobot rendah (0.2) karena fokus teknis bukan bisnis",
            "designThinking": "Bobot sedang (0.5) untuk user experience consideration",
            "selfLearning": "Bobot tinggi (0.8) karena membutuhkan adaptasi cepat dengan tools/framework baru"
          }},
          "rank": 1,
          "reason": "Kompetisi ini sangat cocok karena requirement utamanya (programming, AI/ML, problem solving) sesuai dengan kekuatan mahasiswa. GPA mahasiswa (X.XX) memenuhi minimum requirement (X.XX). Pengalaman magang di bidang teknologi dan prestasi lomba programming mendukung success rate tinggi.",
          "details": {{
            "startDate": "YYYY-MM-DD sesuai data kompetisi",
            "endDate": "YYYY-MM-DD sesuai data kompetisi", 
            "location": "Lokasi sesuai data kompetisi",
            "organizer": "Organizer sesuai data kompetisi",
            "registrationDeadline": "Estimasi 2-4 minggu sebelum startDate",
            "website": "https://kompetisi-website.com (estimasi berdasarkan organizer)"
          }},
          "preparationTips": [
            "Fokus strengthening technical implementation skills dengan practice coding intensif menggunakan tech stack yang umum digunakan di kompetisi ini",
            "Improve presentation skills dengan latihan pitching 5-10 menit, focus on clear problem-solution narrative dan demo yang menarik",
            "Study case studies dari pemenang kompetisi serupa tahun sebelumnya untuk memahami pattern dan strategi yang sukses",
            "Prepare portfolio showcase yang highlight relevant projects dan technical achievements untuk mendukung kredibilitas"
          ]
        }}
      ],
      "developmentSuggestions": [
        {{
          "type": "course",
          "title": "Nama Kursus spesifik yang address skill gap teridentifikasi",
          "platform": "Coursera/edX/Udemy/dll sesuai reputasi course",
          "link": "https://actual-course-link.com",
          "reason": "Berdasarkan analisis, skill X masih kurang 0.Y points untuk mencapai competitive level di kompetisi target. Course ini akan boost kemampuan specific skill yang dibutuhkan."
        }},
        {{
          "type": "practice",
          "title": "Specific hands-on practice recommendation",
          "platform": "GitHub/Kaggle/HackerRank/CodeForces",
          "link": "https://platform-link.com",
          "reason": "Practical experience dibutuhkan untuk mengasah implementation skills dan problem-solving speed yang crucial untuk kompetisi"
        }}
      ],
      "profileStrength": {{
        "score": 0.82,
        "calculationExplanation": "Perhitungan berdasarkan weighted formula: IPK (X.XX/4.0 * 0.25 = Y), Technical Skills (rata-rata 0.ZZ * 0.3 = A), Experience Quality (score based on relevance * 0.2 = B), Achievements (national/international weight * 0.15 = C), Growth Potential (learning velocity * 0.1 = D). Total: Y + A + B + C + D = 0.82",
        "strengths": [
          "Strong technical foundation dengan evidence konkret dari proyek X dan pengalaman Y yang demonstrate mastery level Z",
          "Proven track record dalam competitive environment dengan prestasi A di kompetisi B yang menunjukkan kemampuan perform under pressure",
          "High adaptability dan self-learning capacity yang terlihat dari rapid skill acquisition dalam timeframe X bulan"
        ],
        "weaknesses": [
          "Communication dan presentation skills perlu improvement dengan focus pada storytelling dan audience engagement untuk kompetisi yang memerlukan pitching",
          "Business understanding masih limited, perlu exposure ke market analysis dan value proposition development untuk kompetisi dengan aspek komersial"
        ]
      }}
    }}
    
    INSTRUKSI DETAIL:
    1. WAJIB menggunakan HANYA kompetisi dari daftar yang tersedia di atas - jangan buat kompetisi fiktif
    2. Pastikan semua nilai numerik dalam rentang 0-1 dengan 2 decimal precision
    3. Berikan analisis yang SPESIFIK berdasarkan data konkret dari profil mahasiswa (GPA, pengalaman, prestasi, transkrip)
    4. Match score harus calculated berdasarkan formula yang jelas: kesesuaian skill profile vs competition requirements
    5. Skill distribution untuk setiap kompetisi harus reflect ACTUAL requirements kompetisi tersebut
    6. Ranking berdasarkan kombinasi match score, feasibility (GPA requirement), dan strategic value
    7. Preparation tips harus actionable dan specific untuk jenis kompetisi yang direkomendasikan
    8. Development suggestions harus address identified skill gaps dengan resource yang real dan accessible
    9. Semua penjelasan dalam bahasa Indonesia yang professional, informatif, dan data-driven
    10. Berikan reasoning yang logical dan dapat diverifikasi berdasarkan input data

    FOKUS ANALISIS:
    - Cross-reference antara competency mahasiswa dengan specific requirements setiap kompetisi
    - Identifikasi gap analysis antara current skills vs needed skills
    - Pertimbangkan timeline kompetisi vs preparation time needed
    - Evaluasi strategic value setiap kompetisi untuk career development mahasiswa
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

export const generateRecommendation = async (profileText: string) => {
  const promptTemplate = `
    Kamu adalah seorang konselor Lomba yang ahli dalam menganalisis profil mahasiswa dan memberikan rekomendasi kompetisi yang sesuai.
    Berdasarkan profil mahasiswa berikut, berikan rekomendasi kompetisi yang terstruktur dalam format JSON:

    {profile}

    Berikan rekomendasi dalam format JSON dengan struktur yang sesuai untuk sistem rekomendasi kompetisi.
    Pastikan semua nilai numerik dalam rentang 0-1 dan semua penjelasan dalam bahasa Indonesia yang informatif.
  `;

  return generateStructuredResponse(profileText, promptTemplate);
};
