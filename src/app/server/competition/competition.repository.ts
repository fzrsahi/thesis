import { competitions, Prisma } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { prisma } from "../prisma/prisma";
import { paginate } from "../utils/pagination/paginate";
import { PaginatedResult, PaginationParams } from "../utils/pagination/pagination.types";

export type competitionsListItem = {
  id: number;
  title: string;
  description: string;
  organizer: string;
};
export const createCompetition = async (
  payload: CreateCompetitionPayload,
  competitionText?: string
) =>
  prisma.competitions.create({
    data: {
      title: payload.title,
      description: payload.description,
      field: payload.field,
      type: payload.type,
      minGPA: payload.minGPA,
      requirements: payload.requirements,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      location: payload.location,
      organizer: payload.organizer,
      evaluationCriteria: payload.evaluationCriteria,
      sourceUrl: payload.sourceUrl,
      relevantCourses: payload.relevantCourses,
      relevantSkills: payload.relevantSkills,
      competitionStats: {
        create: {
          summary: payload.competitionStatistics.summary,
          totalApplicantsPastYear: {
            createMany: {
              data: payload.competitionStatistics.totalApplicantsPastYear,
            },
          },
          pastUngParticipants: {
            createMany: {
              data: payload.competitionStatistics.pastUngParticipants,
            },
          },
        },
      },
      content: competitionText,
    },
  });

export const getCompetitions = async (
  pagination?: PaginationParams
): Promise<PaginatedResult<competitionsListItem>> => {
  let where: Prisma.competitionsWhereInput | undefined;

  if (pagination?.keywords) {
    const keyword = pagination.keywords;
    where = {
      OR: [
        { title: { contains: keyword as string, mode: "insensitive" } },
        { description: { contains: keyword as string, mode: "insensitive" } },
        { organizer: { contains: keyword as string, mode: "insensitive" } },
        { type: { contains: keyword as string, mode: "insensitive" } },
      ],
    };
  }

  return paginate<competitionsListItem, Prisma.competitionsWhereInput>(
    {
      count: (args) => prisma.competitions.count({ where: args.where }),
      findMany: (args) =>
        prisma.competitions.findMany({
          where: args.where,
          orderBy: { id: "asc" },
          skip: args.skip,
          take: args.take,
          select: {
            id: true,
            title: true,
            description: true,
            organizer: true,
            field: true,
            type: true,
            startDate: true,
            endDate: true,
          },
        }) as unknown as Promise<competitionsListItem[]>,
    },
    pagination,
    { where }
  );
};

export const findManyCompetitionsByIds = async (
  ids: number[],
  select?: Prisma.competitionsSelect
) =>
  prisma.competitions.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select,
  });

export const findRandomCompetitions = async (limit: number) =>
  prisma.competitions.findMany({
    take: limit,
  });

export const updateCompetitionById = async (id: number, payload: competitions) =>
  prisma.competitions.update({
    where: { id },
    data: {
      title: payload.title,
      description: payload.description,
      field: payload.field,
      type: payload.type,
      organizer: payload.organizer,
      sourceUrl: payload.sourceUrl,
      minGPA: payload.minGPA,
      startDate: payload.startDate,
      endDate: payload.endDate,
      location: payload.location,
      evaluationCriteria: payload.evaluationCriteria as InputJsonValue,
      relevantCourses: payload.relevantCourses,
      relevantSkills: payload.relevantSkills,
      content: payload.content,
      fileId: payload.fileId,
      updatedAt: payload.updatedAt,
    },
  });
