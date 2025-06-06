import { queryKeys } from "@/app/shared/const/queryKeys";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

type AcademicDataResponse =
  paths["/students/academic-data"]["get"]["responses"]["200"]["content"]["application/json"];

const getAcademicDataQuery = async (): Promise<AcademicDataResponse["data"]> => {
  const response = await apiClient.request<"/students/academic-data", "get">(
    "get",
    "/students/academic-data"
  );
  return response.data;
};

const useQueryGetAcademicData = () => {
  const { queryKey } = queryKeys["academic-data"].data();
  const queryFn = () => getAcademicDataQuery();
  return useQueryProvider({
    queryKey,
    queryFn,
  });
};

export { useQueryGetAcademicData };
