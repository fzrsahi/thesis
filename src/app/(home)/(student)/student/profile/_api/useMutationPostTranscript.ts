import { UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { queryKeys } from "@/app/shared/const/queryKeys";
import {
  PostTranscriptResponse,
  UploadTranscriptPayload,
  UploadTranscriptSchema,
} from "@/app/shared/schema/student/profile/TranscriptSchema";
import apiClient from "@/client/api/apiClient";
import useMutationProvider from "@/client/hooks/useMutationProvider";

const postTranscript = async (data: UploadTranscriptPayload): Promise<PostTranscriptResponse> => {
  const validatedData = UploadTranscriptSchema.parse(data);

  const formData = new FormData();
  formData.append("semester", validatedData.semester);
  formData.append("transcript", validatedData.transcript);

  const response = await apiClient.request<"/students/transcript", "post">(
    "post",
    "/students/transcript",
    undefined,
    formData
  );

  return response as PostTranscriptResponse;
};

export const useMutationPostTranscript = (
  options?: Omit<
    UseMutationOptions<PostTranscriptResponse, AxiosError<ErrorResponse>, UploadTranscriptPayload>,
    "mutationFn"
  >
) => {
  const queryKey = queryKeys.transcript.create();
  const { queryKey: invalidatedQueryKey } = queryKeys.transcript.list();
  const mutationFn = async (data: UploadTranscriptPayload): Promise<PostTranscriptResponse> =>
    postTranscript(data);
  return useMutationProvider<UploadTranscriptPayload, PostTranscriptResponse>({
    queryKey: [queryKey],
    removeQueryKey: invalidatedQueryKey,
    mutationFn,
    options,
  });
};
