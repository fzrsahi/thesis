import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  COMPETITION_ERROR_RESPONSE,
  COMPETITION_ERROR_LOG,
} from "@/app/server/competition/competition.error";
import { generateCompetitionUsecase } from "@/app/server/competition/usecase/generate-competition.usecase";
import { isCustomError, customErrorToResponse } from "@/app/server/utils/error/custom-error";
import { ROLES } from "@/app/shared/const/role";
import {
  competitionGenerateSchema,
  CreateCompetitionGeneratePayload,
} from "@/app/shared/schema/competition/CompetitionGenerateSchema";

export const POST = withAuth(
  async (request: NextRequest) => {
    try {
      console.log("oawkowakoawkowak");

      const formData = await request.formData();
      const payload: CreateCompetitionGeneratePayload = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        website: formData.get("website") as string,
        additionalDetails: formData.get("additionalDetails") as string,
        file: formData.get("file") as File,
        startPage: formData.get("startPage") ? Number(formData.get("startPage")) : undefined,
        endPage: formData.get("endPage") ? Number(formData.get("endPage")) : undefined,
      };

      const result = competitionGenerateSchema.safeParse(payload);
      if (!result.success) {
        return NextResponse.json(COMPETITION_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }
      const data = await generateCompetitionUsecase(result.data);

      return NextResponse.json({
        success: true,
        data,
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
