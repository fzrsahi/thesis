import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import { updatePasswordUsecase } from "@/app/server/user/usecase/password.usecase";
import { USER_ERROR_LOG_MESSAGE, USER_ERROR_RESPONSE } from "@/app/server/user/user.error";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";
import { passwordChangeSchema } from "@/app/shared/validations/schema/passwordSchema";

const PUT = withAuth(
  async (request: NextRequest, session) => {
    try {
      const userId = Number(session.user.id);
      const body = await request.json();
      const result = passwordChangeSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid data", details: result.error.errors },
          { status: HttpStatusCode.BadRequest }
        );
      }

      await updatePasswordUsecase(userId, result.data);

      return NextResponse.json({
        success: true,
        message: "Password berhasil diubah",
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: USER_ERROR_LOG_MESSAGE.INTERNAL_SERVER_ERROR,
        errorResponse: USER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      });
    }
  },
  [ROLES.STUDENT]
);

export { PUT };
