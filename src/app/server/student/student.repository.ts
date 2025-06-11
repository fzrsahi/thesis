import { Prisma } from "@prisma/client";

import {
  AcademicDataPayload,
  PersonalDataPayload,
} from "@/app/shared/schema/student/profile/ProfileSchema";

import { prisma } from "../prisma/prisma";

export const findStudentByUserId = (
  userId: number,
  fields: Prisma.StudentSelect = {
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  }
) =>
  prisma.student.findFirst({
    where: { userId },
    select: fields,
  });

export const updateStudentPersonalData = (userId: number, data: PersonalDataPayload) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      Student: {
        update: {
          studentId: data.student_id,
        },
      },
    },
  });

export const updateStudentAcademicData = async (studentId: number, data: AcademicDataPayload) => {
  await prisma.achievement.deleteMany({
    where: {
      studentId,
    },
  });

  await prisma.experience.deleteMany({
    where: {
      studentId,
    },
  });

  return prisma.student.update({
    where: { id: studentId },
    data: {
      gpa: data.gpa,
      interests: data.interests,
      skills: data.skills,
      achievements: {
        createMany: {
          data:
            data.achievements?.map((achievement) => ({
              ...achievement,
              date: new Date(achievement.date),
            })) || [],
        },
      },
      experiences: {
        createMany: {
          data:
            data.experiences?.map((experience) => ({
              ...experience,
              startDate: new Date(experience.startDate),
              endDate: experience.endDate ? new Date(experience.endDate) : undefined,
            })) || [],
        },
      },
    },
  });
};
