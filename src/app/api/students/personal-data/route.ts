import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { STUDENT_ERROR_LOG, STUDENT_ERROR_RESPONSE } from "@/app/server/student/student.error";
import { getStudentPersonalData } from "@/app/server/student/usecase/get-student-personal-data.usecase";
import { updateStudentPersonalData } from "@/app/server/user/user.repository";
import { isCustomError, customErrorToResponse } from "@/app/server/utils/error/custom-error";
import { ROLES } from "@/app/shared/const/role";
import {
  PersonalDataPayload,
  personalDataSchema,
} from "@/app/shared/schema/student/profile/ProfileSchema";

export const GET = withAuth(
  async (_request: NextRequest, session) => {
    try {
      const data = await getStudentPersonalData(Number(session.user.id));

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
      const body: PersonalDataPayload = await request.json();
      const { success, data } = personalDataSchema.safeParse(body);

      if (!success) {
        return NextResponse.json(STUDENT_ERROR_RESPONSE.BAD_REQUEST, {
          status: HttpStatusCode.BadRequest,
        });
      }

      const { name, email, student_id } = data;

      await updateStudentPersonalData(Number(session.user.id), { name, email, student_id });

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
