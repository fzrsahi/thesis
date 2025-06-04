import { queryKeys } from "@/app/shared/const/queryKeys";
import apiClient from "@/client/api/apiClient";
import useQueryProvider from "@/client/hooks/useQueryProvider";

export interface Transcript {
  id: number;
  semester: string;
  fileUrl: string;
}

interface GetTranscriptsResponse {
  success: boolean;
  data: Transcript[];
}

const getTranscripts = async (): Promise<GetTranscriptsResponse> => {
  const response = await apiClient.request<"/students/transcript", "get">(
    "get",
    "/students/transcript"
  );

  return response as GetTranscriptsResponse;
};

export const useQueryGetTranscripts = () => {
  const { queryKey } = queryKeys.transcript.list();
  const queryFn = () => getTranscripts();
  return useQueryProvider({
    queryKey,
    queryFn,
  });
};
