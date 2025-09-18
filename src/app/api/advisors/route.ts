import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { createAdvisorUsecase } from "@/app/server/advisor/usecase/create-advisor.usecase";
import { getAdvisorsUsecase } from "@/app/server/advisor/usecase/get-advisors.usecase";
import { withAuth } from "@/app/server/auth/with-auth";
import { ADVISOR_ERROR_LOG_MESSAGE, ADVISOR_ERROR_RESPONSE } from "@/app/server/user/advisor.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getPaginationParams } from "@/app/server/utils/pagination/get-pagination-params";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";
import { ROLES } from "@/app/shared/const/role";
import { AdvisorSchema } from "@/app/shared/schema/advisor/AdvisorSchema";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const pagination = getPaginationParams(req) as PaginationParams;
      const result = await getAdvisorsUsecase(pagination);
      return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: ADVISOR_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: ADVISOR_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN]
);

export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const body = AdvisorSchema.parse(await req.json());
      const result = AdvisorSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(ADVISOR_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }

      await createAdvisorUsecase(body);
      return NextResponse.json({ success: true }, { status: HttpStatusCode.Created });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: ADVISOR_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: ADVISOR_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN]
);
