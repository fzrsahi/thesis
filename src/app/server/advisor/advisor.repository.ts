import { Prisma } from "@prisma/client";

import { prisma } from "../prisma/prisma";

export const findAdvisorByUserId = async (
  userId: number,
  fields: Prisma.AdvisorSelect = {
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  }
) =>
  prisma.advisor.findUnique({
    where: { userId },
    select: fields,
  });
