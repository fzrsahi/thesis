import { z } from "zod";

export const CompetitionRequirementsSchema = z.object({
  teamComposition: z.string().nullable(),
  originality: z.string().nullable(),
  other: z.string().nullable(),
});

export const CompetitionEvaluationCriteriaSchema = z.object({
  preliminaryRound: z.string().nullable(),
  finalRound: z.string().nullable(),
  other: z.string().nullable(),
});

export const CompetitionStatisticsSchema = z.object({
  summary: z.string().nullable(),
  totalApplicantsPastYear: z.array(
    z.object({
      year: z.string().nullable(),
      count: z.number().nullable(),
    })
  ).nullable(),
  pastUngParticipants: z.array(
    z.object({
      year: z.string().nullable(),
      name: z.string().nullable(),
      count: z.number().nullable(),
    })
  ).nullable(),
});

export const CompetitionResponseSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  field: z.array(z.string()),
  type: z.string().nullable(),
  minGPA: z.string().nullable(),
  requirements: CompetitionRequirementsSchema,
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  location: z.string().nullable(),
  organizer: z.string().nullable(),
  evaluationCriteria: CompetitionEvaluationCriteriaSchema,
  sourceUrl: z.string().nullable(),
  relevantCourses: z.array(z.string()),
  relevantSkills: z.array(z.string()),
  competitionStatistics: CompetitionStatisticsSchema.nullable(),
});

export type CompetitionResponse = z.infer<typeof CompetitionResponseSchema>; 