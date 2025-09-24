import { Advisor, Prisma } from "@prisma/client";

import { prisma } from "../prisma/prisma";
import { paginate } from "../utils/pagination/paginate";
import { PaginatedResult, PaginationParams } from "../utils/pagination/pagination.types";

type createAdvisorPayload = Pick<Advisor, "userId" | "type" | "studyProgramId">;
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

export type AdvisorListItem = {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
  };
};

export const getAdvisors = async (
  pagination?: PaginationParams
): Promise<PaginatedResult<AdvisorListItem>> => {
  let where: Prisma.AdvisorWhereInput | undefined;

  if (pagination?.keywords) {
    const keyword = pagination.keywords;
    where = {
      user: {
        OR: [
          { name: { contains: keyword as string, mode: "insensitive" } },
          { email: { contains: keyword as string, mode: "insensitive" } },
        ],
      },
    };
  }

  return paginate<AdvisorListItem, Prisma.AdvisorWhereInput>(
    {
      count: (args) => prisma.advisor.count({ where: args.where }),
      findMany: (args) =>
        prisma.advisor.findMany({
          where: args.where,
          select: {
            id: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            type: true,
            user: { select: { name: true, email: true } },
            studyProgram: { select: { id: true, name: true } },
          },
          orderBy: { id: "asc" },
          skip: args.skip,
          take: args.take,
        }) as unknown as Promise<AdvisorListItem[]>,
    },
    pagination,
    { where }
  );
};

export const createAdvisor = async (payload: createAdvisorPayload) =>
  prisma.advisor.create({
    data: {
      userId: payload.userId,
      type: payload.type,
      studyProgramId: payload.studyProgramId,
    },
  });

export const findAdvisorById = async (id: number) => prisma.advisor.findUnique({ where: { id } });

export const deleteAdvisorById = async (id: number) => prisma.advisor.delete({ where: { id } });
