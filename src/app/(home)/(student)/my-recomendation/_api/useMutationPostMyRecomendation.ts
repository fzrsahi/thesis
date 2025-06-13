import { UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { queryKeys } from "@/app/shared/const/queryKeys";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useMutationProvider from "@/client/hooks/useMutationProvider";

type MyRecomendationResponse =
  paths["/my-recommendation"]["post"]["responses"]["200"]["content"]["application/json"];

const postMyRecomendation = async (): Promise<MyRecomendationResponse> => {
  const response = await apiClient.request<"/my-recommendation", "post">(
    "post",
    "/my-recommendation"
  );
  return response;
};

export const useMutationPostMyRecomendation = (
  options?: Omit<
    UseMutationOptions<MyRecomendationResponse, AxiosError<ErrorResponse>, void>,
    "mutationFn"
  >
) => {
  const queryKey = queryKeys["my-recommendation"].create();
  const { queryKey: invalidatedQueryKey } = queryKeys["my-recommendation"].data();
  const mutationFn = async (): Promise<MyRecomendationResponse> => postMyRecomendation();
  return useMutationProvider<void, MyRecomendationResponse>({
    queryKey: [queryKey],
    removeQueryKey: invalidatedQueryKey,
    mutationFn,
    options,
  });
};
