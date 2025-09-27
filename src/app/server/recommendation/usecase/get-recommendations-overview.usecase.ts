import { HttpStatusCode } from "axios";

import { customError } from "@/app/server/utils/error/custom-error";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";

import { getRecommendationsOverview } from "../recomendation.repository";

type GetRecommendationsOverviewFilter = {
  studyProgramId?: number;
  entryYear?: number;
  competitionId?: number;
  minMatchScore?: number;
  keywords?: string;
};

export const getRecommendationsOverviewUsecase = async (
  pagination: PaginationParams,
  filter: GetRecommendationsOverviewFilter
) => {
  try {
    const result = await getRecommendationsOverview(pagination, filter);
    return result;
  } catch (error) {
    throw customError(
      "RECOMMENDATION_OVERVIEW_ERROR",
      "Failed to get recommendations overview",
      HttpStatusCode.InternalServerError
    );
  }
};
