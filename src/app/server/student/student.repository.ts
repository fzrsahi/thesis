import { Prisma, Student } from "@prisma/client";

import {
  AcademicDataPayload,
  PersonalDataPayload,
} from "@/app/shared/schema/student/profile/ProfileSchema";

import { prisma } from "../prisma/prisma";
import { paginate } from "../utils/pagination/paginate";
import { PaginationParams, PaginatedResult } from "../utils/pagination/pagination.types";

type studentCreate = Pick<Student, "userId" | "studentId" | "entryYear" | "studyProgramId">;

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

export const findStudentById = (
  id: number,
  fields: Prisma.StudentSelect = {
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  }
) =>
  prisma.student.findFirst({
    where: { id },
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
      interests: data.interests,
      skills: data.skills,
      achievements: {
        createMany: {
          data:
            data.achievements?.map((achievement) => ({
              title: achievement.title,
              description: achievement.description,
              fileUrl: (achievement as { fileUrl?: string | null }).fileUrl ?? null,
              date: new Date(achievement.date),
            })) || [],
        },
      },
      experiences: {
        createMany: {
          data:
            data.experiences?.map((experience) => ({
              organization: experience.organization,
              position: experience.position,
              description: experience.description,
              fileUrl: (experience as { fileUrl?: string | null }).fileUrl ?? null,
              startDate: new Date(experience.startDate),
              endDate: experience.endDate ? new Date(experience.endDate) : undefined,
            })) || [],
        },
      },
    },
  });
};

export const createStudent = (data: studentCreate) =>
  prisma.student.create({
    data: {
      userId: data.userId,
      studentId: data.studentId,
      studyProgramId: data.studyProgramId,
      entryYear: data.entryYear,
    },
  });

export const findStudentByStudentId = (
  studentId: string,
  fields: Prisma.StudentSelect = {
    id: true,
    userId: true,
    studentId: true,
    createdAt: true,
    updatedAt: true,
  }
) =>
  prisma.student.findFirst({
    where: { studentId },
    select: fields,
  });

export type StudentListItem = {
  id: number;
  userId: number;
  studentId: string | null;
  studyProgramId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
  };
};

export type StudentFilter = {
  studyProgramId?: number;
  entryYear?: number;
};

export const getStudents = async (
  pagination?: PaginationParams,
  filter?: StudentFilter
): Promise<PaginatedResult<StudentListItem>> => {
  const where: Prisma.StudentWhereInput = {};

  if (pagination?.keywords) {
    const keyword = pagination.keywords;
    where.OR = [
      { user: { name: { contains: keyword as string, mode: "insensitive" } } },
      { user: { email: { contains: keyword as string, mode: "insensitive" } } },
      { studentId: { contains: keyword as string, mode: "insensitive" } },
    ];
  }

  if (filter?.studyProgramId) {
    where.studyProgramId = filter.studyProgramId;
  }
  if (filter?.entryYear) {
    where.entryYear = filter.entryYear;
  }

  return paginate<StudentListItem, Prisma.StudentWhereInput>(
    {
      count: (args) => prisma.student.count({ where: args.where }),
      findMany: (args) =>
        prisma.student.findMany({
          where: args.where,
          select: {
            id: true,
            userId: true,
            studentId: true,
            studyProgramId: true,
            createdAt: true,
            updatedAt: true,
            gpa: true,
            user: { select: { name: true, email: true } },
            studyProgram: { select: { name: true } },
            entryYear: true,
          },
          orderBy: { id: "asc" },
          skip: args.skip,
          take: args.take,
        }) as unknown as Promise<StudentListItem[]>,
    },
    pagination,
    { where }
  );
};

export const deleteStudentByUserId = (userId: number) =>
  prisma.student.delete({
    where: { userId },
  });

export const deleteStudentGPA = (studentId: number) =>
  prisma.student.update({
    where: { id: studentId },
    data: { gpa: null },
  });
