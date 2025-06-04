import { queryKeys } from "@/app/shared/const/queryKeys";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

type PersonalDataResponse =
  paths["/students/personal-data"]["get"]["responses"]["200"]["content"]["application/json"];

const getPersonalDataQuery = async (): Promise<PersonalDataResponse["data"]> => {
  const response = await apiClient.request<"/students/personal-data", "get">(
    "get",
    "/students/personal-data"
  );
  return response.data;
};

const useQueryGetPersonalData = () => {
  const { queryKey } = queryKeys["personal-data"].data();
  const queryFn = () => getPersonalDataQuery();
  return useQueryProvider({
    queryKey,
    queryFn,
  });
};

export { useQueryGetPersonalData };
