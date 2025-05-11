import { Prisma } from "@prisma/client";

import { prisma } from "../prisma/prisma";

export const findAdminByUserId = async (
  userId: number,
  fields: Prisma.AdminSelect = {
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  }
) =>
  prisma.admin.findFirst({
    where: { userId },
    select: fields,
  });
