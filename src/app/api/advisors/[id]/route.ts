import { NextRequest, NextResponse } from "next/server";

import { deleteAdvisorByIdUsecase } from "@/app/server/advisor/usecase/delete-avisor-by-id.usecase";
import { withAuth } from "@/app/server/auth/with-auth";
import { ADVISOR_ERROR_LOG_MESSAGE, ADVISOR_ERROR_RESPONSE } from "@/app/server/user/advisor.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";

export const DELETE = withAuth(
  async (request: NextRequest, _session) => {
    try {
      const id = request.nextUrl.pathname.split("/").pop();
      await deleteAdvisorByIdUsecase(Number(id));
      return NextResponse.json({ success: true });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: ADVISOR_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: ADVISOR_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN, ROLES.ADVISOR]
);
