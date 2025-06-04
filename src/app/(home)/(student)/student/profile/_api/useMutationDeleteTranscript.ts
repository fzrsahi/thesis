import { UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { queryKeys } from "@/app/shared/const/queryKeys";
import apiClient from "@/client/api/apiClient";
import useMutationProvider from "@/client/hooks/useMutationProvider";

interface DeleteTranscriptResponse {
  success: boolean;
  message?: string;
}

const deleteTranscript = async (transcriptId: number): Promise<DeleteTranscriptResponse> => {
  const response = await apiClient.request<"/students/transcript/{id}", "delete">(
    "delete",
    "/students/transcript/{id}",
    { path: { id: transcriptId } },
    undefined
  );

  return response as DeleteTranscriptResponse;
};

export const useMutationDeleteTranscript = (
  options?: Omit<
    UseMutationOptions<DeleteTranscriptResponse, AxiosError<ErrorResponse>, number>,
    "mutationFn"
  >
) => {
  const queryKey = ["transcript", "delete"];
  const { queryKey: invalidatedQueryKey } = queryKeys.transcript.list();
  const mutationFn = async (data: number): Promise<DeleteTranscriptResponse> =>
    deleteTranscript(data);
  return useMutationProvider<number, DeleteTranscriptResponse>({
    queryKey: [queryKey],
    removeQueryKey: invalidatedQueryKey,
    mutationFn,
    options,
  });
};
