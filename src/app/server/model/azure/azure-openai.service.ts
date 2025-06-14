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
    - Persyaratan: ${comp.requirements ? JSON.stringify(comp.requirements).replace(/{/g, "{{").replace(/}/g, "}}") : "Tidak Ada Informasi"}
    - Kriteria Evaluasi: ${comp.evaluationCriteria ? JSON.stringify(comp.evaluationCriteria).replace(/{/g, "{{").replace(/}/g, "}}") : "Tidak Ada Informasi"}
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
          "studentSummary": "Mahasiswa dengan profil teknis yang sangat kuat di bidang pengembangan web, didukung oleh pengalaman magang, prestasi, dan IPK yang tinggi. Memiliki kemampuan kolaborasi dan belajar mandiri yang luar biasa, dengan area pengembangan di bidang bisnis dan desain.",
          "skillsProfile": {{
            "technicalExpertise": {{
              "score": 0.85,
              "breakdown": "Skor tinggi didasarkan pada IPK 3.9 di mata kuliah pemrograman, pengalaman magang sebagai Backend Developer, dan portofolio proyek di GitHub."
            }},
            "scientificWriting": {{
              "score": 0.60,
              "breakdown": "Skor sedang, memiliki pengalaman membuat laporan proyek akhir namun belum pernah mempublikasikan karya tulis ilmiah."
            }},
            "problemSolving": {{
              "score": 0.80,
              "breakdown": "Skor tinggi, terbukti dari keberhasilan menjuarai kompetisi algoritma tingkat universitas dan kemampuan debugging yang efisien selama magang."
            }},
            "creativityInnovation": {{
              "score": 0.75,
              "breakdown": "Skor cukup tinggi, aktif memberikan ide-ide baru dalam proyek kelompok dan pernah mengikuti hackathon."
            }},
            "communication": {{
              "score": 0.70,
              "breakdown": "Skor cukup baik, terbiasa melakukan presentasi di kelas dan aktif dalam diskusi organisasi Himpunan Mahasiswa."
            }},
            "teamworkCollaboration": {{
              "score": 0.90,
              "breakdown": "Skor sangat tinggi, memiliki pengalaman memimpin tim dalam proyek kelompok dan mendapatkan feedback positif dari rekan kerja saat magang."
            }},
            "projectManagement": {{
              "score": 0.75,
              "breakdown": "Skor cukup tinggi, berpengalaman mengelola timeline proyek kecil menggunakan Trello dan Notion di organisasi."
            }},
            "businessAcumen": {{
              "score": 0.50,
              "breakdown": "Skor rendah, belum memiliki pengalaman atau mata kuliah yang fokus pada aspek bisnis dan kewirausahaan."
            }},
            "designThinking": {{
              "score": 0.65,
              "breakdown": "Skor sedang, memahami konsep dasar UI/UX dari mata kuliah Interaksi Manusia & Komputer, namun portofolio desain masih minim."
            }},
            "selfLearning": {{
              "score": 0.85,
              "breakdown": "Skor tinggi, dibuktikan dengan perolehan beberapa sertifikasi online di bidang cloud computing dan AI."
            }}
          }},
          "overallAssessment": {{
            "strengths": [
              "Keahlian teknis dan pemecahan masalah yang solid, dibuktikan dengan pengalaman magang dan prestasi lomba algoritma.",
              "Kemampuan kolaborasi dan kepemimpinan tim yang sangat baik, terlihat dari peran aktif di organisasi.",
              "Inisiatif tinggi dalam belajar mandiri yang ditunjukkan oleh perolehan sertifikasi di luar kurikulum."
            ],
            "weaknesses": [
              "Pemahaman bisnis dan aspek komersialisasi produk masih sangat terbatas.",
              "Keterampilan penulisan karya tulis ilmiah formal belum teruji untuk standar kompetisi nasional.",
              "Pengalaman praktis dalam desain antarmuka (UI/UX) perlu diperdalam."
            ]
          }},
          "recommendations": [
            {{
              "id": 4,
              "competitionName": "Mobile App Development Hackathon",
              "rank": 1,
              "matchScore": {{
                "score": 0.85,
                "reason": "Skor dihitung dari kesesuaian tinggi pada 6 dari 10 skill yang paling krusial (bobot >= 0.8), terutama pada 'technicalExpertise', 'teamwork', dan 'selfLearning'."
              }},
              "skillRequirements": {{
                "technicalExpertise": {{ "weight": 0.9, "breakdown": "Inti dari hackathon adalah membuat prototipe fungsional dalam waktu singkat." }},
                "scientificWriting": {{ "weight": 0.2, "breakdown": "Tidak ada tuntutan laporan ilmiah, fokus pada produk." }},
                "problemSolving": {{ "weight": 0.8, "breakdown": "Dibutuhkan untuk mengatasi tantangan teknis tak terduga." }},
                "creativityInnovation": {{ "weight": 0.9, "breakdown": "Ide orisinal dan solusi unik menjadi penentu kemenangan." }},
                "communication": {{ "weight": 0.7, "breakdown": "Penting untuk presentasi/pitching di akhir acara." }},
                "teamworkCollaboration": {{ "weight": 0.9, "breakdown": "Hackathon adalah kerja tim yang sangat intensif." }},
                "projectManagement": {{ "weight": 0.7, "breakdown": "Dibutuhkan untuk mengelola waktu 24-48 jam secara efektif." }},
                "businessAcumen": {{ "weight": 0.4, "breakdown": "Menjadi nilai tambah, tapi bukan fokus utama." }},
                "designThinking": {{ "weight": 0.8, "breakdown": "Penting untuk menciptakan aplikasi yang intuitif dan user-friendly." }},
                "selfLearning": {{ "weight": 0.9, "breakdown": "Krusial untuk adaptasi cepat dengan API atau teknologi baru." }}
              }},
              "reasoning": {{
                "summary": "Kompetisi ini adalah 'perfect match' untuk memaksimalkan kekuatan teknis dan kolaborasi yang sudah Anda miliki dalam lingkungan yang cepat dan inovatif.",
                "pros": [
                  "Pengalaman magang sebagai Backend Developer sangat relevan untuk membangun fungsionalitas aplikasi.",
                  "Skor 'teamworkCollaboration' yang sangat tinggi (0.90) adalah aset utama untuk sukses dalam format tim intensif.",
                  "Kemampuan 'selfLearning' (0.85) memastikan Anda dapat cepat menguasai tool-tool baru yang dibutuhkan."
                ],
                "cons": [
                  "Keterampilan 'designThinking' (0.65) masih menjadi celah dibandingkan kebutuhan kompetisi yang tinggi (bobot 0.8)."
                ]
              }},
              "keyFactors": [
                "Technical Implementation",
                "Teamwork & Collaboration",
                "Rapid Prototyping",
                "Problem Solving"
              ],
              "preparationTips": [
                "Segera cari rekan tim yang memiliki kekuatan di bidang UI/UX untuk menutupi celah 'designThinking'.",
                "Buat daftar 2-3 ide aplikasi dasar sebelum kompetisi dimulai untuk menghemat waktu brainstorming.",
                "Latih presentasi singkat (pitching) selama 3 menit yang fokus pada masalah, solusi, dan demo produk."
              ]
            }},
            {{
              "id": 1,
              "competitionName": "Lomba Inovasi Bisnis Digital Nasional",
              "rank": 2,
              "matchScore": {{
                "score": 0.72,
                "reason": "Skor dihitung dari kesesuaian kuat pada aspek teknis, namun tertahan oleh gap signifikan pada skill 'businessAcumen' yang memiliki bobot tertinggi."
              }},
              "skillRequirements": {{
                "technicalExpertise": {{ "weight": 0.7, "breakdown": "Dibutuhkan untuk membuktikan kelayakan teknis dari ide bisnis." }},
                "scientificWriting": {{ "weight": 0.5, "breakdown": "Penting untuk menyusun proposal bisnis yang rapi dan terstruktur." }},
                "problemSolving": {{ "weight": 0.7, "breakdown": "Dibutuhkan untuk menganalisis masalah pasar dan menemukan solusi." }},
                "creativityInnovation": {{ "weight": 0.8, "breakdown": "Penting untuk menciptakan model bisnis yang unik dan berkelanjutan." }},
                "communication": {{ "weight": 0.8, "breakdown": "Sangat penting untuk presentasi di hadapan investor dan juri." }},
                "teamworkCollaboration": {{ "weight": 0.8, "breakdown": "Biasanya berbasis tim, kolaborasi antar-disiplin ilmu (teknis & bisnis) krusial." }},
                "projectManagement": {{ "weight": 0.8, "breakdown": "Penting untuk membuat roadmap pengembangan produk dan bisnis." }},
                "businessAcumen": {{ "weight": 0.9, "breakdown": "Ini adalah inti dari kompetisi; pemahaman pasar, monetisasi, dan strategi." }},
                "designThinking": {{ "weight": 0.7, "breakdown": "Penting untuk memastikan produk menjawab kebutuhan pengguna secara mendalam." }},
                "selfLearning": {{ "weight": 0.6, "breakdown": "Dibutuhkan untuk mempelajari aspek bisnis yang mungkin baru." }}
              }},
              "reasoning": {{
                "summary": "Pilihan strategis sebagai 'growth opportunity' untuk keluar dari zona nyaman teknis dan membangun pemahaman bisnis yang komprehensif.",
                "pros": [
                  "Kemampuan teknis (0.85) dan project management (0.75) sudah sangat memadai untuk membangun prototipe yang solid.",
                  "Kekuatan dalam kolaborasi tim (0.90) akan mempermudah kerja sama dengan anggota tim yang mungkin berlatar belakang non-teknis."
                ],
                "cons": [
                  "Kelemahan utama pada 'businessAcumen' (0.50) adalah tantangan terbesar karena ini adalah skill dengan bobot tertinggi (0.9).",
                  "Kemampuan 'scientificWriting' (0.60) mungkin perlu sedikit diasah untuk menyusun proposal bisnis yang persuasif."
                ]
              }},
              "keyFactors": [
                "Business Acumen",
                "Product-Market Fit",
                "Communication & Pitching",
                "Team Collaboration"
              ],
              "preparationTips": [
                "Fokus utama: pelajari 'Business Model Canvas' dan cara melakukan validasi pasar.",
                "Cari rekan satu tim yang memiliki latar belakang manajemen atau bisnis untuk melengkapi kelemahan Anda.",
                "Minta bimbingan dari dosen kewirausahaan untuk mereview proposal bisnis Anda."
              ]
            }}
          ],
          "developmentSuggestions": [
            {{
              "type": "course",
              "title": "Become a UX Designer",
              "link": "https://www.udacity.com/course/ux-designer-nanodegree--nd578",
              "reason": "Untuk secara sistematis membangun keterampilan 'designThinking' dari dasar hingga tingkat portofolio, menutupi salah satu celah utama."
            }},
            {{
              "type": "practice",
              "title": "Studi Kasus Bisnis di Harvard Business Review",
              "link": "https://hbr.org/topic/case-studies",
              "reason": "Membaca dan menganalisis studi kasus bisnis nyata adalah cara praktis untuk melatih 'businessAcumen' dan memahami strategi di balik produk yang sukses."
            }}
          ]
        }}
    
    
    INSTRUKSI & RUBRIK
    1. WAJIB JSON: Output harus HANYA blok JSON tunggal yang valid.  
    2. DATA-DRIVEN: Semua analisis (breakdown, pros, cons) harus berdasarkan bukti konkret dari profil.  
    3. RENTANG SKOR: Semua score dan weight harus antara 0.00 dan 1.00.  
    4. PENILAIAN skillsProfile: Gunakan rubrik penilaian di bawah sebagai panduan utama. Breakdown harus menjelaskan level mahasiswa berdasarkan rubrik.  
    5. BOBOT skillRequirements: Weight harus akurat merefleksikan pentingnya skill untuk sukses di kompetisi.  
    6. matchScore.score: Berikan estimasi logis; jangan hitung matematis. Backend akan melakukan kalkulasi final.  
    7. PERAN PENJELASAN:  
       - matchScore.reason: Justifikasi kuantitatif singkat.  
       - reasoning.summary: Narasi strategis.  
       - reasoning.pros/cons: Bukti konkret dari profil.  
    8. RANKING: Rank harus berdasarkan matchScore, dan nilai strategis kompetisi.  
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
