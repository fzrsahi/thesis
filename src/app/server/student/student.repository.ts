import { Prisma } from "@prisma/client";

import { prisma } from "../prisma/prisma";

export const findStudentByUserId = async (
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
