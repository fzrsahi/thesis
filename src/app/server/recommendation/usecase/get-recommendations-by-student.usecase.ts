import { HttpStatusCode } from "axios";

import { customError } from "@/app/server/utils/error/custom-error";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";

import { getRecommendationsByStudent } from "../recomendation.repository";

type GetRecommendationsByStudentFilter = {
  studyProgramId?: number;
  entryYear?: number;
  competitionId?: number;
  minMatchScore?: number;
  keywords?: string;
};

export const getRecommendationsByStudentUsecase = async (
  pagination: PaginationParams,
  filter: GetRecommendationsByStudentFilter
) => {
  try {
    // Ensure pagination has required values
    const normalizedPagination = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
    };

    const result = await getRecommendationsByStudent(normalizedPagination, filter);
    return result;
  } catch (error) {
    throw customError(
      "RECOMMENDATION_BY_STUDENT_ERROR",
      "Failed to get recommendations by student",
      HttpStatusCode.InternalServerError
    );
  }
};
