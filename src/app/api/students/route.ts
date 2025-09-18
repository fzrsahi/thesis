import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { createStudentUsecase } from "@/app/server/student/usecase/create-student.usecase";
import { getStudentsUsecase } from "@/app/server/student/usecase/get-students.usecase";
import { STUDENT_ERROR_LOG_MESSAGE, STUDENT_ERROR_RESPONSE } from "@/app/server/user/student.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { getPaginationParams } from "@/app/server/utils/pagination/get-pagination-params";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";
import { getLogger } from "@/app/server/utils/pino.helper";
import { ROLES } from "@/app/shared/const/role";
import { StudentPayload, StudentSchema } from "@/app/shared/schema/student/StudentSchema";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const logger = getLogger({ module: "api/students", method: "GET" });
      const pagination = getPaginationParams(req) as PaginationParams;
      logger.debug({ pagination }, "Fetching students");
      const result = await getStudentsUsecase(pagination);
      logger.info({ count: result.data.length }, "Fetched students successfully");
      return NextResponse.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      const logger = getLogger({ module: "api/students", method: "GET" });
      logger.error({ error }, "Failed to fetch students");
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
      const logger = getLogger({ module: "api/students", method: "POST" });
      const body: StudentPayload = await request.json();
      logger.debug({ body }, "Create student payload received");
      const result = StudentSchema.safeParse(body);
      if (!result.success) {
        logger.info({ issues: result.error.issues }, "Validation failed for create student");
        return NextResponse.json(STUDENT_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }
      logger.info(
        { email: result.data.email, studentId: result.data.studentId },
        "Creating student"
      );
      await createStudentUsecase(result.data);
      logger.info(
        { email: result.data.email, studentId: result.data.studentId },
        "Student created"
      );
      return NextResponse.json(
        {
          success: true,
        },
        { status: HttpStatusCode.Created }
      );
    } catch (error) {
      const logger = getLogger({ module: "api/students", method: "POST" });
      logger.error({ error }, "Failed to create student");
      return internalServerError(error, {
        errorLogMessage: STUDENT_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.ADVISOR, ROLES.ADMIN]
);

export const DELETE = async () => NextResponse.json({ message: "Hello, world!" });
