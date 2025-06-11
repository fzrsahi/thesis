import { drive_v3 } from "@googleapis/drive";
import { HttpStatusCode } from "axios";
import { GaxiosResponse } from "gaxios";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";

import { getFileById } from "../google-drive/google-drive.service";
import { STUDENT_ERROR_RESPONSE } from "../student/student.error";
import { findStudentByUserId } from "../student/student.repository";
import { customError } from "../utils/error/custom-error";

import "@ungap/with-resolvers";

import { AzureChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

export const generateRecommendationUsecase = async (userId: number) => {
  const studentProfile = await handleStudentProfile(userId);
  const transcriptFileIds = studentProfile.transcript.map((t) => t.fileId);
  const transcriptFile = await getFileById(transcriptFileIds[0]);
  const cleanedTranscriptText = await handleTranscriptText(transcriptFile);

  // Prepare student profile text
  const profileText = `
    IPK: ${studentProfile.gpa}
    Minat: ${studentProfile.interests.join(", ")}
    Prestasi: ${studentProfile.achievements
      .map((a) => `${a.title} (${a.date.getFullYear()}) - ${a.description}`)
      .join(", ")}
    Pengalaman: ${studentProfile.experiences
      .map(
        (e) =>
          `${e.organization} - ${e.position} (${e.startDate.getFullYear()} - ${e.endDate ? e.endDate.getFullYear() : "Sekarang"}) - ${e.description}`
      )
      .join(", ")}
    Transkrip Nilai: ${cleanedTranscriptText}
  `;

  // Initialize LangChain components
  const model = new AzureChatOpenAI({
    modelName: "gpt-4o",
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: "2024-04-01-previewawait",
    azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deploymentName: "gpt-4o",
    temperature: 0.7,
  });

  const promptTemplate = PromptTemplate.fromTemplate(`
    Kamu adalah seorang konselor karir yang ahli dalam menganalisis profil mahasiswa dan memberikan rekomendasi karir yang sesuai.
    Berdasarkan profil mahasiswa berikut, berikan rekomendasi karir yang terstruktur dalam format JSON:

    {profile}

    Berikan rekomendasi yang mencakup:
    1. Career Paths: 3-5 jalur karir yang sesuai dengan profil mahasiswa
    2. Strengths: 3-5 kekuatan utama mahasiswa berdasarkan profil
    3. Areas for Improvement: 2-3 area yang perlu ditingkatkan
    4. Next Steps: 3-5 langkah konkret yang bisa diambil

    Pastikan setiap career path memiliki:
    - Title: Judul karir
    - Description: Deskripsi singkat
    - Match Score: Skor kecocokan (0-100)
    - Required Skills: Keterampilan yang dibutuhkan
    - Suggested Courses: Mata kuliah yang disarankan
  `);

  const chain = promptTemplate.pipe(model).pipe(new JsonOutputParser());

  try {
    const recommendation = await chain.invoke({
      profile: profileText,
    });

    // Validate the output against our schema
    // const validatedRecommendation = recommendationSchema.parse(recommendation);
    return recommendation;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw customError(
      "RECOMMENDATION_GENERATION_ERROR",
      "Failed to generate recommendation",
      HttpStatusCode.InternalServerError
    );
  }
};

const handleStudentProfile = async (userId: number) => {
  const student = await findStudentByUserId(userId, {
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
    console.log({
      experiences: student.experiences?.length,
      achievements: student.achievements?.length,
      transcript: student.transcript?.length,
      gpa: student.gpa,
      interests: student.interests?.length,
    });
    throw customError(
      STUDENT_ERROR_RESPONSE.NOT_COMPLETED_PROFILE.code,
      STUDENT_ERROR_RESPONSE.NOT_COMPLETED_PROFILE.message,
      HttpStatusCode.BadRequest
    );
  }

  return student;
};

const handleTranscriptText = async (transcriptFile: GaxiosResponse<drive_v3.Schema$File>) => {
  await import("pdfjs-dist/legacy/build/pdf.worker.mjs");

  const pdfDataAsUint8Array = new Uint8Array(transcriptFile.data as ArrayBuffer);

  const pdfDocument = await pdfjs.getDocument({ data: pdfDataAsUint8Array }).promise;

  let extractedText = "";
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => (item as TextItem).str).join(" ");
    extractedText += `${pageText}\n`;
  }

  return extractedText
    .replace(/KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI/g, "")
    .replace(/UNIVERSITAS NEGERI GORONTALO/g, "")
    .replace(/Fakultas Teknik/g, "")
    .replace(/Jalan: Jenderal Sudirman No\. 6 Kota Gorontalo/g, "")
    .replace(/Telepon: \(0435\) 821183 Fax: \(0435\) 821752/g, "")
    .replace(/Laman: www\.ung\.ac\.id/g, "")
    .replace(/Sistem Informasi Akademik/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2} (AM|PM)/g, "")
    .replace(/No\s+Kode\s+Nama Mata Kuliah\s+SKS\s+Mutu\s+Lambang/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
