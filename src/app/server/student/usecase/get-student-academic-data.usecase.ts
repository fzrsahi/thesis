import { HttpStatusCode } from "axios";

import { getFileUrl } from "../../google-storage/google-storage.service";
import { customError } from "../../utils/error/custom-error";
import { STUDENT_ERROR_RESPONSE } from "../student.error";
import { findStudentByUserId } from "../student.repository";

export const getStudentAcademicDataUsecase = async (userId: number) => {
  const student = await findStudentByUserId(userId, {
    gpa: true,
    interests: true,
    skills: true,
    achievements: {
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        fileUrl: true,
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
        fileUrl: true,
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

  // Resolve signed URLs like transcript behavior if a file identifier is stored
  const achievements = await Promise.all(
    (student.achievements || []).map(async (a) => ({
      ...a,
      fileUrl: a.fileUrl && !a.fileUrl.startsWith("http") ? await getFileUrl(a.fileUrl) : a.fileUrl,
    }))
  );
  const experiences = await Promise.all(
    (student.experiences || []).map(async (e) => ({
      ...e,
      fileUrl: e.fileUrl && !e.fileUrl.startsWith("http") ? await getFileUrl(e.fileUrl) : e.fileUrl,
    }))
  );

  return {
    ...student,
    achievements,
    experiences,
  };
};
