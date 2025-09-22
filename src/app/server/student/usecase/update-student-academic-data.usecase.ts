import { HttpStatusCode } from "axios";

import { AcademicDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";

import { customError } from "../../utils/error/custom-error";
import { STUDENT_ERROR_RESPONSE } from "../student.error";
import { findStudentByUserId, updateStudentAcademicData } from "../student.repository";
import { rebuildStudentVector } from "../student.vector";

export const updateStudentAcademicDataUsecase = async (
  userId: number,
  data: AcademicDataPayload
) => {
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  await updateStudentAcademicData(student.id, data);
  await rebuildStudentVector(userId);
};
