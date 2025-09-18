import { HttpStatusCode } from "axios";

import { StudentPayload } from "@/app/shared/schema/student/StudentSchema";

import { USER_ERROR_RESPONSE } from "../../user/user.error";
import { createUser, findUserByEmail } from "../../user/user.repository";
import { generateHash } from "../../utils/bcrypt/bcrypt";
import { customError } from "../../utils/error/custom-error";
import { STUDENT_ERROR_RESPONSE } from "../student.error";
import { createStudent, findStudentByStudentId } from "../student.repository";

export const createStudentUsecase = async (payload: StudentPayload) => {
  const user = await findUserByEmail(payload.email);

  if (user) {
    throw customError(
      USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.code,
      USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.message,
      HttpStatusCode.Conflict
    );
  }

  const isStudentIdExists = await findStudentByStudentId(payload.studentId, {
    id: true,
  });

  if (isStudentIdExists) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_ID_ALREADY_EXISTS.code,
      STUDENT_ERROR_RESPONSE.STUDENT_ID_ALREADY_EXISTS.message,
      HttpStatusCode.Conflict
    );
  }

  const hashedPassword = await generateHash(payload.email);
  const newUser = await createUser({
    ...payload,
    password: hashedPassword,
  });

  await createStudent({
    userId: newUser.id,
    studentId: payload.studentId as string,
  });
};
