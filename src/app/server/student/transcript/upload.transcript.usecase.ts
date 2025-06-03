import { HttpStatusCode } from "axios";

import { uploadFile } from "../../google-drive/google-drive.service";
import { STUDENT_ERROR_RESPONSE } from "../../user/student.error";
import { customError, isCustomError } from "../../utils/error/custom-error";
import { findStudentByUserId, updateStudentTranscript } from "../student.repository";

export const uploadTranscript = async (userId: number, transcript: File) => {
  try {
    const student = await findStudentByUserId(userId);

    if (!student) {
      throw customError(
        STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
        STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
        HttpStatusCode.NotFound
      );
    }

    const { id: transcriptId } = await uploadFile(transcript);

    await updateStudentTranscript(student.id, transcriptId);
  } catch (error) {
    if (isCustomError(error)) {
      throw error;
    }

    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.InternalServerError
    );
  }
};
