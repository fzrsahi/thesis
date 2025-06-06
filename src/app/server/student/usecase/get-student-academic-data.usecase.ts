import { HttpStatusCode } from "axios";

import { customError } from "../../utils/error/custom-error";
import { STUDENT_ERROR_RESPONSE } from "../student.error";
import { findStudentByUserId } from "../student.repository";

export const getStudentAcademicDataUsecase = async (userId: number) => {
  const student = await findStudentByUserId(userId, {
    gpa: true,
    interests: true,
    achievements: {
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
      },
    },
    experiences: {
      select: {
        id: true,
        organization: true,
        position: true,
        startDate: true,
        endDate: true,
        description: true,
      },
    },
  });

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  return student;
};
