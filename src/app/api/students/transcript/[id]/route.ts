import {
  TRANSCRIPT_ERROR_LOG,
  TRANSCRIPT_ERROR_RESPONSE,
} from "@/app/server/transcript/transcript.error";
import { deleteStudentTranscriptUsecase } from "@/app/server/transcript/usecase/delete-student-transcript.usecase";
import { isCustomError, customErrorToResponse } from "@/app/server/utils/error/custom-error";
import { ROLES } from "@/app/shared/const/role";
import { withAuth } from "@/app/server/auth/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

export const DELETE = withAuth(
  async (request: NextRequest, session) => {
    try {
      const transcriptId = request.nextUrl.pathname.split("/").pop();

      await deleteStudentTranscriptUsecase(Number(session.user.id), Number(transcriptId));

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      if (isCustomError(error)) {
        if (error.status === HttpStatusCode.InternalServerError) {
          console.error(TRANSCRIPT_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
        }
        return NextResponse.json(customErrorToResponse(error), {
          status: error.status,
        });
      }

      console.error(TRANSCRIPT_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
      return NextResponse.json(TRANSCRIPT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR, {
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
  [ROLES.STUDENT]
);
