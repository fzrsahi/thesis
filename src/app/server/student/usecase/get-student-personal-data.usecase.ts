import { HttpStatusCode } from "axios";

import { USER_ERROR_RESPONSE } from "../../user/user.error";
import { findUserById } from "../../user/user.repository";
import { customError } from "../../utils/error/custom-error";
import { STUDENT_ERROR_RESPONSE } from "../student.error";
import { findStudentByUserId } from "../student.repository";

export const getStudentPersonalData = async (userId: number) => {
  const [user, student] = await Promise.all([
    findUserById(userId, {
      name: true,
      email: true,
    }),
    findStudentByUserId(userId, {
      studentId: true,
    }),
  ]);

  if (!user) {
    throw customError(
      USER_ERROR_RESPONSE.USER_NOT_FOUND.code,
      USER_ERROR_RESPONSE.USER_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }
  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  return {
    name: user.name,
    email: user.email,
    studentId: student.studentId,
  };
};
