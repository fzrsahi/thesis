import { Prisma } from "@prisma/client";

import { PersonalDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";

import { prisma } from "../prisma/prisma";

export const findUserByEmail = (
  email: string,
  fields: Prisma.UserSelect = {
    id: true,
    email: true,
    password: true,
    createdAt: true,
    updatedAt: true,
  }
) =>
  prisma.user.findUnique({
    where: { email },
    select: fields,
  });

export const findUserById = (
  id: number,
  fields: Prisma.UserSelect = {
    id: true,
    email: true,
    password: true,
    createdAt: true,
    updatedAt: true,
  }
) =>
  prisma.user.findUnique({
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
