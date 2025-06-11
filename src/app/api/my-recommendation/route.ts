import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { generateRecommendationUsecase } from "@/app/server/recommendation/generate-recomendation.usecase";
import {
  RECOMMENDATION_ERROR_LOG,
  RECOMMENDATION_ERROR_RESPONSE,
} from "@/app/server/recommendation/recomendation.error";
import { customErrorToResponse, isCustomError } from "@/app/server/utils/error/custom-error";
import { ROLES } from "@/app/shared/const/role";

export const GET = withAuth(
  async (_request: NextRequest, session) => {
    try {
      const data = await generateRecommendationUsecase(Number(session.user.id));
      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error) {
      if (isCustomError(error)) {
        if (error.status === HttpStatusCode.InternalServerError) {
          console.error(RECOMMENDATION_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
        }
        return NextResponse.json(customErrorToResponse(error), {
          status: error.status,
        });
      }

      console.error(RECOMMENDATION_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
      return NextResponse.json(RECOMMENDATION_ERROR_RESPONSE.INTERNAL_SERVER_ERROR, {
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
  [ROLES.STUDENT]
);
