import { UseMutationOptions } from "@tanstack/react-query";

import { queryKeys } from "@/app/shared/const/queryKeys";
import { PersonalDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useMutationProvider from "@/client/hooks/useMutationProvider";

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

const useMutationPutPersonalData = (
  options?: Omit<
    UseMutationOptions<UpdatePersonalDataResponse, Error, PersonalDataPayload>,
    "mutationFn"
  >
) => {
  const queryKey = queryKeys["personal-data"].update();
  const { queryKey: invalidatedQueryKey } = queryKeys["personal-data"].data();
  const mutationFn = async (data: PersonalDataPayload): Promise<UpdatePersonalDataResponse> =>
    putPersonalData(data);
  return useMutationProvider<PersonalDataPayload, UpdatePersonalDataResponse>({
    queryKey: [queryKey],
    removeQueryKey: invalidatedQueryKey,
    mutationFn,
    options,
  });
};

export { useMutationPutPersonalData };
