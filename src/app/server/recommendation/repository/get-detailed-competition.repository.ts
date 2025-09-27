import { prisma } from "@/app/server/prisma/prisma";

export type GetDetailedCompetitionPagination = {
  page: number;
  limit: number;
};

export type GetDetailedCompetitionFilter = {
  studyProgramId?: number;
  entryYear?: number;
  competitionId: number;
  minMatchScore?: number;
  keywords?: string;
};

export type DetailedCompetitionResult = {
  competition: {
    id: number;
    title: string;
    description: string;
    field: string[];
    type?: string | null;
    minGPA?: string | null;
    location?: string | null;
    organizer?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    sourceUrl?: string | null;
    relevantCourses: string[];
    relevantSkills: string[];
    requirements: Record<string, unknown>;
    evaluationCriteria: Record<string, unknown>;
  };
  students: {
    student: {
      id: number;
      name: string;
      email: string;
      studentId?: string | null;
      gpa?: string | null;
      studyProgram: {
        id: number;
        name: string;
      };
      entryYear: number;
      academicData?: {
        interests: string[];
        skills: string[];
        achievements: Record<string, unknown>[];
        experiences: Record<string, unknown>[];
      };
    };
    recommendation: {
      id: number;
      rank: number;
      matchScore: number;
      matchReason?: string | null;
      keyFactors?: string[];
      preparationTips?: string[];
      createdAt: string;
    };
    skillsProfile: {
      skillName: string;
      score: number;
      breakdown: Record<string, unknown>;
    }[];
  }[];
  statistics: {
    totalStudents: number;
    averageMatchScore: number;
    highestScore: number;
    lowestScore: number;
    averageGPA: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
    };
    entryYearDistribution: Record<number, number>;
    studyProgramDistribution: Record<string, number>;
    relevantSkillsDistribution: Record<string, number>;
  };
};

// Helper function to build where clause for recommendations
const buildRecommendationWhereClause = (filter: GetDetailedCompetitionFilter) => {
  const baseWhere = {
    competitionRecommendations: {
      some: {
        competitionId: filter.competitionId,
      },
    },
  };

  // Add study program filter
  if (filter.studyProgramId) {
    return {
      ...baseWhere,
      student: {
        studyProgramId: filter.studyProgramId,
      },
    };
  }

  // Add entry year filter
  if (filter.entryYear) {
    return {
      ...baseWhere,
      student: {
        entryYear: filter.entryYear,
      },
    };
  }

  // Add min match score filter
  if (filter.minMatchScore) {
    return {
      ...baseWhere,
      competitionRecommendations: {
        some: {
          competitionId: filter.competitionId,
          matchScore: {
            gte: filter.minMatchScore,
          },
        },
      },
    };
  }

  // Add keywords filter
  if (filter.keywords) {
    return {
      ...baseWhere,
      OR: [
        {
          student: {
            user: {
              name: {
                contains: filter.keywords,
                mode: "insensitive",
              },
            },
          },
        },
        {
          student: {
            studentId: {
              contains: filter.keywords,
              mode: "insensitive",
            },
          },
        },
      ],
    };
  }

  return baseWhere;
};

// Helper function to transform skill breakdown
const transformSkillBreakdown = (
  breakdown: string | Record<string, unknown>
): Record<string, unknown> => {
  try {
    return typeof breakdown === "string" ? JSON.parse(breakdown) : breakdown;
  } catch {
    return {};
  }
};

// Helper function to transform student data
const transformStudentData = (
  rec: {
    student: {
      id: number;
      studentId: string | null;
      gpa: string | null;
      entryYear: number;
      studyProgramId: number;
      user: { name: string; email: string };
      studyProgram: { id: number; name: string };
      interests: string[];
      skills: string[];
    } | null;
    skillsProfiles: Array<{
      skillName: string;
      score: number;
      breakdown: string | Record<string, unknown>;
    }>;
    competitionRecommendations: Array<{
      id: number;
      competitionId: number;
      rank: number;
      matchScore: number;
      matchReason: string | null;
      keyFactors: unknown;
      preparationTips: unknown;
      createdAt: Date;
    }>;
  },
  competitionId: number
) => {
  // Find the competition recommendation for the specific competition
  const competitionRec =
    rec.competitionRecommendations.find((compRec) => compRec.competitionId === competitionId) ||
    rec.competitionRecommendations[0];

  return {
    student: {
      id: rec.student!.id,
      name: rec.student!.user.name,
      email: rec.student!.user.email,
      studentId: rec.student!.studentId || undefined,
      gpa: rec.student!.gpa || undefined,
      studyProgram: {
        id: rec.student!.studyProgram.id,
        name: rec.student!.studyProgram.name,
      },
      entryYear: rec.student!.entryYear,
      academicData: {
        interests: rec.student!.interests,
        skills: rec.student!.skills,
        achievements: [],
        experiences: [],
      },
    },
    recommendation: {
      id: competitionRec.id,
      rank: competitionRec.rank,
      matchScore: competitionRec.matchScore,
      matchReason: competitionRec.matchReason || undefined,
      keyFactors: Array.isArray(competitionRec.keyFactors) ? competitionRec.keyFactors : [],
      preparationTips: Array.isArray(competitionRec.preparationTips)
        ? competitionRec.preparationTips
        : [],
      createdAt: competitionRec.createdAt.toISOString(),
    },
    skillsProfile: rec.skillsProfiles.map((skill) => ({
      skillName: skill.skillName,
      score: skill.score,
      breakdown: transformSkillBreakdown(skill.breakdown),
    })),
  };
};

// Helper function to calculate relevant skills distribution
const calculateRelevantSkillsDistribution = (
  allStudents: Array<{
    skillsProfile: Array<{
      skillName: string;
      score: number;
      breakdown: Record<string, unknown>;
    }>;
  }>,
  competitionSkills: string[]
): Record<string, number> => {
  const relevantSkillsDistribution: Record<string, number> = {};
  const skillScoreTracker: Record<string, { totalScore: number; count: number }> = {};

  // If no competition skills, show all student skills
  if (!competitionSkills || competitionSkills.length === 0) {
    allStudents.forEach((student) => {
      if (student.skillsProfile && student.skillsProfile.length > 0) {
        student.skillsProfile.forEach((skill) => {
          if (!skillScoreTracker[skill.skillName]) {
            skillScoreTracker[skill.skillName] = { totalScore: 0, count: 0 };
          }
          skillScoreTracker[skill.skillName].totalScore += skill.score;
          skillScoreTracker[skill.skillName].count += 1;
        });
      }
    });
  } else {
    // Initialize with competition's relevant skills
    competitionSkills.forEach((skill) => {
      relevantSkillsDistribution[skill] = 0;
      skillScoreTracker[skill] = { totalScore: 0, count: 0 };
    });

    // Calculate average scores for each relevant skill using direct match only
    allStudents.forEach((student) => {
      if (student.skillsProfile && student.skillsProfile.length > 0) {
        student.skillsProfile.forEach((skill) => {
          // Only check direct match - no mapping
          if (competitionSkills.includes(skill.skillName)) {
            skillScoreTracker[skill.skillName].totalScore += skill.score;
            skillScoreTracker[skill.skillName].count += 1;
          }
        });
      }
    });
  }

  // Calculate average scores
  Object.keys(skillScoreTracker).forEach((skill) => {
    const tracker = skillScoreTracker[skill];
    if (tracker.count > 0) {
      relevantSkillsDistribution[skill] = tracker.totalScore / tracker.count;
    }
  });

  return relevantSkillsDistribution;
};

// Get competition details
export const getCompetitionDetails = async (competitionId: number) => {
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
    },
  });

  if (!competition) {
    throw new Error("Competition not found");
  }

  return competition;
};

// Get all recommendations for statistics
export const getAllRecommendations = async (filter: GetDetailedCompetitionFilter) =>
  prisma.recommendation.findMany({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: buildRecommendationWhereClause(filter) as any,
    select: {
      id: true,
      studentId: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          studentId: true,
          gpa: true,
          entryYear: true,
          studyProgramId: true,
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
          interests: true,
          skills: true,
        },
      },
      skillsProfiles: {
        select: {
          skillName: true,
          score: true,
          breakdown: true,
        },
      },
      competitionRecommendations: {
        where: {
          competitionId: filter.competitionId,
        },
        select: {
          id: true,
          competitionId: true,
          rank: true,
          matchScore: true,
          matchReason: true,
          keyFactors: true,
          preparationTips: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

// Get total count for pagination
export const getDetailedCompetitionCount = async (
  filter: GetDetailedCompetitionFilter
): Promise<number> =>
  prisma.recommendation.count({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: buildRecommendationWhereClause(filter) as any,
  });

// Main function to get detailed competition data
export const getDetailedCompetition = async (
  pagination: GetDetailedCompetitionPagination,
  filter: GetDetailedCompetitionFilter
): Promise<DetailedCompetitionResult> => {
  // Get competition details and all recommendations in parallel
  const [competition, allRecommendations] = await Promise.all([
    getCompetitionDetails(filter.competitionId),
    getAllRecommendations(filter),
  ]);

  // Get paginated recommendations for display
  const recommendations = allRecommendations.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  // Transform the data for display (paginated)
  const students = recommendations
    .filter((rec) => rec.student && rec.competitionRecommendations.length > 0)
    .map((rec) => transformStudentData(rec, filter.competitionId));

  // Transform ALL data for statistics (not paginated)
  const allStudents = allRecommendations
    .filter((rec) => rec.student && rec.competitionRecommendations.length > 0)
    .map((rec) => transformStudentData(rec, filter.competitionId));

  // Calculate detailed statistics using ALL students
  const matchScores = allStudents.map((s) => s.recommendation.matchScore);
  const gpas = allStudents.map((s) => parseFloat(s.student.gpa || "0")).filter((gpa) => gpa > 0);
  const entryYears = allStudents.map((s) => s.student.entryYear);
  const studyPrograms = allStudents.map((s) => s.student.studyProgram.name);

  // Calculate relevant skills distribution
  const relevantSkillsDistribution = calculateRelevantSkillsDistribution(
    allStudents,
    competition.relevantSkills
  );

  const statistics = {
    totalStudents: allStudents.length,
    averageMatchScore:
      matchScores.length > 0 ? matchScores.reduce((a, b) => a + b, 0) / matchScores.length : 0,
    highestScore: matchScores.length > 0 ? Math.max(...matchScores) : 0,
    lowestScore: matchScores.length > 0 ? Math.min(...matchScores) : 0,
    averageGPA: gpas.length > 0 ? gpas.reduce((a, b) => a + b, 0) / gpas.length : 0,
    scoreDistribution: {
      excellent: matchScores.filter((score) => score >= 0.8).length,
      good: matchScores.filter((score) => score >= 0.6 && score < 0.8).length,
      fair: matchScores.filter((score) => score >= 0.4 && score < 0.6).length,
      poor: matchScores.filter((score) => score < 0.4).length,
    },
    entryYearDistribution: entryYears.reduce(
      (acc, year) => {
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    ),
    studyProgramDistribution: studyPrograms.reduce(
      (acc, program) => {
        acc[program] = (acc[program] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    relevantSkillsDistribution,
  };

  return {
    competition: {
      ...competition,
      startDate: competition.startDate?.toISOString(),
      endDate: competition.endDate?.toISOString(),
      requirements:
        typeof competition.requirements === "object" && competition.requirements !== null
          ? (competition.requirements as Record<string, unknown>)
          : {},
      evaluationCriteria:
        typeof competition.evaluationCriteria === "object" &&
        competition.evaluationCriteria !== null
          ? (competition.evaluationCriteria as Record<string, unknown>)
          : {},
    },
    students,
    statistics,
  };
};
