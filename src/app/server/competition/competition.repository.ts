import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { prisma } from "../prisma/prisma";

export const createCompetition = async (payload: CreateCompetitionPayload) => prisma.competition.create({
    data: payload,
  });
