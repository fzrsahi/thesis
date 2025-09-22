import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { PersonalDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";

import { USER_ERROR_RESPONSE } from "../../user/user.error";
import { findUserById } from "../../user/user.repository";
import { customError, isCustomError } from "../../utils/error/custom-error";
import { STUDENT_ERROR_RESPONSE } from "../student.error";
import { updateStudentPersonalData } from "../student.repository";
import { rebuildStudentVector } from "../student.vector";

export const updatePersonalData = async (userId: number, data: PersonalDataPayload) => {
  try {
    const user = await findUserById(userId);

    if (!user) {
      throw customError(
        USER_ERROR_RESPONSE.USER_NOT_FOUND.code,
        USER_ERROR_RESPONSE.USER_NOT_FOUND.message,
        HttpStatusCode.NotFound
      );
    }

    await updateStudentPersonalData(user.id, data);
    await rebuildStudentVector(userId);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw customError(
        USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.code,
        USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.message,
        HttpStatusCode.BadRequest
      );
    } else if (isCustomError(error)) {
      throw error;
    }

    throw customError(
      STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR.code,
      STUDENT_ERROR_RESPONSE.INTERNAL_SERVER_ERROR.message,
      HttpStatusCode.InternalServerError
    );
  }
};
