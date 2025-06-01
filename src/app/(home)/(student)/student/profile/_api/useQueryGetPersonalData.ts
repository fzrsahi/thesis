import { useQuery } from "@tanstack/react-query";

import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";

type PersonalDataResponse =
  paths["/students/personal-data"]["get"]["responses"]["200"]["content"]["application/json"];

const getPersonalDataQuery = async (): Promise<PersonalDataResponse["data"]> => {
  const response = await apiClient.request<"/students/personal-data", "get">(
    "get",
    "/students/personal-data"
  );
  return response.data;
};

const useQueryGetPersonalData = () =>
  useQuery({
    queryKey: ["personal-data"],
    queryFn: getPersonalDataQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

export { useQueryGetPersonalData };
