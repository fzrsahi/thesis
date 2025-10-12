import { prisma } from "../prisma/prisma";

export interface DashboardStats {
  overview: {
    totalStudents: number;
    totalCompetitions: number;
    totalRecommendations: number;
  };
  popularCompetitions: {
    name: string;
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    id: number;
    type: "competition" | "registration" | "upload" | "recommendation";
    action: string;
    competitionName?: string | null;
    studentName?: string | null;
    timestamp: string;
  }[];
  statistics: {
    studentGrowth: {
      currentMonth: number;
      previousMonth: number;
      growthPercentage: number;
    };
    competitionGrowth: {
      currentMonth: number;
      previousMonth: number;
      growthPercentage: number;
    };
    recommendationGrowth: {
      currentMonth: number;
      previousMonth: number;
      growthPercentage: number;
    };
  };
}

export const getDashboardStats = async (studyProgramId?: number): Promise<DashboardStats> => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get overview statistics with study program filter if provided
  const studentWhere = studyProgramId ? { studyProgramId } : {};
  const recommendationWhere = studyProgramId ? { student: { studyProgramId } } : {};

  const [totalStudents, totalCompetitions, totalRecommendations] = await Promise.all([
    prisma.student.count({ where: studentWhere }),
    prisma.competitions.count(),
    prisma.recommendation.count({ where: recommendationWhere }),
  ]);

  // Get popular competitions (top 5 by recommendation count) with study program filter
  const popularCompetitionsWhere = studyProgramId
    ? { recommendation: { student: { studyProgramId } } }
    : {};

  const popularCompetitionsData = await prisma.recommendationCompetition.groupBy({
    by: ["competitionId"],
    where: popularCompetitionsWhere,
    _count: {
      competitionId: true,
    },
    orderBy: {
      _count: {
        competitionId: "desc",
      },
    },
    take: 5,
  });

  const competitionIds = popularCompetitionsData.map((item) => item.competitionId);
  const competitions = await prisma.competitions.findMany({
    where: {
      id: {
        in: competitionIds,
      },
    },
    select: {
      id: true,
      title: true,
    },
  });

  const competitionMap = new Map(competitions.map((c) => [c.id, c.title]));
  const popularCompetitions = popularCompetitionsData.map((item) => ({
    name: competitionMap.get(item.competitionId) || "Unknown Competition",
    // eslint-disable-next-line no-underscore-dangle
    count: item._count.competitionId,
    // eslint-disable-next-line no-underscore-dangle
    percentage:
      // eslint-disable-next-line no-underscore-dangle
      totalRecommendations > 0 ? (item._count.competitionId / totalRecommendations) * 100 : 0,
  }));

  // Get recent activities (last 10) - mix of competitions, recommendations, and students
  const recentActivities = studyProgramId
    ? ((await prisma.$queryRaw`
        (
          SELECT 
            'competition' as type,
            c.id,
            CONCAT('Kompetisi "', c.title, '" ditambahkan') as action,
            c.title as competition_name,
            NULL as student_name,
            c."createdAt" as timestamp
          FROM competitions c
          ORDER BY c."createdAt" DESC
          LIMIT 5
        )
        UNION ALL
        (
          SELECT 
            'recommendation' as type,
            r.id,
            CONCAT('Rekomendasi diberikan untuk ', u.name) as action,
            NULL as competition_name,
            u.name as student_name,
            r."createdAt" as timestamp
          FROM recommendations r
          JOIN students s ON r."studentId" = s.id
          JOIN users u ON s."userId" = u.id
          WHERE s."studyProgramId" = ${studyProgramId}
          ORDER BY r."createdAt" DESC
          LIMIT 3
        )
        UNION ALL
        (
          SELECT 
            'registration' as type,
            s.id,
            CONCAT('Mahasiswa baru terdaftar: ', u.name) as action,
            sp.name as competition_name,
            u.name as student_name,
            s."createdAt" as timestamp
          FROM students s
          JOIN users u ON s."userId" = u.id
          JOIN "studyPrograms" sp ON s."studyProgramId" = sp.id
          WHERE s."studyProgramId" = ${studyProgramId}
          ORDER BY s."createdAt" DESC
          LIMIT 2
        )
        ORDER BY timestamp DESC
        LIMIT 10
      `) as Array<{
        id: number;
        type: string;
        action: string;
        competition_name: string | null;
        student_name: string | null;
        timestamp: Date;
      }>)
    : ((await prisma.$queryRaw`
        (
          SELECT 
            'competition' as type,
            c.id,
            CONCAT('Kompetisi "', c.title, '" ditambahkan') as action,
            c.title as competition_name,
            NULL as student_name,
            c."createdAt" as timestamp
          FROM competitions c
          ORDER BY c."createdAt" DESC
          LIMIT 5
        )
        UNION ALL
        (
          SELECT 
            'recommendation' as type,
            r.id,
            CONCAT('Rekomendasi diberikan untuk ', u.name) as action,
            NULL as competition_name,
            u.name as student_name,
            r."createdAt" as timestamp
          FROM recommendations r
          JOIN students s ON r."studentId" = s.id
          JOIN users u ON s."userId" = u.id
          ORDER BY r."createdAt" DESC
          LIMIT 3
        )
        UNION ALL
        (
          SELECT 
            'registration' as type,
            s.id,
            CONCAT('Mahasiswa baru terdaftar: ', u.name) as action,
            sp.name as competition_name,
            u.name as student_name,
            s."createdAt" as timestamp
          FROM students s
          JOIN users u ON s."userId" = u.id
          JOIN "studyPrograms" sp ON s."studyProgramId" = sp.id
          ORDER BY s."createdAt" DESC
          LIMIT 2
        )
        ORDER BY timestamp DESC
        LIMIT 10
      `) as Array<{
        id: number;
        type: string;
        action: string;
        competition_name: string | null;
        student_name: string | null;
        timestamp: Date;
      }>);

  const recentActivity = recentActivities.map((activity) => ({
    id: activity.id,
    type: activity.type as "competition" | "registration" | "upload" | "recommendation",
    action: activity.action,
    competitionName: activity.competition_name,
    studentName: activity.student_name,
    timestamp: activity.timestamp.toISOString(),
  }));

  // Get growth statistics with study program filter
  const [
    currentMonthStudents,
    previousMonthStudents,
    currentMonthCompetitions,
    previousMonthCompetitions,
    currentMonthRecommendations,
    previousMonthRecommendations,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        ...studentWhere,
        createdAt: {
          gte: currentMonthStart,
        },
      },
    }),
    prisma.student.count({
      where: {
        ...studentWhere,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    }),
    prisma.competitions.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
        },
      },
    }),
    prisma.competitions.count({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    }),
    prisma.recommendation.count({
      where: {
        ...recommendationWhere,
        createdAt: {
          gte: currentMonthStart,
        },
      },
    }),
    prisma.recommendation.count({
      where: {
        ...recommendationWhere,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    }),
  ]);

  const calculateGrowthPercentage = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    overview: {
      totalStudents,
      totalCompetitions,
      totalRecommendations,
    },
    popularCompetitions,
    recentActivity,
    statistics: {
      studentGrowth: {
        currentMonth: currentMonthStudents,
        previousMonth: previousMonthStudents,
        growthPercentage: calculateGrowthPercentage(currentMonthStudents, previousMonthStudents),
      },
      competitionGrowth: {
        currentMonth: currentMonthCompetitions,
        previousMonth: previousMonthCompetitions,
        growthPercentage: calculateGrowthPercentage(
          currentMonthCompetitions,
          previousMonthCompetitions
        ),
      },
      recommendationGrowth: {
        currentMonth: currentMonthRecommendations,
        previousMonth: previousMonthRecommendations,
        growthPercentage: calculateGrowthPercentage(
          currentMonthRecommendations,
          previousMonthRecommendations
        ),
      },
    },
  };
};
