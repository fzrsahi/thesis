import { UseMutationOptions } from "@tanstack/react-query";

import { queryKeys } from "@/app/shared/const/queryKeys";
import { AcademicDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useMutationProvider from "@/client/hooks/useMutationProvider";

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

const useMutationPutAcademicData = (
  options?: Omit<
    UseMutationOptions<UpdateAcademicDataResponse, Error, AcademicDataPayload>,
    "mutationFn"
  >
) => {
  const queryKey = queryKeys["academic-data"].update();
  const { queryKey: invalidatedQueryKey } = queryKeys["academic-data"].data();
  const mutationFn = async (data: AcademicDataPayload): Promise<UpdateAcademicDataResponse> =>
    putAcademicData(data);
  return useMutationProvider<AcademicDataPayload, UpdateAcademicDataResponse>({
    queryKey: [queryKey],
    removeQueryKey: invalidatedQueryKey,
    mutationFn,
    options,
  });
};

export { useMutationPutAcademicData };
