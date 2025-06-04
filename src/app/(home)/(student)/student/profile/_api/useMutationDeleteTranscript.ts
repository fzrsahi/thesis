import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/client/api/apiClient";

interface DeleteTranscriptResponse {
  success: boolean;
  message?: string;
}

const deleteTranscript = async (transcriptId: number): Promise<DeleteTranscriptResponse> => {
  const response = await apiClient.request<'/students/transcript/{id}', 'delete'>(
    'delete',
    '/students/transcript/{id}',
    { path: { id: transcriptId } },
    undefined,
  );

  return response as DeleteTranscriptResponse;
};

interface UseMutationDeleteTranscriptOptions {
  onSuccess?: (data: DeleteTranscriptResponse) => void;
  onError?: (error: Error) => void;
}

export const useMutationDeleteTranscript = (options?: UseMutationDeleteTranscriptOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTranscript,
    onSuccess: (data) => {
      // Invalidate and refetch transcripts query
      queryClient.invalidateQueries({ queryKey: ["transcripts"] });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}; 