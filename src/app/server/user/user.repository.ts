import { Prisma, User } from "@prisma/client";

import { prisma } from "../prisma/prisma";

type userCreate = Omit<User, "id" | "createdAt" | "updatedAt">;

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

export const createUser = (user: userCreate) =>
  prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
      name: user.name,
    },
  });
