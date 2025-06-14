import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { createCompetition } from "../competition.repository";
import { generateCompetitionText, storeToVectorStore } from "../helper/competition.helper";

export const createCompetitionUsecase = async (payload: CreateCompetitionPayload) => {
  const competitionText = generateCompetitionText(payload);
  const competition = await createCompetition(payload, competitionText);

  await storeToVectorStore(competition, competitionText);
  return competition;
};
