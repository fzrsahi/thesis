import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PersonalDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";

type UpdatePersonalDataResponse =
  paths["/students/personal-data"]["put"]["responses"]["200"]["content"]["application/json"];

const putPersonalData = async (data: PersonalDataPayload): Promise<UpdatePersonalDataResponse> => {
  const response = await apiClient.request<"/students/personal-data", "put">(
    "put",
    "/students/personal-data",
    {},
    data
  );

  return response;
};

const useMutationPutPersonalData = (options?: {
  onSuccess?: (data: UpdatePersonalDataResponse) => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putPersonalData,
    onSuccess: (data) => {
      // Update the cache directly instead of invalidating to avoid refetch
      queryClient.setQueryData(["personal-data"], data.data);

      options?.onSuccess?.(data);
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

export { useMutationPutPersonalData };
