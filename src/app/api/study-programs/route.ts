import { NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { getStudyProgramsUsecase } from "@/app/server/study-program/get-study-programs.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";

import {
  STUDY_PROGRAM_ERROR_LOG_MESSAGE,
  STUDY_PROGRAM_ERROR_RESPONSE,
} from "./study-program.error";

export const GET = withAuth(async () => {
  try {
    const result = await getStudyProgramsUsecase();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return internalServerError(error, {
      errorLogMessage: STUDY_PROGRAM_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
      errorResponse: STUDY_PROGRAM_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
    });
  }
}, [ROLES.ADMIN, ROLES.ADVISOR]);
