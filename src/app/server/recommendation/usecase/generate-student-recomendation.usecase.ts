import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { COMPETITION_ERROR_RESPONSE } from "../../competition/competition.error";
import {
  findManyCompetitionsByIds,
  findRandomCompetitions,
  getCompetitions,
} from "../../competition/competition.repository";
import {
  generateRecommendationWithCompetitions,
  findSimilarCompetitions,
} from "../../model/azure/azure-openai.service";
import { RecommendationResponse } from "../../model/azure/azure.types";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { createOrUpdateRecomendation, createStudentCompetition } from "../recomendation.repository";

import "@ungap/with-resolvers";

export const createRecommendationUsecase = async (userId: number) => {
  const studentProfile = await validateStudentProfile(userId);
  const result = await generateRecommendation(studentProfile);
  return result;
};

const validateStudentProfile = async (userId: number) => {
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

  return student;
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

// const saveRecommendation = async (
//   studentId: number,
//   prompt: string,
//   recommendation: RecommendationResponse,
//   finalCompetitions: { id: number }[]
// ) => {
//   await createOrUpdateRecomendation(studentId, prompt, recommendation);

//   const validRecommendations = recommendation.recommendations
//     .filter((r) => r.id > 0 && r.id <= finalCompetitions.length)
//     .map((r) => ({
//       competitionId: finalCompetitions[r.id - 1].id,
//       matchScore: r.matchScore,
//       feedback: r.reason,
//     }));

//   if (validRecommendations.length > 0) {
//     await createStudentCompetition(
//       studentId,
//       validRecommendations.map((r) => r.competitionId),
//       validRecommendations.map((r) => r.matchScore),
//       validRecommendations.map((r) => r.feedback)
//     );
//   }
// };

const generateRecommendation = async (
  studentProfile: Prisma.StudentGetPayload<{
    include: {
      achievements: true;
      experiences: true;
      transcript: true;
    };
  }>
): Promise<RecommendationResponse> => {
  const profileText = `
    IPK: ${studentProfile.gpa || "Tidak Ada Informasi"}
    Minat: ${studentProfile.interests?.length ? studentProfile.interests.join(", ") : "Tidak Ada Informasi"}
    Prestasi: ${
      studentProfile.achievements?.length
        ? studentProfile.achievements
            .map((a) => `${a.title} (${a.date.getFullYear()}) - ${a.description}`)
            .join(", ")
        : "Tidak Ada Informasi"
    }
    Pengalaman: ${
      studentProfile.experiences?.length
        ? studentProfile.experiences
            .map(
              (e) =>
                `${e.organization} - ${e.position} (${e.startDate.getFullYear()} - ${e.endDate ? e.endDate.getFullYear() : "Sekarang"}) - ${e.description}`
            )
            .join(", ")
        : "Tidak Ada Informasi"
    }
    Transkrip Nilai: ${studentProfile.transcript?.[0]?.transcriptText || "Tidak Ada Informasi"}
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

  const { result, prompt } = await generateRecommendationWithCompetitions(
    profileText,
    finalCompetitions
  );

  // await saveRecommendation(studentProfile.id, prompt, result, finalCompetitions);
  return result;
};
