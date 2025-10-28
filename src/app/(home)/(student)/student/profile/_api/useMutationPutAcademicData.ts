import { UseMutationOptions } from "@tanstack/react-query";

import { queryKeys } from "@/app/shared/const/queryKeys";
import { AcademicDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";
import { paths } from "@/app/shared/types/api";
import apiClient from "@/client/api/apiClient";
import useMutationProvider from "@/client/hooks/useMutationProvider";

type UpdateAcademicDataResponse =
  paths["/students/academic-data"]["put"]["responses"]["200"]["content"]["application/json"];

const putAcademicData = async (
  data: AcademicDataPayload,
  files?: {
    achievementFiles?: (File | null)[];
    experienceFiles?: (File | null)[];
  }
): Promise<UpdateAcademicDataResponse> => {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(data));
  files?.achievementFiles?.forEach((file, idx) => {
    if (file) formData.append(`achievementFiles[${idx}]`, file);
  });
  files?.experienceFiles?.forEach((file, idx) => {
    if (file) formData.append(`experienceFiles[${idx}]`, file);
  });

  const response = await apiClient.request<"/students/academic-data", "put">(
    "put",
    "/students/academic-data",
    {},
    formData
  );

  return response;
};

const useMutationPutAcademicData = (
  options?: Omit<
    UseMutationOptions<
      UpdateAcademicDataResponse,
      Error,
      {
        data: AcademicDataPayload;
        files?: {
          achievementFiles?: (File | null)[];
          experienceFiles?: (File | null)[];
        };
      }
    >,
    "mutationFn"
  >
) => {
  const queryKey = queryKeys["academic-data"].update();
  const { queryKey: invalidatedQueryKey } = queryKeys["academic-data"].data();
  const mutationFn = async ({
    data,
    files,
  }: {
    data: AcademicDataPayload;
    files?: {
      achievementFiles?: (File | null)[];
      experienceFiles?: (File | null)[];
    };
  }): Promise<UpdateAcademicDataResponse> => putAcademicData(data, files);
  return useMutationProvider<
    {
      data: AcademicDataPayload;
      files?: {
        achievementFiles?: (File | null)[];
        experienceFiles?: (File | null)[];
      };
    },
    UpdateAcademicDataResponse
  >({
    queryKey: [queryKey],
    removeQueryKey: invalidatedQueryKey,
    mutationFn,
    options,
  });
};

export { useMutationPutAcademicData };
