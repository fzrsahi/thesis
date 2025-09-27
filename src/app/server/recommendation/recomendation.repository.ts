import { Prisma } from "@prisma/client";

import { paginate } from "@/app/server/utils/pagination/paginate";
import { PaginationParams } from "@/app/server/utils/pagination/pagination.types";

import { RecommendationResponse } from "../model/types/recomendation.types";
import { prisma } from "../prisma/prisma";

export const findRecommendationByStudentId = async (
  studentId: number,
  select: Prisma.RecommendationSelect = {
    id: true,
    studentId: true,
    prompt: true,
    studentSummary: true,
    overallAssessment: true,
    createdAt: true,
    skillsProfiles: {
      select: {
        skillName: true,
        score: true,
        breakdown: true,
      },
    },
    competitionRecommendations: {
      select: {
        competitionId: true,
        competitionName: true,
        rank: true,
        matchScore: true,
        matchReason: true,
        reasoning: true,
        keyFactors: true,
        preparationTips: true,
        skillRequirements: true,
        feedbackScore: true,
        feedbackReason: true,
        createdAt: true,
      },
    },
    developmentSuggestions: {
      select: {
        type: true,
        title: true,
        link: true,
        reason: true,
      },
    },
  }
) =>
  prisma.recommendation.findFirst({
    where: {
      studentId,
    },
    select,
  });

type CreateRecommendationArgs = {
  studentId: number;
  prompt: string;
  recommendation: RecommendationResponse;
};

export const createRecommendation = async ({
  studentId,
  prompt,
  recommendation,
}: CreateRecommendationArgs) =>
  prisma.$transaction(async (tx) => {
    // Create main recommendation record
    const mainRecommendation = await tx.recommendation.create({
      data: {
        studentId,
        prompt,
        studentSummary: recommendation.studentSummary,
        overallAssessment: JSON.stringify(recommendation.overallAssessment),
      },
    });

    // Create skill profiles
    await tx.recommendationSkillProfile.createMany({
      data: Object.entries(recommendation.skillsProfile).map(([skillName, profile]) => ({
        recommendationId: mainRecommendation.id,
        skillName,
        score: profile.score,
        breakdown: profile.breakdown,
      })),
    });

    // Create competition recommendations
    await tx.recommendationCompetition.createMany({
      data: recommendation.recommendations.map((rec) => ({
        recommendationId: mainRecommendation.id,
        competitionId: rec.id,
        competitionName: rec.competitionName,
        rank: rec.rank,
        matchScore: rec.matchScore.score,
        matchReason: rec.matchScore.reason,
        reasoning: JSON.stringify(rec.reasoning),
        keyFactors: rec.keyFactors ? JSON.stringify(rec.keyFactors) : null,
        preparationTips: rec.preparationTips ? JSON.stringify(rec.preparationTips) : null,
        skillRequirements: JSON.stringify(rec.skillRequirements),
      })),
    });

    await tx.recommendationDevelopmentSuggestion.createMany({
      data: recommendation.developmentSuggestions.map((suggestion) => ({
        recommendationId: mainRecommendation.id,
        type: suggestion.type,
        title: suggestion.title,
        link: suggestion.link,
        reason: suggestion.reason,
      })),
    });

    return mainRecommendation;
  });

type GetRecommendationsOverviewFilter = {
  studyProgramId?: number;
  entryYear?: number;
  competitionId?: number;
  minMatchScore?: number;
  keywords?: string;
};

type CompetitionGroup = {
  competition: {
    id: number;
    title: string;
    field: string[];
    type: string | null;
    organizer: string | null;
  };
  students: Array<{
    student: {
      id: number;
      name: string;
      email: string;
      studentId: string | null;
      studyProgram: {
        id: number;
        name: string;
      };
      entryYear: number;
    };
    recommendation: {
      id: number;
      rank: number;
      matchScore: number;
      createdAt: Date;
    };
  }>;
  statistics: {
    totalStudents: number;
    averageMatchScore: number;
    highestScore: number;
    lowestScore: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
    };
  };
};

type RecommendationsOverviewResult = {
  data: CompetitionGroup[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary: {
    totalStudents: number;
    totalCompetitions: number;
    averageMatchScore: number;
    topCompetitions: Array<{
      competitionId: number;
      competitionName: string;
      studentCount: number;
      averageScore: number;
    }>;
  };
};

export const getRecommendationsOverview = async (
  pagination: PaginationParams,
  filter: GetRecommendationsOverviewFilter
): Promise<RecommendationsOverviewResult> => {
  const { studyProgramId, entryYear, competitionId, minMatchScore, keywords } = filter;

  const recommendationWhereClause: Prisma.RecommendationWhereInput = {
    competitionRecommendations: {
      some: {
        ...(competitionId && { competitionId }),
        ...(minMatchScore && { matchScore: { gte: minMatchScore } }),
      },
    },
    student: {
      ...(studyProgramId && { studyProgramId }),
      ...(entryYear && { entryYear }),
      ...(keywords && {
        OR: [
          { user: { name: { contains: keywords, mode: "insensitive" } } },
          { user: { email: { contains: keywords, mode: "insensitive" } } },
          { studentId: { contains: keywords, mode: "insensitive" } },
        ],
      }),
    },
  };

  const competitions = await prisma.competitions.findMany({
    where: {
      ...(competitionId && { id: competitionId }),
    },
    select: {
      id: true,
      title: true,
      field: true,
      type: true,
      organizer: true,
    },
    orderBy: { title: "asc" },
  });

  const competitionGroups = await Promise.all(
    competitions.map(async (competition) => {
      const recommendations = await prisma.recommendation.findMany({
        where: {
          ...recommendationWhereClause,
          competitionRecommendations: {
            some: {
              competitionId: competition.id,
              ...(minMatchScore && { matchScore: { gte: minMatchScore } }),
            },
          },
        },
        select: {
          id: true,
          studentId: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              studentId: true,
              entryYear: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
              studyProgram: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          competitionRecommendations: {
            where: {
              competitionId: competition.id,
            },
            select: {
              id: true,
              rank: true,
              matchScore: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const students = recommendations
        .filter((rec) => rec.student && rec.competitionRecommendations.length > 0)
        .map((rec) => {
          const competitionRec = rec.competitionRecommendations[0];

          return {
            student: {
              id: rec.student!.id,
              name: rec.student!.user.name,
              email: rec.student!.user.email,
              studentId: rec.student!.studentId,
              studyProgram: {
                id: rec.student!.studyProgram.id,
                name: rec.student!.studyProgram.name,
              },
              entryYear: rec.student!.entryYear,
            },
            recommendation: {
              id: competitionRec.id,
              rank: competitionRec.rank,
              matchScore: competitionRec.matchScore,
              createdAt: competitionRec.createdAt,
            },
          };
        });

      const matchScores = students.map((s) => s.recommendation.matchScore);
      const statistics = {
        totalStudents: students.length,
        averageMatchScore:
          matchScores.length > 0 ? matchScores.reduce((a, b) => a + b, 0) / matchScores.length : 0,
        highestScore: matchScores.length > 0 ? Math.max(...matchScores) : 0,
        lowestScore: matchScores.length > 0 ? Math.min(...matchScores) : 0,
        scoreDistribution: {
          excellent: matchScores.filter((score) => score >= 0.8).length,
          good: matchScores.filter((score) => score >= 0.6 && score < 0.8).length,
          fair: matchScores.filter((score) => score >= 0.4 && score < 0.6).length,
          poor: matchScores.filter((score) => score < 0.4).length,
        },
      };

      return {
        competition,
        students,
        statistics,
      };
    })
  );

  const filteredGroups = competitionGroups.filter((group) => group.students.length > 0);

  // Use pagination utility for competitions
  const paginatedResult = await paginate(
    {
      count: async () => filteredGroups.length,
      findMany: async ({ skip = 0, take = filteredGroups.length }) =>
        filteredGroups.slice(skip, skip + take),
    },
    pagination
  );

  const allMatchScores = filteredGroups.flatMap((group) =>
    group.students.map((s) => s.recommendation.matchScore)
  );
  const summary = {
    totalStudents: filteredGroups.reduce((sum, group) => sum + group.students.length, 0),
    totalCompetitions: filteredGroups.length,
    averageMatchScore:
      allMatchScores.length > 0
        ? allMatchScores.reduce((a, b) => a + b, 0) / allMatchScores.length
        : 0,
    topCompetitions: filteredGroups
      .map((group) => ({
        competitionId: group.competition.id,
        competitionName: group.competition.title,
        studentCount: group.students.length,
        averageScore: group.statistics.averageMatchScore,
      }))
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 5),
  };

  return {
    data: paginatedResult.data,
    pagination: paginatedResult.pagination,
    summary,
  };
};

type StudentGroup = {
  student: {
    id: number;
    name: string;
    email: string;
    studentId: string | null;
    studyProgram: {
      id: number;
      name: string;
    };
    entryYear: number;
  };
  competitions: Array<{
    competition: {
      id: number;
      title: string;
      field: string[];
      type: string | null;
      organizer: string | null;
    };
    recommendation: {
      id: number;
      rank: number;
      matchScore: number;
      createdAt: Date;
    };
  }>;
  statistics: {
    totalCompetitions: number;
    averageMatchScore: number;
    highestScore: number;
    lowestScore: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
    };
  };
};

type RecommendationsByStudentResult = {
  data: StudentGroup[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary: {
    totalStudents: number;
    totalCompetitions: number;
    averageMatchScore: number;
    topStudents: Array<{
      studentId: number;
      studentName: string;
      competitionCount: number;
      averageScore: number;
    }>;
  };
};

export const getRecommendationsByStudent = async (
  pagination: PaginationParams,
  filter: GetRecommendationsOverviewFilter
): Promise<RecommendationsByStudentResult> => {
  const { studyProgramId, entryYear, competitionId, minMatchScore, keywords } = filter;

  const students = await prisma.student.findMany({
    where: {
      ...(studyProgramId && { studyProgramId }),
      ...(entryYear && { entryYear }),
      ...(keywords && {
        OR: [
          { user: { name: { contains: keywords, mode: "insensitive" } } },
          { user: { email: { contains: keywords, mode: "insensitive" } } },
          { studentId: { contains: keywords, mode: "insensitive" } },
        ],
      }),
      recommendations: {
        some: {
          competitionRecommendations: {
            some: {
              ...(competitionId && { competitionId }),
              ...(minMatchScore && { matchScore: { gte: minMatchScore } }),
            },
          },
        },
      },
    },
    select: {
      id: true,
      studentId: true,
      entryYear: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      studyProgram: {
        select: {
          id: true,
          name: true,
        },
      },
      recommendations: {
        select: {
          id: true,
          createdAt: true,
          competitionRecommendations: {
            where: {
              ...(competitionId && { competitionId }),
              ...(minMatchScore && { matchScore: { gte: minMatchScore } }),
            },
            select: {
              id: true,
              competitionId: true,
              rank: true,
              matchScore: true,
              createdAt: true,
            },
            orderBy: {
              matchScore: "desc",
            },
          },
        },
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  const competitionIds = students
    .flatMap(
      (student) =>
        student.recommendations[0]?.competitionRecommendations.map(
          (compRec) => compRec.competitionId
        ) || []
    )
    .filter((id, index, arr) => arr.indexOf(id) === index);

  const competitions = await prisma.competitions.findMany({
    where: {
      id: { in: competitionIds },
    },
    select: {
      id: true,
      title: true,
      field: true,
      type: true,
      organizer: true,
    },
  });

  const competitionMap = new Map(competitions.map((comp) => [comp.id, comp]));

  const studentGroups = students
    .filter((student) => student.recommendations.length > 0)
    .map((student) => {
      const studentCompetitions = student.recommendations[0].competitionRecommendations.map(
        (compRec) => {
          const competition = competitionMap.get(compRec.competitionId);
          return {
            competition: competition || {
              id: compRec.competitionId,
              title: "Unknown Competition",
              field: [],
              type: null,
              organizer: null,
            },
            recommendation: {
              id: compRec.id,
              rank: compRec.rank,
              matchScore: compRec.matchScore,
              createdAt: compRec.createdAt,
            },
          };
        }
      );

      const matchScores = studentCompetitions.map((c) => c.recommendation.matchScore);
      const statistics = {
        totalCompetitions: studentCompetitions.length,
        averageMatchScore:
          matchScores.length > 0 ? matchScores.reduce((a, b) => a + b, 0) / matchScores.length : 0,
        highestScore: matchScores.length > 0 ? Math.max(...matchScores) : 0,
        lowestScore: matchScores.length > 0 ? Math.min(...matchScores) : 0,
        scoreDistribution: {
          excellent: matchScores.filter((score) => score >= 0.8).length,
          good: matchScores.filter((score) => score >= 0.6 && score < 0.8).length,
          fair: matchScores.filter((score) => score >= 0.4 && score < 0.6).length,
          poor: matchScores.filter((score) => score < 0.4).length,
        },
      };

      return {
        student: {
          id: student.id,
          name: student.user.name,
          email: student.user.email,
          studentId: student.studentId,
          studyProgram: student.studyProgram,
          entryYear: student.entryYear,
        },
        competitions: studentCompetitions,
        statistics,
      };
    });

  const paginatedResult = await paginate(
    {
      count: async () => studentGroups.length,
      findMany: async ({ skip = 0, take = studentGroups.length }) =>
        studentGroups.slice(skip, skip + take),
    },
    pagination
  );

  const allMatchScores = studentGroups.flatMap((group) =>
    group.competitions.map((c) => c.recommendation.matchScore)
  );
  const summary = {
    totalStudents: studentGroups.length,
    totalCompetitions: studentGroups.reduce((sum, group) => sum + group.competitions.length, 0),
    averageMatchScore:
      allMatchScores.length > 0
        ? allMatchScores.reduce((a, b) => a + b, 0) / allMatchScores.length
        : 0,
    topStudents: studentGroups
      .map((group) => ({
        studentId: group.student.id,
        studentName: group.student.name,
        competitionCount: group.competitions.length,
        averageScore: group.statistics.averageMatchScore,
      }))
      .sort((a, b) => b.competitionCount - a.competitionCount)
      .slice(0, 5),
  };

  return {
    data: paginatedResult.data,
    pagination: paginatedResult.pagination,
    summary,
  };
};

export const getRecomendationByCompetitionId = async (competitionId: number) => {
  const competition = await prisma.competitions.findUnique({
    where: { id: competitionId },
    select: {
      id: true,
      title: true,
      description: true,
      field: true,
      type: true,
      minGPA: true,
      location: true,
      organizer: true,
      startDate: true,
      endDate: true,
      sourceUrl: true,
      relevantCourses: true,
      relevantSkills: true,
      requirements: true,
      evaluationCriteria: true,
      competitionStats: {
        include: {
          totalApplicantsPastYear: true,
          pastUngParticipants: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!competition) {
    return null;
  }

  const recommendations = await prisma.recommendation.findMany({
    where: {
      competitionRecommendations: {
        some: { competitionId },
      },
    },
    select: {
      id: true,
      studentId: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          studentId: true,
          entryYear: true,
          gpa: true,
          interests: true,
          skills: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          studyProgram: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      competitionRecommendations: {
        where: { competitionId },
        select: {
          id: true,
          rank: true,
          matchScore: true,
          matchReason: true,
          reasoning: true,
          keyFactors: true,
          preparationTips: true,
          skillRequirements: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const students = recommendations
    .filter((rec) => rec.student && rec.competitionRecommendations.length > 0)
    .map((rec) => {
      const competitionRec = rec.competitionRecommendations[0];
      return {
        student: {
          id: rec.student!.id,
          name: rec.student!.user.name,
          email: rec.student!.user.email,
          studentId: rec.student!.studentId,
          studyProgram: {
            id: rec.student!.studyProgram.id,
            name: rec.student!.studyProgram.name,
          },
          entryYear: rec.student!.entryYear,
          gpa: rec.student!.gpa,
          interests: rec.student!.interests,
          skills: rec.student!.skills,
        },
        recommendation: {
          id: competitionRec.id,
          rank: competitionRec.rank,
          matchScore: competitionRec.matchScore,
          matchReason: competitionRec.matchReason,
          reasoning: competitionRec.reasoning ? JSON.parse(competitionRec.reasoning) : null,
          keyFactors: competitionRec.keyFactors ? JSON.parse(competitionRec.keyFactors) : null,
          preparationTips: competitionRec.preparationTips
            ? JSON.parse(competitionRec.preparationTips)
            : null,
          skillRequirements: competitionRec.skillRequirements
            ? JSON.parse(competitionRec.skillRequirements)
            : null,
          createdAt: competitionRec.createdAt,
        },
      };
    });

  const matchScores = students.map((s) => s.recommendation.matchScore);

  type StudyProgramGroup = {
    studyProgram: { id: number; name: string };
    students: typeof students;
    studentCount: number;
    averageScore: number;
    percentage?: number;
  };

  const studyProgramGroups = students.reduce(
    (acc, item) => {
      const programId = item.student.studyProgram.id;
      const programName = item.student.studyProgram.name;

      if (!acc[programId]) {
        acc[programId] = {
          studyProgram: { id: programId, name: programName },
          students: [],
          studentCount: 0,
          averageScore: 0,
        };
      }

      acc[programId].students.push(item);
      acc[programId].studentCount += 1;

      return acc;
    },
    {} as Record<number, StudyProgramGroup>
  );

  Object.values(studyProgramGroups).forEach((group) => {
    const scores = group.students.map((s) => s.recommendation.matchScore);
    const updatedGroup = group;
    updatedGroup.averageScore =
      scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
    updatedGroup.percentage = (group.studentCount / students.length) * 100;
  });

  type EntryYearGroup = {
    entryYear: number;
    students: typeof students;
    studentCount: number;
    averageScore: number;
    percentage?: number;
  };

  const entryYearGroups = students.reduce(
    (acc, item) => {
      const year = item.student.entryYear;

      if (!acc[year]) {
        acc[year] = {
          entryYear: year,
          students: [],
          studentCount: 0,
          averageScore: 0,
        };
      }

      acc[year].students.push(item);
      acc[year].studentCount += 1;

      return acc;
    },
    {} as Record<number, EntryYearGroup>
  );

  Object.values(entryYearGroups).forEach((group) => {
    const scores = group.students.map((s) => s.recommendation.matchScore);
    const updatedGroup = group;
    updatedGroup.averageScore =
      scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
    updatedGroup.percentage = (group.studentCount / students.length) * 100;
  });

  const topPerformers = students
    .sort((a, b) => b.recommendation.matchScore - a.recommendation.matchScore)
    .slice(0, 3)
    .map((item, index) => ({
      student: item.student,
      matchScore: item.recommendation.matchScore,
      rank: index + 1,
    }));

  return {
    competition: {
      id: competition.id,
      title: competition.title,
      description: competition.description,
      field: competition.field,
      type: competition.type,
      minGPA: competition.minGPA,
      requirements: competition.requirements,
      startDate: competition.startDate,
      endDate: competition.endDate,
      location: competition.location,
      organizer: competition.organizer,
      evaluationCriteria: competition.evaluationCriteria,
      sourceUrl: competition.sourceUrl,
      relevantCourses: competition.relevantCourses,
      relevantSkills: competition.relevantSkills,
      createdAt: competition.createdAt,
      updatedAt: competition.updatedAt,
    },
    statistics: {
      overview: {
        totalStudents: students.length,
        averageMatchScore:
          matchScores.length > 0 ? matchScores.reduce((a, b) => a + b, 0) / matchScores.length : 0,
        highestMatchScore: matchScores.length > 0 ? Math.max(...matchScores) : 0,
        lowestMatchScore: matchScores.length > 0 ? Math.min(...matchScores) : 0,
        scoreDistribution: {
          excellent: matchScores.filter((score) => score >= 0.8).length,
          good: matchScores.filter((score) => score >= 0.6 && score < 0.8).length,
          fair: matchScores.filter((score) => score >= 0.4 && score < 0.6).length,
          poor: matchScores.filter((score) => score < 0.4).length,
        },
      },
      studyPrograms: Object.values(studyProgramGroups).map((group) => ({
        studyProgram: group.studyProgram,
        studentCount: group.studentCount,
        averageScore: group.averageScore,
        percentage: group.percentage,
      })),
      entryYears: Object.values(entryYearGroups).map((group) => ({
        entryYear: group.entryYear,
        studentCount: group.studentCount,
        averageScore: group.averageScore,
        percentage: group.percentage,
      })),
      topPerformers: topPerformers.map((performer) => ({
        student: {
          id: performer.student.id,
          name: performer.student.name,
          studentId: performer.student.studentId,
          studyProgram: performer.student.studyProgram,
          entryYear: performer.student.entryYear,
        },
        matchScore: performer.matchScore,
        rank: performer.rank,
      })),
    },
  };
};
