import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { STUDENT_ERROR_LOG, STUDENT_ERROR_RESPONSE } from "@/app/server/student/student.error";
import { getStudentAcademicDataUsecase } from "@/app/server/student/usecase/get-student-academic-data.usecase";
import { updateStudentAcademicDataUsecase } from "@/app/server/student/usecase/update-student-academic-data.usecase";
import { customErrorToResponse, isCustomError } from "@/app/server/utils/error/custom-error";
import { ROLES } from "@/app/shared/const/role";
import {
  AcademicDataPayload,
  academicDataSchema,
} from "@/app/shared/schema/student/profile/ProfileSchema";

export const GET = withAuth(
  async (_request: NextRequest, session) => {
    try {
      const data = await getStudentAcademicDataUsecase(Number(session.user.id));

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error) {
      if (isCustomError(error)) {
        if (error.status === HttpStatusCode.InternalServerError) {
          console.error(STUDENT_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
        }
        return NextResponse.json(customErrorToResponse(error), {
          status: error.status,
        });
      }

      console.error(STUDENT_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
      return NextResponse.json(STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR, {
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
  [ROLES.STUDENT]
);

export const PUT = withAuth(
  async (request: NextRequest, session) => {
    try {
      const body: AcademicDataPayload = await request.json();
      const result = academicDataSchema.safeParse(body);

      if (!result.success) {
        console.log(result.error.errors);

        return NextResponse.json(STUDENT_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }

      const { gpa, interests, achievements, experiences } = result.data;

      await updateStudentAcademicDataUsecase(Number(session.user.id), {
        gpa,
        interests,
        achievements,
        experiences,
      });

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      if (isCustomError(error)) {
        if (error.status === HttpStatusCode.InternalServerError) {
          console.error(STUDENT_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
        }
        return NextResponse.json(customErrorToResponse(error), {
          status: error.status,
        });
      }

      console.error(STUDENT_ERROR_LOG.INTERNAL_SERVER_ERROR, error);
      return NextResponse.json(STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR, {
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
  [ROLES.STUDENT]
);
