import { Prisma, User } from "@prisma/client";

import { prisma } from "../prisma/prisma";

type userCreate = {
  email: string;
  password: string;
  name: string;
};

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

export const updateUserProfile = (
  id: number,
  data: Partial<Pick<User, "name" | "email" | "password">>
) =>
  prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
