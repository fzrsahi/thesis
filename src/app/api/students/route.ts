import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { createStudentUsecase } from "@/app/server/student/usecase/create-student.usecase";
import { getStudentsUsecase } from "@/app/server/student/usecase/get-students.usecase";
import { STUDENT_ERROR_LOG_MESSAGE, STUDENT_ERROR_RESPONSE } from "@/app/server/user/student.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getPaginationParams } from "@/app/server/utils/pagination/get-pagination-params";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";
import { ROLES } from "@/app/shared/const/role";
import { StudentPayload, StudentSchema } from "@/app/shared/schema/student/StudentSchema";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const pagination = getPaginationParams(req) as PaginationParams;

      const result = await getStudentsUsecase(pagination);

      return NextResponse.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
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

export const POST = withAuth(
  async (request: NextRequest) => {
    try {
      const body: StudentPayload = await request.json();
      const result = StudentSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(STUDENT_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }

      await createStudentUsecase(result.data);

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: STUDENT_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADVISOR, ROLES.ADMIN]
);

export const DELETE = async () => NextResponse.json({ message: "Hello, world!" });
