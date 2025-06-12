import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { prisma } from "../prisma/prisma";

export const createCompetition = async (payload: CreateCompetitionPayload) =>
  prisma.competition.create({
    data: payload,
  });

export const getCompetitions = async () => prisma.competition.findMany();

export const findManyCompetitionsByIds = async (ids: number[]) =>
  prisma.competition.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

export const findRandomCompetitions = async (limit: number) =>
  prisma.competition.findMany({
    take: limit,
  });
