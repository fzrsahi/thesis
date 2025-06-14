import { HttpStatusCode } from "axios";

import { RecommendationResponse } from "../../model/azure/types/recomendation.types";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { RECOMMENDATION_ERROR_RESPONSE } from "../recomendation.error";
import { findRecommendationByStudentId } from "../recomendation.repository";

export const getStudentRecomendationUsecase = async (userId: number) => {
  const student = await findStudentByUserId(userId, {
    id: true,
  });
  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const existingRecommendation = await findRecommendationByStudentId(student.id);
  if (!existingRecommendation) {
    throw customError(
      RECOMMENDATION_ERROR_RESPONSE.NOT_FOUND.code,
      RECOMMENDATION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }
  return JSON.parse(existingRecommendation.response as string) as RecommendationResponse;
};
