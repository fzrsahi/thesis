import { queryKeys } from "@/app/shared/const/queryKeys";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

type MyRecomendationResponse =
  paths["/my-recommendation"]["get"]["responses"]["200"]["content"]["application/json"];

const getMyRecomendationQuery = async (): Promise<MyRecomendationResponse["data"]> => {
  const response = await apiClient.request<"/my-recommendation", "get">(
    "get",
    "/my-recommendation"
  );
  return response.data;
};

const useQueryGetMyRecomendation = () => {
  const { queryKey } = queryKeys["my-recommendation"].data();
  const queryFn = () => getMyRecomendationQuery();
  return useQueryProvider({
    queryKey,
    queryFn,
  });
};

export { useQueryGetMyRecomendation };
