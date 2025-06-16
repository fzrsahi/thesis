import { HttpStatusCode } from "axios";

import { RecommendationResponse } from "../../model/azure/types/recomendation.types";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { RECOMMENDATION_ERROR_RESPONSE } from "../recomendation.error";
import { findRecommendationByStudentId } from "../recomendation.repository";
import { findManyCompetitionsByIds } from "../../competition/competition.repository";

export const getStudentRecomendationUsecase = async (userId: number) => {
  const student = await findStudentByUserId(userId, {
    id: true,
    user: {
      select: {
        name: true,
        email: true,
      },
    },
  });
  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }
  const recommendation = await findRecommendationByStudentId(student.id);
  if (!recommendation) {
    throw customError(
      RECOMMENDATION_ERROR_RESPONSE.NOT_FOUND.code,
      RECOMMENDATION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const parsedResponse = JSON.parse(recommendation.response as string) as RecommendationResponse;
  const competitions = await findManyCompetitionsByIds(
    parsedResponse.recommendations.map((r) => r.id)
  );

  const competitionMap = new Map(competitions.map(comp => [comp.id, comp]));

  const updatedRecommendations = parsedResponse.recommendations.map(rec => {
    const competition = competitionMap.get(rec.id);
    return {
      ...rec,
      id: competition?.id || rec.id,
      competitionName: competition?.title || rec.competitionName,
    };
  });

  return {
    student: {
      name: student.user.name,
      email: student.user.email,
    },
    result: {
      ...parsedResponse,
      recommendations: updatedRecommendations,
    },
  };
};
