import { getFileUrl } from "../../google-drive/google-drive.service";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { getTranscriptsByStudentId } from "../transcript.repository";
import { HttpStatusCode } from "axios";
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

  return await Promise.all(
    transcripts.map(async (transcript) => ({
      id: transcript.id,
      semester: transcript.semester,
      fileUrl: await getFileUrl(transcript.fileId),
    }))
  );
};
