import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { deleteStudentByIdUsecase } from "@/app/server/student/usecase/delete-student-by-id.usecase";
import { getStudentDetailUsecase } from "@/app/server/student/usecase/get-student-detail.usecase";
import { STUDENT_ERROR_LOG_MESSAGE, STUDENT_ERROR_RESPONSE } from "@/app/server/user/student.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";

export const GET = withAuth(
  async (request: NextRequest, _session) => {
    try {
      const id = request.nextUrl.pathname.split("/").pop();
      const result = await getStudentDetailUsecase(Number(id));
      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: STUDENT_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN, ROLES.ADVISOR]
);

export const DELETE = withAuth(
  async (request: NextRequest, _session) => {
    try {
      const id = request.nextUrl.pathname.split("/").pop();
      await deleteStudentByIdUsecase(Number(id));
      return NextResponse.json({ success: true });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: STUDENT_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADMIN, ROLES.ADVISOR]
);
