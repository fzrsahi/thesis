export interface RecommendationResponse {
  skills_profile: {
    technical_expertise: number;
    scientific_writing: number;
    problem_solving: number;
    creativity_innovation: number;
    communication: number;
    teamwork_collaboration: number;
    project_management: number;
    business_acumen: number;
    design_thinking: number;
    self_learning: number;
  };
  skills_profile_breakdown: {
    technical_expertise: string;
    scientific_writing: string;
    problem_solving: string;
    creativity_innovation: string;
    communication: string;
    teamwork_collaboration: string;
    project_management: string;
    business_acumen: string;
    design_thinking: string;
    self_learning: string;
  };
  category_distribution: {
    Teknologi: number;
    DataScience: number;
    Bisnis: number;
  };
  performance_metrics: {
    participation_rate: number;
    avg_match_score: number;
    competition_success_rate: number;
    skill_growth: {
      technical_expertise: string;
      problem_solving: string;
    };
  };
  recommendations: Array<{
    id: number;
    competition: string;
    match_score: number;
    match_score_breakdown: string;
    skill_distribution: {
      technical_expertise: number;
      scientific_writing: number;
      problem_solving: number;
      creativity_innovation: number;
      communication: number;
      teamwork_collaboration: number;
      project_management: number;
      business_acumen: number;
      design_thinking: number;
      self_learning: number;
    };
    skill_distribution_breakdown: {
      technical_expertise: string;
      scientific_writing: string;
      problem_solving: string;
      creativity_innovation: string;
      communication: string;
      teamwork_collaboration: string;
      project_management: string;
      business_acumen: string;
      design_thinking: string;
      self_learning: string;
    };
    rank: number;
    reason: string;
    details: {
      startDate: string;
      endDate: string;
      location: string;
      organizer: string;
      registration_deadline: string;
      website: string;
    };
    preparation_tips: string[];
  }>;
  development_suggestions: Array<{
    type: string;
    title: string;
    platform: string;
    link: string;
    reason: string;
  }>;
  profile_strength: {
    score: number;
    calculation_explanation: string;
    strengths: string[];
    weaknesses: string[];
  };
}
