import { HttpStatusCode } from "axios";

import { getFileUrl } from "../../google-storage/google-storage.service";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { getTranscriptsByStudentId } from "../transcript.repository";

export const getStudentTranscripts = async (userId: number) => {
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const transcripts = await getTranscriptsByStudentId(student.id, {
    id: true,
    semester: true,
    fileId: true,
  });

  return transcripts.map((transcript) => ({
    id: transcript.id,
    semester: transcript.semester,
    fileUrl: getFileUrl(transcript.fileId),
  }));
};
