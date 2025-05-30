import { queryKeys } from "@/app/shared/const/queryKeys";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

const getAcademicDataQuery = async () => {
  const res = await apiClient.request<"/students/academic-data", "get">(
    "get",
    "/students/academic-data"
  );
  return res.data;
};

const useQueryGetAcademicData = () => {
  const { queryKey } = queryKeys["academic-data"].data();
  const queryFn = () => getAcademicDataQuery();
  return useQueryProvider({ queryKey, queryFn });
};

export { useQueryGetAcademicData };
