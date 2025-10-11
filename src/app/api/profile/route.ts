import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { getProfileUsecase, updateProfileUsecase } from "@/app/server/user/usecase/profile.usecase";
import { USER_ERROR_LOG_MESSAGE, USER_ERROR_RESPONSE } from "@/app/server/user/user.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";
import { profileUpdateSchema } from "@/app/shared/validations/schema/profileSchema";

export const GET = withAuth(
  async (_req: NextRequest, session) => {
    try {
      const result = await getProfileUsecase(Number(session.user.id));
      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: USER_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: USER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.STUDENT, ROLES.ADVISOR, ROLES.ADMIN]
);

export const PUT = withAuth(
  async (req: NextRequest, session) => {
    try {
      const body = await req.json();
      const result = profileUpdateSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid data", details: result.error.errors },
          { status: 400 }
        );
      }

      const updatedUser = await updateProfileUsecase(Number(session.user.id), result.data);

      return NextResponse.json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: USER_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: USER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.STUDENT, ROLES.ADVISOR, ROLES.ADMIN]
);