import { HttpStatusCode } from "axios";

import { STUDENT_ERROR_RESPONSE } from "../../user/student.error";
import { customError } from "../../utils/error/custom-error";
import { deleteStudentByUserId, findStudentById } from "../student.repository";

export const deleteStudentByIdUsecase = async (id: number) => {
  const student = await findStudentById(id);
  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  await deleteStudentByUserId(student.userId);
};
