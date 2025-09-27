import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  RECOMMENDATION_ERROR_LOG,
  RECOMMENDATION_ERROR_RESPONSE,
} from "@/app/server/recommendation/recomendation.error";
import { getRecomendationByCompetitionIdUsecase } from "@/app/server/recommendation/usecase/get-recomendation-by-competitionid.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { ROLES } from "@/app/shared/const/role";

const logger = getLogger({ module: "api/recomendations/competitions/[id]", method: "GET" });

export const GET = withAuth(
  async (req: NextRequest, session) => {
    try {
      const competitionId = Number(req.nextUrl.pathname.split("/").pop());

      logger.debug(
        {
          userId: session.user.id,
          userRole: session.user.role,
          competitionId,
        },
        "Fetching competition recommendations by ID"
      );

      const result = await getRecomendationByCompetitionIdUsecase(competitionId);

      logger.info(
        {
          competitionId,
          totalStudents: result.statistics.overview.totalStudents,
        },
        "Fetched competition recommendations successfully"
      );

      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error({ error }, "Failed to fetch competition recommendations by ID");
      return internalServerError(error, {
        errorLogMessage: RECOMMENDATION_ERROR_LOG.INTERNAL_SERVER_ERROR,
        errorResponse: RECOMMENDATION_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADVISOR, ROLES.ADMIN]
);
