import { queryKeys } from "@/app/shared/const/queryKeys";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

type StudentCompetitionDetailResponse =
  paths["/recomendations/students/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

const getStudentCompetitionDetailQuery = async (
  userId: number
): Promise<StudentCompetitionDetailResponse["data"]> => {
  const response = await apiClient.request<"/recomendations/students/{id}", "get">(
    "get",
    `/recomendations/students/${userId}` as "/recomendations/students/{id}"
  );
  return response.data;
};

const useQueryGetStudentCompetitionDetail = (userId: number) => {
  const { queryKey } = queryKeys["student-competition-detail"].data(userId);
  const queryFn = () => getStudentCompetitionDetailQuery(userId);
  return useQueryProvider({
    queryKey,
    queryFn,
  });
};

export { useQueryGetStudentCompetitionDetail };
