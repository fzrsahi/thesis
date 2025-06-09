import { getFileById } from "../google-drive/google-drive.service";
import { generateVector } from "../model/generate-vector";
import { STUDENT_ERROR_RESPONSE } from "../student/student.error";
import { findStudentByUserId } from "../student/student.repository";
import { customError } from "../utils/error/custom-error";
import { HttpStatusCode } from "axios";

export const generateRecommendationUsecase = async (userId: number) => {
  const studentProfile = await handleStudentProfile(userId);

  const profileText =
    `IPK: ${studentProfile.gpa}, Minat: ${studentProfile.interests.join(", ")}, ` +
    `Prestasi: ${studentProfile.achievements.map((a) => `${a.title} (${a.date.getFullYear()}) - ${a.description}`).join(", ")}, ` +
    `Pengalaman: ${studentProfile.experiences.map((e) => `${e.organization} - ${e.position} (${e.startDate.getFullYear()} - ${e.endDate ? e.endDate.getFullYear() : "Sekarang"}) - ${e.description}`).join(", ")}`;

  const transcriptFileIds = studentProfile.transcript.map((t) => t.fileId);
  const transcriptFile = await getFileById(transcriptFileIds[0]);

  const vector = await generateVector(profileText);

  return transcriptFile;
};

const handleStudentProfile = async (userId: number) => {
  const student = await findStudentByUserId(userId, {
    gpa: true,
    interests: true,
    experiences: true,
    achievements: true,
    transcript: true,
  });

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  if (
    !student.experiences?.length ||
    !student.achievements?.length ||
    !student.transcript?.length ||
    !student.gpa ||
    !student.interests?.length
  ) {
    console.log({
      experiences: student.experiences?.length,
      achievements: student.achievements?.length,
      transcript: student.transcript?.length,
      gpa: student.gpa,
      interests: student.interests?.length,
    });
    throw customError(
      STUDENT_ERROR_RESPONSE.NOT_COMPLETED_PROFILE.code,
      STUDENT_ERROR_RESPONSE.NOT_COMPLETED_PROFILE.message,
      HttpStatusCode.BadRequest
    );
  }

  return student;
};
