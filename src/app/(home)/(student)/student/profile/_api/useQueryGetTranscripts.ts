import { useQuery } from "@tanstack/react-query";

import apiClient from "@/client/api/apiClient";

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
    "/students/transcript",
    undefined,
    undefined
  );

  return response as GetTranscriptsResponse;
};

export const useQueryGetTranscripts = () =>
  useQuery({
    queryKey: ["transcripts"],
    queryFn: getTranscripts,
  });
