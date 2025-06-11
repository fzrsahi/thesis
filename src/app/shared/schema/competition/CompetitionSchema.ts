import { z } from "zod";

import { paths } from "../../types/api";
import { InferZodMap } from "../../utils/zod/zodTypeHelper";

type CreateCompetitionRequest =
  paths["/competitions"]["post"]["requestBody"]["content"]["application/json"];

export const createCompetitionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  field: z.array(z.string()).min(1),
  type: z.string().min(1),
  minGPA: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  location: z.string().optional(),
  organizer: z.string().optional(),
  requirements: z.object({}).optional(),
} satisfies InferZodMap<CreateCompetitionRequest>);

export type CreateCompetitionPayload = z.infer<typeof createCompetitionSchema>;
