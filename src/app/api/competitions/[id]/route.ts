import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  COMPETITION_ERROR_LOG,
  COMPETITION_ERROR_RESPONSE,
} from "@/app/server/competition/competition.error";
import { deleteCompetitionByIdUsecase } from "@/app/server/competition/usecase/delete-competition-by-id.usecase";
import { getCompetitionDetailUsecase } from "@/app/server/competition/usecase/get-competition-detail.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";

export const GET = withAuth(
  async (request: NextRequest) => {
    try {
      const id = request.nextUrl.pathname.split("/").pop();
      const result = await getCompetitionDetailUsecase(Number(id));
      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: COMPETITION_ERROR_LOG.INTERNAL_SERVER_ERROR,
        errorResponse: COMPETITION_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.STUDENT, ROLES.ADMIN, ROLES.ADVISOR]
);

export const DELETE = withAuth(
  async (request: NextRequest) => {
    try {
      const id = request.nextUrl.pathname.split("/").pop();
      await deleteCompetitionByIdUsecase(Number(id));
      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: COMPETITION_ERROR_LOG.INTERNAL_SERVER_ERROR,
        errorResponse: COMPETITION_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN]
);
