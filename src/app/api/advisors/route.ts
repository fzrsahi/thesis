import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { createAdvisorUsecase } from "@/app/server/advisor/usecase/create-advisor.usecase";
import { getAdvisorsUsecase } from "@/app/server/advisor/usecase/get-advisors.usecase";
import { withAuth } from "@/app/server/auth/with-auth";
import { ADVISOR_ERROR_LOG_MESSAGE, ADVISOR_ERROR_RESPONSE } from "@/app/server/user/advisor.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { getPaginationParams } from "@/app/server/utils/pagination/get-pagination-params";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";
import { ROLES } from "@/app/shared/const/role";
import { AdvisorSchema } from "@/app/shared/schema/advisor/AdvisorSchema";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const logger = getLogger({ module: "api/advisors", method: "GET" });
      const pagination = getPaginationParams(req) as PaginationParams;
      logger.debug({ pagination }, "Fetching advisors");
      const result = await getAdvisorsUsecase(pagination);
      logger.info({ count: result.data.length }, "Fetched advisors successfully");
      return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      const logger = getLogger({ module: "api/advisors", method: "GET" });
      logger.error({ error }, "Failed to fetch advisors");
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
      const logger = getLogger({ module: "api/advisors", method: "POST" });
      const body = AdvisorSchema.parse(await req.json());
      const result = AdvisorSchema.safeParse(body);
      if (!result.success) {
        logger.info({ issues: result.error.issues }, "Validation failed for create advisor");
        return NextResponse.json(ADVISOR_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }
      logger.info({ email: result.data.email }, "Creating advisor");
      await createAdvisorUsecase(body);
      logger.info({ email: result.data.email }, "Advisor created");
      return NextResponse.json({ success: true }, { status: HttpStatusCode.Created });
    } catch (error) {
      const logger = getLogger({ module: "api/advisors", method: "POST" });
      logger.error({ error }, "Failed to create advisor");
      return internalServerError(error, {
        errorLogMessage: ADVISOR_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: ADVISOR_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN]
);
