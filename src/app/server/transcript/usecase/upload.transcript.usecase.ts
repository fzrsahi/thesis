import { HttpStatusCode } from "axios";

import { uploadFile } from "../../google-drive/google-drive.service";
import { STUDENT_ERROR_RESPONSE } from "../../user/student.error";
import { customError } from "../../utils/error/custom-error";
import { findStudentByUserId } from "../../student/student.repository";
import { UploadTranscriptPayload } from "@/app/shared/schema/student/profile/TranscriptSchema";
import { createTranscript } from "../transcript.repository";

export const uploadTranscript = async (userId: number, payload: UploadTranscriptPayload) => {
  try {
    const student = await findStudentByUserId(userId);

    if (!student) {
      throw customError(
        STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
        STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
        HttpStatusCode.NotFound
      );
    }

    const { id: transcriptId } = await uploadFile(payload.transcript);

    await createTranscript(student.id, {
      fileId: transcriptId,
      semester: payload.semester,
    });
  } catch (error) {
    throw error;
  }
};
