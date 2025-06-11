import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";
import { createCompetition } from "../competition.repository";

export const createCompetitionUsecase = async (payload: CreateCompetitionPayload) => {
  const competition = await createCompetition(payload);
};
