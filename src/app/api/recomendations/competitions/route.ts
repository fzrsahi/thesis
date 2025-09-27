import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  RECOMMENDATION_ERROR_LOG,
  RECOMMENDATION_ERROR_RESPONSE,
} from "@/app/server/recommendation/recomendation.error";
import { getRecommendationsOverviewUsecase } from "@/app/server/recommendation/usecase/get-recommendations-overview.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getQueryParams } from "@/app/server/utils/helpers/get-params-url.helper";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { getPaginationParams } from "@/app/server/utils/pagination/get-pagination-params";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";
import { ROLES } from "@/app/shared/const/role";

export const GET = withAuth(
  async (req: NextRequest, session) => {
    try {
      const logger = getLogger({ module: "api/recomendations/competitions", method: "GET" });
      const pagination = getPaginationParams(req) as PaginationParams;

      const {
        studyProgramId: queryStudyProgramId,
        entryYear,
        competitionId,
        minMatchScore,
        keywords,
      } = getQueryParams(req.nextUrl, {
        studyProgramId: "number",
        entryYear: "number",
        competitionId: "number",
        minMatchScore: "number",
        keywords: "string",
      });

      const filter = {
        studyProgramId: session.getEffectiveStudyProgramId(queryStudyProgramId),
        entryYear,
        competitionId,
        minMatchScore,
        keywords,
      };

      logger.debug({ pagination, filter }, "Fetching recommendations by competition");
      const result = await getRecommendationsOverviewUsecase(pagination, filter);
      logger.info(
        {
          competitionCount: result.data.length,
          totalStudents: result.summary.totalStudents,
          totalCompetitions: result.summary.totalCompetitions,
        },
        "Fetched recommendations by competition successfully"
      );

      return NextResponse.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        summary: result.summary,
      });
    } catch (error) {
      const logger = getLogger({ module: "api/recomendations/competitions", method: "GET" });
      logger.error({ error }, "Failed to fetch recommendations by competition");
      return internalServerError(error, {
        errorLogMessage: RECOMMENDATION_ERROR_LOG.INTERNAL_SERVER_ERROR,
        errorResponse: RECOMMENDATION_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN, ROLES.ADVISOR]
);
