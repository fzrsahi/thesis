import { Prisma } from "@prisma/client";

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
