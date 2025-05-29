import { queryKeys } from "@/app/shared/const/queryKeys";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

const getPersonalDataQuery = async () => {
  const res = await apiClient.request<"/students/personal-data", "get">(
    "get",
    "/students/personal-data"
  );
  return res.data;
};

const useQueryGetPersonalData = () => {
  const { queryKey } = queryKeys["personal-data"].data();
  const queryFn = () => getPersonalDataQuery();
  return useQueryProvider({ queryKey, queryFn });
};

export { useQueryGetPersonalData };
