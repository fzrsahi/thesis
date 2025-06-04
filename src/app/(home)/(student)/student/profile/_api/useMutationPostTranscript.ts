import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PostTranscriptResponse, UploadTranscriptPayload, UploadTranscriptSchema } from "@/app/shared/schema/student/profile/TranscriptSchema";
import apiClient from "@/client/api/apiClient";



const postTranscript = async (data: UploadTranscriptPayload): Promise<PostTranscriptResponse> => {
  const validatedData = UploadTranscriptSchema.parse(data);
  
  const formData = new FormData();
  formData.append("semester", validatedData.semester);
  formData.append("transcript", validatedData.transcript);

  const response = await apiClient.request<'/students/transcript', 'post'>(
    'post',
    '/students/transcript',
    undefined,
    formData,
  );
  
  return response as PostTranscriptResponse;
};

interface UseMutationPostTranscriptOptions {
  onSuccess?: (data: PostTranscriptResponse) => void;
  onError?: (error: Error) => void;
}

export const useMutationPostTranscript = (options?: UseMutationPostTranscriptOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTranscript,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transcripts"] });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}; 