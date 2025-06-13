import { z } from "zod";
import { paths } from "../../types/api";
import { InferZodMap } from "../../utils/zod/zodTypeHelper";

type CreateCompetitionGenerateRequest =
  paths["/competitions/generate"]["post"]["requestBody"]["content"]["application/json"];

export const competitionGenerateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  website: z.string().min(1),
  addition_details: z.string().optional(),
} satisfies InferZodMap<CreateCompetitionGenerateRequest>);

export type CreateCompetitionGeneratePayload = z.infer<typeof competitionGenerateSchema>;


