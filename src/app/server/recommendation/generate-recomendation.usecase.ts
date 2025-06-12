import { drive_v3 } from "@googleapis/drive";
import { HttpStatusCode } from "axios";
import { GaxiosResponse } from "gaxios";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";

import { COMPETITION_ERROR_RESPONSE } from "../competition/competition.error";
import {
  findManyCompetitionsByIds,
  findRandomCompetitions,
  getCompetitions,
} from "../competition/competition.repository";
import { getFileById } from "../google-drive/google-drive.service";
import {
  generateRecommendationWithCompetitions,
  findSimilarCompetitions,
} from "../model/azure/azure-openai.service";
import { RecommendationResponse } from "../model/azure/azure.types";
import { STUDENT_ERROR_RESPONSE } from "../student/student.error";
import { findStudentByUserId } from "../student/student.repository";
import { customError } from "../utils/error/custom-error";

import "@ungap/with-resolvers";

export const generateRecommendationUsecase = async (userId: number) => {
  const studentProfile = await validateStudentProfile(userId);
  const transcriptFileIds = studentProfile.transcript.map((t) => t.fileId);
  const transcriptFile = await getFileById(transcriptFileIds[0]);
  const cleanedTranscriptText = await extractTranscriptText(transcriptFile);

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

  const similarCompetitionEmbeddings = await findSimilarCompetitions(profileText);

  const competitionIds =
    similarCompetitionEmbeddings?.length > 0
      ? similarCompetitionEmbeddings
          .map((embedding: unknown) =>
            Number((embedding as { metadata: { id: number } }).metadata.id)
          )
          .filter((id) => !Number.isNaN(id))
      : [];

  const competitions =
    competitionIds.length > 0 ? await findManyCompetitionsByIds(competitionIds) : [];

  const finalCompetitions = competitions.length ? competitions : await findRandomCompetitions(3);
  if (!finalCompetitions.length) {
    throw customError(
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.code,
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const recommendation = await generateRecommendationWithCompetitions(
    profileText,
    finalCompetitions
  );

  await saveRecommendation(recommendation);

  return recommendation;
};

const validateStudentProfile = async (userId: number) => {
  await validateCompetition();

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

const extractTranscriptText = async (transcriptFile: GaxiosResponse<drive_v3.Schema$File>) => {
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

const saveRecommendation = async (recommendation: RecommendationResponse) => {};
