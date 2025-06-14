import { CreateCompetitionPayload } from "@/app/shared/schema/competition/CompetitionSchema";

import { prisma } from "../prisma/prisma";

export const createCompetition = async (
  payload: CreateCompetitionPayload,
  competitionText: string
) =>
  prisma.competitions.create({
    data: {
      title: payload.title,
      description: payload.description,
      field: payload.field,
      type: payload.type,
      minGPA: payload.minGPA,
      requirements: payload.requirements,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      location: payload.location,
      organizer: payload.organizer,
      evaluationCriteria: payload.evaluationCriteria,
      sourceUrl: payload.sourceUrl,
      relevantCourses: payload.relevantCourses,
      relevantSkills: payload.relevantSkills,
      competitionStats: {
        create: {
          summary: payload.competitionStatistics.summary,
          totalApplicantsPastYear: {
            createMany: {
              data: payload.competitionStatistics.totalApplicantsPastYear,
            },
          },
          pastUngParticipants: {
            createMany: {
              data: payload.competitionStatistics.pastUngParticipants,
            },
          },
        },
      },
      content: competitionText,
    },
  });

export const getCompetitions = async () => prisma.competitions.findMany();

export const findManyCompetitionsByIds = async (ids: number[]) =>
  prisma.competitions.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

export const findRandomCompetitions = async (limit: number) =>
  prisma.competitions.findMany({
    take: limit,
  });
