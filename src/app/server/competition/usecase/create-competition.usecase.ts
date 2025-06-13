import { generateCompetitionEmbedding } from "@/app/server/model/azure/azure-openai.service";
import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { createEmbedding } from "../../embedding/embedding.repository";
import { createCompetition } from "../competition.repository";

export const createCompetitionUsecase = async (payload: CreateCompetitionPayload) => {
  const competition = await createCompetition(payload);
  const vector = await generateCompetitionEmbedding(payload);

  await createEmbedding({
    model: "text-embedding-3-small",
    vector,
    metadata: {
      type: "competition",
      id: Number(competition.id),
    },
  });
};
