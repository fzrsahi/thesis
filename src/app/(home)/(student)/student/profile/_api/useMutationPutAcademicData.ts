import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AcademicDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";

type UpdateAcademicDataResponse =
  paths["/students/academic-data"]["put"]["responses"]["200"]["content"]["application/json"];

const putAcademicData = async (data: AcademicDataPayload): Promise<UpdateAcademicDataResponse> => {
  const response = await apiClient.request<"/students/academic-data", "put">(
    "put",
    "/students/academic-data",
    {},
    data
  );

  return response;
};

const useMutationPutAcademicData = (options?: {
  onSuccess?: (data: UpdateAcademicDataResponse) => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putAcademicData,
    onSuccess: (data) => {
      queryClient.setQueryData(["academic-data"], data.data);

      options?.onSuccess?.(data);
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

export { useMutationPutAcademicData };
