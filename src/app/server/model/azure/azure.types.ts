export interface RecommendationResponse {
  skillsProfile: {
    technicalExpertise: number;
    scientificWriting: number;
    problemSolving: number;
    creativityInnovation: number;
    communication: number;
    teamworkCollaboration: number;
    projectManagement: number;
    businessAcumen: number;
    designThinking: number;
    selfLearning: number;
  };
  skillsProfileBreakdown: {
    technicalExpertise: string;
    scientificWriting: string;
    problemSolving: string;
    creativityInnovation: string;
    communication: string;
    teamworkCollaboration: string;
    projectManagement: string;
    businessAcumen: string;
    designThinking: string;
    selfLearning: string;
  };
  categoryDistribution: {
    Teknologi: number;
    DataScience: number;
    Business: number;
  };
  performanceMetrics: {
    participationRate: number;
    avgMatchScore: number;
    competitionSuccessRate: number;
    skillGrowth: {
      technicalExpertise: string;
      problemSolving: string;
    };
  };
  recommendations: Array<{
    id: number;
    competition: string;
    matchScore: number;
    matchScoreBreakdown: string;
    skillDistribution: {
      technicalExpertise: number;
      scientificWriting: number;
      problemSolving: number;
      creativityInnovation: number;
      communication: number;
      teamworkCollaboration: number;
      projectManagement: number;
      businessAcumen: number;
      designThinking: number;
      selfLearning: number;
    };
    skillDistributionBreakdown: {
      technicalExpertise: string;
      scientificWriting: string;
      problemSolving: string;
      creativityInnovation: string;
      communication: string;
      teamworkCollaboration: string;
      projectManagement: string;
      businessAcumen: string;
      designThinking: string;
      selfLearning: string;
    };
    rank: number;
    reason: string;
    details: {
      startDate: string;
      endDate: string;
      location: string;
      organizer: string;
      registrationDeadline: string;
      website: string;
    };
    preparationTips: string[];
  }>;
  developmentSuggestions: Array<{
    type: string;
    title: string;
    platform: string;
    link: string;
    reason: string;
  }>;
  profileStrength: {
    score: number;
    calculationExplanation: string;
    strengths: string[];
    weaknesses: string[];
  };
}
