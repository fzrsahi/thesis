import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  COMPETITION_ERROR_LOG,
  COMPETITION_ERROR_RESPONSE,
} from "@/app/server/competition/competition.error";
import { createCompetitionUsecase } from "@/app/server/competition/usecase/create-competition.usecase";
import { isCustomError, customErrorToResponse } from "@/app/server/utils/error/custom-error";
import { ROLES } from "@/app/shared/const/role";
import {
  CreateCompetitionPayload,
  createCompetitionSchema,
} from "@/app/shared/schema/competition/CompetitionSchema";

export const POST = withAuth(
  async (request: NextRequest) => {
    try {
      const body: CreateCompetitionPayload = await request.json();
      const result = createCompetitionSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(COMPETITION_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }

      await createCompetitionUsecase(result.data);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      if (isCustomError(error)) {
        if (error.status === HttpStatusCode.InternalServerError) {
          console.error(COMPETITION_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
        }
        return NextResponse.json(customErrorToResponse(error), {
          status: error.status,
        });
      }

      console.error(COMPETITION_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
      return NextResponse.json(COMPETITION_ERROR_RESPONSE.INTERNAL_SERVER_ERROR, {
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
  [ROLES.STUDENT, ROLES.ADMIN]
);
