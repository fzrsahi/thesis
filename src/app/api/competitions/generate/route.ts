import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  COMPETITION_ERROR_RESPONSE,
  COMPETITION_ERROR_LOG,
} from "@/app/server/competition/competition.error";
import { generateCompetitionUsecase } from "@/app/server/competition/usecase/generate-competition.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { ROLES } from "@/app/shared/const/role";
import {
  competitionGenerateSchema,
  CreateCompetitionGeneratePayload,
} from "@/app/shared/schema/competition/CompetitionGenerateSchema";

const logger = getLogger({ module: "api/competitions/generate", method: "POST" });
export const POST = withAuth(
  async (request: NextRequest) => {
    try {
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
      logger.debug(
        { hasFile: Boolean(payload.file), title: payload.title },
        "Generate payload parsed"
      );

      const result = competitionGenerateSchema.safeParse(payload);
      if (!result.success) {
        logger.info({ issues: result.error.issues }, "Validation failed for competition generate");
        return NextResponse.json(COMPETITION_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }
      const data = await generateCompetitionUsecase(result.data);
      logger.info({ title: result.data.title }, "Competition generated successfully");
      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error) {
      logger.debug({ error }, COMPETITION_ERROR_LOG.INTERNAL_SERVER_ERROR);
      return internalServerError(error, {
        errorLogMessage: COMPETITION_ERROR_LOG.INTERNAL_SERVER_ERROR,
        errorResponse: COMPETITION_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.STUDENT, ROLES.ADMIN]
);
