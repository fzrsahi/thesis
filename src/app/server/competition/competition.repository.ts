import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";
import { prisma } from "../prisma/prisma";

export const createCompetition = async (payload: CreateCompetitionPayload) => {
  return prisma.competition.create({
    data: payload,
  });
};
