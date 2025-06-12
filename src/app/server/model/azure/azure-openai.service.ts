import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { AzureChatOpenAI } from "@langchain/openai";
import { Competition } from "@prisma/client";
import { AzureOpenAI } from "openai";

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

export const sendPrompt = async (prompt: string, model = "gpt-4o") => {
  const client = createOpenAIClient();

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model,
  });

  return response.choices[0].message.content;
};

export const sendChatCompletion = async (
  userMessage: string,
  systemMessage = "You are a helpful assistant.",
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: "text" | "json_object";
  } = {}
) => {
  const client = createOpenAIClient();

  const {
    model = "gpt-4o",
    temperature = 0.7,
    maxTokens = 4000,
    responseFormat = "json_object",
  } = options;

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    model,
    temperature,
    max_tokens: maxTokens,
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
    - Description: ${comp.description}
    - Fields: ${comp?.field?.join(", ") || "Not specified"}
    - Type: ${comp.type}
    - Min GPA: ${comp.minGPA || "Not specified"}
    - Location: ${comp.location || "Online"}
    - Organizer: ${comp.organizer || "TBD"}
    - Start Date: ${comp.startDate}
    - End Date: ${comp.endDate}
    - Requirements: ${JSON.stringify(comp.requirements).replace(/{/g, "{{").replace(/}/g, "}}")}
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
      "skills_profile": {{
        "technical_expertise": 0.78,
        "scientific_writing": 0.65,
        "problem_solving": 0.82,
        "creativity_innovation": 0.7,
        "communication": 0.6,
        "teamwork_collaboration": 0.75,
        "project_management": 0.68,
        "business_acumen": 0.5,
        "design_thinking": 0.58,
        "self_learning": 0.9
      }},
      "skills_profile_breakdown": {{
        "technical_expertise": "Analisis kemampuan teknis berdasarkan IPK mata kuliah teknis, proyek programming, pengalaman magang teknologi, dan prestasi lomba teknis",
        "scientific_writing": "Evaluasi berdasarkan nilai mata kuliah metodologi penelitian, pengalaman menulis paper/jurnal, prestasi karya tulis ilmiah, dan kualitas dokumentasi proyek",
        "problem_solving": "Penilaian dari prestasi olimpiade/lomba algoritma, kemampuan analisis kasus, pengalaman debugging, dan pendekatan sistematis dalam menyelesaikan tugas",
        "creativity_innovation": "Berdasarkan partisipasi hackathon, ide original dalam proyek, kemampuan berpikir out-of-the-box, dan solusi kreatif yang pernah dibuat",
        "communication": "Evaluasi dari pengalaman presentasi, kemampuan public speaking, aktivitas organisasi, dan feedback komunikasi dari pengalaman kerja/magang",
        "teamwork_collaboration": "Analisis dari pengalaman kerja tim, peran dalam organisasi, feedback kolaborasi, dan kemampuan koordinasi dalam proyek kelompok",
        "project_management": "Penilaian berdasarkan pengalaman memimpin proyek, kemampuan planning dan organizing, penggunaan tools manajemen, dan track record penyelesaian deadline",
        "business_acumen": "Evaluasi dari pengalaman magang bisnis/startup, pemahaman model bisnis, analisis market, dan kemampuan business development",
        "design_thinking": "Berdasarkan pengalaman UX/UI design, kemampuan empathy mapping, user research, dan pendekatan human-centered design",
        "self_learning": "Analisis dari kemampuan adaptasi teknologi baru, inisiatif belajar mandiri, sertifikasi online, dan perkembangan skill dari waktu ke waktu"
      }},
      "category_distribution": {{
        "Teknologi": 0.7,
        "Data Science": 0.2,
        "Bisnis": 0.1
      }},
      "performance_metrics": {{
        "participation_rate": 0.75,
        "avg_match_score": 0.78,
        "competition_success_rate": 0.33,
        "skill_growth": {{
          "Skill1": "+0.15 (dari pengalaman spesifik yang disebutkan)",
          "Skill2": "+0.1 (dari pengalaman spesifik yang disebutkan)"
        }}
      }},
      "recommendations": [
        {{
          "id": 1,
          "competition": "Nama Kompetisi PERSIS dari daftar yang tersedia",
          "match_score": 0.92,
          "match_score_breakdown": "Perhitungan detail: Technical skills (skor_mahasiswa/requirement_kompetisi * bobot_skill), Problem solving (skor/requirement * bobot), dst. Formula: Σ(skill_match * skill_weight) dengan penjelasan setiap komponen",
          "skill_distribution": {{
            "technical_expertise": 0.9,
            "scientific_writing": 0.4,
            "problem_solving": 0.8,
            "creativity_innovation": 0.7,
            "communication": 0.4,
            "teamwork_collaboration": 0.6,
            "project_management": 0.3,
            "business_acumen": 0.2,
            "design_thinking": 0.5,
            "self_learning": 0.8
          }},
          "skill_distribution_breakdown": {{
            "technical_expertise": "Bobot tinggi (0.9) karena kompetisi ini membutuhkan kemampuan programming dan implementasi teknis yang tinggi sesuai dengan requirement kompetisi",
            "scientific_writing": "Bobot rendah (0.4) karena fokus kompetisi lebih ke implementasi daripada dokumentasi akademis",
            "problem_solving": "Bobot tinggi (0.8) karena kompetisi menuntut analisis kompleks dan solusi inovatif",
            "creativity_innovation": "Bobot sedang-tinggi (0.7) karena diperlukan ide original dan pendekatan baru",
            "communication": "Bobot sedang (0.4) untuk presentasi final dan pitching",
            "teamwork_collaboration": "Bobot sedang (0.6) jika kompetisi berbasis tim",
            "project_management": "Bobot rendah (0.3) karena waktu kompetisi relatif singkat",
            "business_acumen": "Bobot rendah (0.2) karena fokus teknis bukan bisnis",
            "design_thinking": "Bobot sedang (0.5) untuk user experience consideration",
            "self_learning": "Bobot tinggi (0.8) karena membutuhkan adaptasi cepat dengan tools/framework baru"
          }},
          "rank": 1,
          "reason": "Kompetisi ini sangat cocok karena requirement utamanya (programming, AI/ML, problem solving) sesuai dengan kekuatan mahasiswa. GPA mahasiswa (X.XX) memenuhi minimum requirement (X.XX). Pengalaman magang di bidang teknologi dan prestasi lomba programming mendukung success rate tinggi.",
          "details": {{
            "startDate": "YYYY-MM-DD sesuai data kompetisi",
            "endDate": "YYYY-MM-DD sesuai data kompetisi", 
            "location": "Lokasi sesuai data kompetisi",
            "organizer": "Organizer sesuai data kompetisi",
            "registration_deadline": "Estimasi 2-4 minggu sebelum startDate",
            "website": "https://kompetisi-website.com (estimasi berdasarkan organizer)"
          }},
          "preparation_tips": [
            "Fokus strengthening technical implementation skills dengan practice coding intensif menggunakan tech stack yang umum digunakan di kompetisi ini",
            "Improve presentation skills dengan latihan pitching 5-10 menit, focus on clear problem-solution narrative dan demo yang menarik",
            "Study case studies dari pemenang kompetisi serupa tahun sebelumnya untuk memahami pattern dan strategi yang sukses",
            "Prepare portfolio showcase yang highlight relevant projects dan technical achievements untuk mendukung kredibilitas"
          ]
        }}
      ],
      "development_suggestions": [
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
      "profile_strength": {{
        "score": 0.82,
        "calculation_explanation": "Perhitungan berdasarkan weighted formula: IPK (X.XX/4.0 * 0.25 = Y), Technical Skills (rata-rata 0.ZZ * 0.3 = A), Experience Quality (score based on relevance * 0.2 = B), Achievements (national/international weight * 0.15 = C), Growth Potential (learning velocity * 0.1 = D). Total: Y + A + B + C + D = 0.82",
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

export const generateCompetitionEmbedding = async (competitionData: Competition) => {
  const competitionText = `
    Title: ${competitionData.title}
    Description: ${competitionData.description}
    Fields: ${competitionData.field.join(", ")}
    Type: ${competitionData.type}
    Minimum GPA: ${competitionData.minGPA || "Not specified"}
    Requirements: ${JSON.stringify(competitionData.requirements)}
    Location: ${competitionData.location || "Not specified"}
    Organizer: ${competitionData.organizer || "Not specified"}
  `.trim();

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
