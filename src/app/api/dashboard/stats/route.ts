import { NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { getDashboardStatsUsecase } from "@/app/server/dashboard/usecase/get-dashboard-stats.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { ROLES } from "@/app/shared/const/role";

export const GET = withAuth(
  async (req, session) => {
    try {
      const logger = getLogger({ module: "api/dashboard/stats", method: "GET" });

      // Get effective study program ID based on user role
      const studyProgramId = session.getEffectiveStudyProgramId();

      logger.debug(
        { studyProgramId, userRole: session.user.role },
        "Fetching dashboard statistics"
      );
      const data = await getDashboardStatsUsecase(studyProgramId);

      logger.info("Dashboard statistics fetched successfully");
      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error) {
      const logger = getLogger({ module: "api/dashboard/stats", method: "GET" });
      logger.error({ error }, "Failed to fetch dashboard statistics");

      return internalServerError(error, {
        errorLogMessage: "Failed to fetch dashboard statistics",
        errorResponse: {
          error: "Internal Server Error",
          message: "Gagal mengambil statistik dashboard",
        },
      });
    }
  },
  [ROLES.ADMIN, ROLES.ADVISOR]
);
