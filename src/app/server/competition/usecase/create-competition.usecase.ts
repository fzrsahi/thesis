import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";
import { createCompetition } from "../competition.repository";
import { generateCompetitionEmbedding } from "@/app/server/model/azure/azure-openai.service";
import { createEmbedding } from "../../embedding/embedding.repository";

export const createCompetitionUsecase = async (payload: CreateCompetitionPayload) => {
  const competition = await createCompetition(payload);
  const vector = await generateCompetitionEmbedding({
    title: payload.title,
    description: payload.description,
    field: payload.field,
    type: payload.type,
    minGPA: payload.minGPA ? Number(payload.minGPA) : undefined,
    requirements: payload.requirements,
    location: payload.location,
    organizer: payload.organizer,
  });

  await createEmbedding({
    model: "text-embedding-3-small",
    vector: vector,
    metadata: {
      type: "competition",
      id: Number(competition.id),
    },
  });
};
