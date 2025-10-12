import { DashboardStats, getDashboardStats } from "../dashboard.repository";

export const getDashboardStatsUsecase = async (studyProgramId?: number): Promise<DashboardStats> =>
  getDashboardStats(studyProgramId);
