import { useQuery } from "@tanstack/react-query";

import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";

type AcademicDataResponse =
  paths["/students/academic-data"]["get"]["responses"]["200"]["content"]["application/json"];

const getAcademicDataQuery = async (): Promise<AcademicDataResponse["data"]> => {
  const response = await apiClient.request<"/students/academic-data", "get">(
    "get",
    "/students/academic-data"
  );
  return response.data;
};

const useQueryGetAcademicData = () =>
  useQuery({
    queryKey: ["academic-data"],
    queryFn: getAcademicDataQuery,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export { useQueryGetAcademicData };
