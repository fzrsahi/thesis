import apiClient from "./apiClient";

export type CompetitionRecommendationGroup = {
  competition: {
    id: number;
    title: string;
    field: string[];
    type?: string;
    organizer?: string;
  };
  students: StudentRecommendationSummary[];
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

export type StudentRecommendationGroup = {
  student: {
    id: number;
    userId: number;
    name: string;
    email: string;
    studentId?: string;
    studyProgram: {
      id: number;
      name: string;
    };
    entryYear: number;
    gpa?: string;
  };
  competitions: CompetitionRecommendationSummary[];
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

export type StudentRecommendationSummary = {
  student: {
    id: number;
    userId: number;
    name: string;
    email: string;
    studentId?: string;
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
    createdAt: string;
  };
};

export type CompetitionRecommendationSummary = {
  competition: {
    id: number;
    title: string;
    field: string[];
    type?: string;
    organizer?: string;
  };
  recommendation: {
    id: number;
    rank: number;
    matchScore: number;
    createdAt: string;
  };
};

export type GetRecommendationsResponse = {
  success: boolean;
  data: CompetitionRecommendationGroup[];
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

export type GetRecommendationsByStudentResponse = {
  success: boolean;
  data: StudentRecommendationGroup[];
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

export type GetRecommendationsParams = {
  page?: number;
  limit?: number;
  studyProgramId?: number;
  entryYear?: number;
  competitionId?: number;
  minMatchScore?: number;
  keywords?: string;
};

export type DetailedCompetitionResponse = {
  success: boolean;
  data: {
    competition: {
      id: number;
      title: string;
      description: string;
      field: string[];
      type?: string;
      minGPA?: string;
      location?: string;
      organizer?: string;
      startDate?: string;
      endDate?: string;
      sourceUrl?: string;
      relevantCourses: string[];
      relevantSkills: string[];
      requirements: Record<string, unknown>;
      evaluationCriteria: Record<string, unknown>;
    };
    students: DetailedStudentRecommendation[];
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
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type DetailedStudentRecommendation = {
  student: {
    id: number;
    name: string;
    email: string;
    studentId?: string;
    gpa?: string;
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
    matchReason?: string;
    keyFactors?: string[];
    preparationTips?: string[];
    createdAt: string;
  };
  skillsProfile: {
    skillName: string;
    score: number;
    breakdown: Record<string, unknown>;
  }[];
};

export const getRecommendations = async (
  params: GetRecommendationsParams = {}
): Promise<GetRecommendationsResponse> => {
  const response = await apiClient.request("get", "/recomendations/competitions", {
    query: {
      page: params.page,
      limit: params.limit,
      studyProgramId: params.studyProgramId,
      entryYear: params.entryYear,
      competitionId: params.competitionId,
      minMatchScore: params.minMatchScore,
      keywords: params.keywords,
    },
  });
  return response as unknown as GetRecommendationsResponse;
};

export const getRecommendationsByStudent = async (
  params: GetRecommendationsParams = {}
): Promise<GetRecommendationsByStudentResponse> => {
  const response = await apiClient.request("get", "/recomendations/students", {
    query: {
      page: params.page,
      limit: params.limit,
      studyProgramId: params.studyProgramId,
      entryYear: params.entryYear,
      competitionId: params.competitionId,
      minMatchScore: params.minMatchScore,
      keywords: params.keywords,
    },
  });
  return response as unknown as GetRecommendationsByStudentResponse;
};

export const getDetailedCompetition = async (
  competitionId: number,
  params: GetRecommendationsParams = {}
): Promise<DetailedCompetitionResponse> => {
  const api = apiClient as unknown as {
    request: (method: string, url: string, ...args: unknown[]) => Promise<unknown>;
  };
  const response = await api.request("get", `/recomendations/competitions/${competitionId}`, {
    query: {
      page: params.page,
      limit: params.limit,
      studyProgramId: params.studyProgramId,
      entryYear: params.entryYear,
      minMatchScore: params.minMatchScore,
      keywords: params.keywords,
    },
  });
  return response as unknown as DetailedCompetitionResponse;
};
