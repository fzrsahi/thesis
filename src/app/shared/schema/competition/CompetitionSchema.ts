import { z } from "zod";

import { paths } from "../../types/api";
import { InferZodMap } from "../../utils/zod/zodTypeHelper";

type CreateCompetitionRequest =
  paths["/competitions"]["post"]["requestBody"]["content"]["application/json"];

export const createCompetitionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  field: z.array(z.string()).min(1),
  type: z.string().nullable(),
  minGPA: z.string().nullable(),
  requirements: z.object({
    teamComposition: z.string().nullable(),
    originality: z.string().nullable(),
    other: z.string().nullable(),
  }),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  location: z.string().nullable(),
  organizer: z.string().nullable(),
  evaluationCriteria: z.object({
    preliminaryRound: z.string().nullable(),
    finalRound: z.string().nullable(),
    other: z.string().nullable(),
  }),
  competitionStatistics: z.object({
    summary: z.string().nullable(),
    totalApplicantsPastYear: z.array(
      z.object({
        count: z.number().nullable(),
        year: z.string().nullable(),
      })
    ),
    pastUngParticipants: z.array(
      z.object({
        year: z.string(),
        name: z.string(),
        count: z.number(),
      })
    ),
  }),
  sourceUrl: z.string().min(1),
  relevantCourses: z.array(z.string()),
  relevantSkills: z.array(z.string()),
} satisfies InferZodMap<CreateCompetitionRequest>);

export type CreateCompetitionPayload = z.infer<typeof createCompetitionSchema>;
