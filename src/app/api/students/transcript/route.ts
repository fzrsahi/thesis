import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  TRANSCRIPT_ERROR_LOG,
  TRANSCRIPT_ERROR_RESPONSE,
} from "@/app/server/transcript/transcript.error";
import { uploadTranscript } from "@/app/server/transcript/usecase/upload.transcript.usecase";
import { isCustomError, customErrorToResponse } from "@/app/server/utils/error/custom-error";
import { ROLES } from "@/app/shared/const/role";
import {
  UploadTranscriptPayload,
  UploadTranscriptSchema,
} from "@/app/shared/schema/student/profile/TranscriptSchema";
import { getStudentTranscripts } from "@/app/server/transcript/usecase/get-student-transcripts.usecase";

export const POST = withAuth(
  async (request: NextRequest, session) => {
    try {
      const formData = await request.formData();
      const payload: UploadTranscriptPayload = {
        transcript: formData.get("transcript") as File,
        semester: formData.get("semester") as string,
      };

      const result = UploadTranscriptSchema.safeParse(payload);

      if (!result.success) {
        return NextResponse.json(TRANSCRIPT_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }

      await uploadTranscript(Number(session.user.id), result.data);

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

export const GET = withAuth(
  async (_request: NextRequest, session) => {
    try {
      const data = await getStudentTranscripts(Number(session.user.id));

      return NextResponse.json({
        success: true,
        data,
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
