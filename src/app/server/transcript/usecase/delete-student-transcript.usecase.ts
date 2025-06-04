import { HttpStatusCode } from "axios";

import { findStudentByUserId } from "../../student/student.repository";
import { STUDENT_ERROR_RESPONSE } from "../../user/student.error";
import { customError } from "../../utils/error/custom-error";
import { TRANSCRIPT_ERROR_RESPONSE } from "../transcript.error";
import {
  deleteTranscriptByIdAndStudentId,
  findTranscriptByIdAndStudentId,
} from "../transcript.repository";

export const deleteStudentTranscriptUsecase = async (userId: number, transcriptId: number) => {
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const transcript = await findTranscriptByIdAndStudentId(transcriptId, student.id, {
    id: true,
  });

  // TODO : delete file from storage

  if (!transcript) {
    throw customError(
      TRANSCRIPT_ERROR_RESPONSE.NOT_FOUND.code,
      TRANSCRIPT_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  await deleteTranscriptByIdAndStudentId(transcript.id, student.id);
};
