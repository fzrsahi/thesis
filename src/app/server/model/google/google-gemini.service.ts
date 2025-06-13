import { GoogleGenAI } from "@google/genai";

const GOOGLE_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY!,
};

const createGeminiClient = () =>
  new GoogleGenAI({
    apiKey: GOOGLE_CONFIG.apiKey,
  });

export const sendPrompt = async (prompt: string) => {
  const response = await createGeminiClient().models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        name: "competition",
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description:
                "nama kompetisi persis seperti di sumber, misalnya 'LIDM 2025 - Inovasi Teknologi Digital Pendidikan (Divisi1)'",
            },
            description: {
              type: "string",
              description:
                "ringkasan tujuan dan cakupan kompetisi sesuai yang disediakan atau diekstrak",
            },
            field: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "sesuai bidang kompetisi; contoh: 'Teknologi Informasi', 'Manajemen Proyek'",
            },
            type: {
              type: "string",
              description: "'Individual' atau 'Tim'",
            },
            minGPA: {
              type: "string",
              nullable: true,
              description: "IPK minimal jika disebutkan; jika tidak, null",
            },
            requirements: {
              type: "object",
              properties: {
                team_composition: {
                  type: "string",
                  nullable: true,
                  description:
                    "jumlah/struktur tim, misalnya '2-3 mahasiswa dari jurusan yang sama'",
                },
                originality: {
                  type: "string",
                  nullable: true,
                  description: "misalnya 'Karya harus orisinal'",
                },
                other: {
                  type: "string",
                  nullable: true,
                  description: "syarat lain seperti 'Mengirim proposal PDF'",
                },
              },
            },
            startDate: {
              type: "string",
              description: "format YYYY-MM-DD",
              nullable: true,
            },
            endDate: {
              type: "string",
              description: "format YYYY-MM-DD",
              nullable: true,
            },
            location: {
              type: "string",
              nullable: true,
              description: "misalnya 'Online', 'Universitas Gadjah Mada'; null jika tidak disebut",
            },
            organizer: {
              type: "string",
              nullable: true,
              description: "penyelenggara seperti 'Kemdikbud'; null jika tidak disebut",
            },
            evaluation_criteria: {
              type: "object",
              properties: {
                preliminary_round: {
                  type: "string",
                  nullable: true,
                  description: "misalnya 'Inovasi 40%, Proposal 60%'",
                },
                final_round: {
                  type: "string",
                  nullable: true,
                  description: "misalnya 'Demo Produk & Presentasi'",
                },
                other: {
                  type: "string",
                  nullable: true,
                  description: "jika ada kriteria tambahan",
                },
              },
            },
            competition_statistics: {
              type: "object",
              properties: {
                summary: {
                  type: "string",
                  description:
                    "ringkasan data partisipasi historis, misalnya '300 tim dari 50 kampus pada 2023'",
                },
                total_applicants_past_year: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      count: {
                        type: "integer",
                        nullable: true,
                        description: "jumlah pendaftar; null jika tidak diketahui",
                      },
                      year: {
                        type: "string",
                        nullable: true,
                        description: "misalnya '2023'",
                      },
                    },
                  },
                },
                finalist_count_past_year: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      count: {
                        type: "integer",
                        nullable: true,
                        description: "jumlah finalis; null jika tidak diketahui",
                      },
                      year: {
                        type: "string",
                        nullable: true,
                        description: "misalnya '2023'",
                      },
                    },
                  },
                },
                past_ung_participants: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      year: {
                        type: "string",
                        description: "misalnya '2023'",
                      },
                      name: {
                        type: "string",
                        description: "nama peserta dari UNG",
                      },
                      count: {
                        type: "integer",
                        description: "jumlah anggota atau 1 jika individu",
                      },
                    },
                  },
                },
              },
            },
            source_url: {
              type: "string",
              nullable: true,
              description: "URL utama kompetisi",
            },
            relevant_courses: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "sesuai bidang lomba — untuk teknis: 'Pemrograman Dasar', 'Machine Learning'; untuk non-teknis: 'Manajemen Proyek', 'Penulisan Proposal'",
            },
            relevant_skills: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "sesuai bidang lomba — untuk teknis: 'Python', 'UI/UX'; untuk non-teknis: 'Public Speaking', 'Penulisan Ilmiah'",
            },
          },
          required: [
            "title",
            "description",
            "field",
            "type",
            "startDate",
            "endDate",
            "requirements",
            "evaluation_criteria",
            "competition_statistics",
            "relevant_courses",
            "relevant_skills",
          ],
        },
      },
      tools: [
        {
          googleSearch: {},
        },
      ],
    },
  });

  return response.text;
};
