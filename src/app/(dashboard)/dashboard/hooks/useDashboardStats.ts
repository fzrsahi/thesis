import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

type DashboardStatsResponse =
  paths["/dashboard/stats"]["get"]["responses"]["200"]["content"]["application/json"];

const getDashboardStatsQuery = async (): Promise<DashboardStatsResponse["data"]> => {
  const response = await apiClient.request<"/dashboard/stats", "get">("get", "/dashboard/stats");
  return response.data;
};

export const useDashboardStats = () => {
  const queryFn = () => getDashboardStatsQuery();
  return useQueryProvider({
    queryKey: ["dashboard-stats"],
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};
