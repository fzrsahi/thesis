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
  studyProgram: { select: { id: true, name: true } },
  entryYear: true,
  transcript: {
    select: {
      id: true,
      fileId: true,
      semester: true,
      transcriptText: true,
    },
  },
  achievements: {
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      createdAt: true,
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

  const achievementsWithUrls = await Promise.all(
    (student.achievements ?? []).map(async (a) => ({
      ...a,
      fileUrl: a.fileUrl && !a.fileUrl.startsWith("http") ? await getFileUrl(a.fileUrl) : a.fileUrl,
    }))
  );

  const experiencesWithUrls = await Promise.all(
    (student.experiences ?? []).map(async (e) => ({
      ...e,
      fileUrl: e.fileUrl && !e.fileUrl.startsWith("http") ? await getFileUrl(e.fileUrl) : e.fileUrl,
    }))
  );

  const transcriptWithUrls = await Promise.all(
    (student.transcript ?? []).map(async (transcript) => ({
      id: transcript.id,
      fileId: transcript.fileId,
      semester: transcript.semester,
      transcriptText: transcript.transcriptText,
      fileUrl: await getFileUrl(transcript.fileId),
    }))
  );

  return {
    ...student,
    achievements: achievementsWithUrls,
    experiences: experiencesWithUrls,
    transcript: transcriptWithUrls,
  };
};
