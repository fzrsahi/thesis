import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";

import { getFileUrl } from "../../google-storage/google-storage.service";
import { STUDENT_ERROR_RESPONSE } from "../../user/student.error";
import { customError } from "../../utils/error/custom-error";
import { findStudentById } from "../student.repository";

const studentFields: Prisma.StudentSelect = {
  id: true,
  user: {
    select: {
      name: true,
      email: true,
    },
  },
  studentId: true,
  transcript: {
    select: {
      id: true,
      fileId: true,
      semester: true,
      transcriptText: true,
    },
  },
  achievements: true,
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
  gpa: true,
  interests: true,
  skills: true,
  createdAt: true,
  updatedAt: true,
  recommendations: {
    select: {
      id: true,
      studentId: true,
      prompt: true,
      studentSummary: true,
      overallAssessment: true,
      competitionRecommendations: {
        select: {
          id: true,
          competitionId: true,
          competitionName: true,
        },
      },
      developmentSuggestions: {
        select: {
          id: true,
          type: true,
          title: true,
          link: true,
          reason: true,
        },
      },
      skillsProfiles: {
        select: {
          id: true,
          skillName: true,
          score: true,
          breakdown: true,
        },
      },
    },
  },
};

export const getStudentDetailUsecase = async (id: number) => {
  const student = await findStudentById(id, studentFields);

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  return {
    ...student,
    transcript: await Promise.all(
      (student.transcript ?? []).map(async (transcript) => ({
        id: transcript.id,
        fileId: transcript.fileId,
        semester: transcript.semester,
        transcriptText: transcript.transcriptText,
        fileUrl: await getFileUrl(transcript.fileId),
      }))
    ),
  };
};
