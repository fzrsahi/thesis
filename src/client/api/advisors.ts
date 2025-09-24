import { components } from "@/app/shared/types/api";

import apiClient from "./apiClient";

export type AdvisorItem = components["schemas"]["Advisor"];
export type PaginationMeta = components["schemas"]["Pagination"];

export type GetAdvisorsParams = {
  page?: number;
  limit?: number;
  keywords?: string;
};

export type GetAdvisorsResponse = {
  success?: boolean;
  data?: AdvisorItem[];
  pagination?: PaginationMeta;
};

export const getAdvisors = async (params: GetAdvisorsParams): Promise<GetAdvisorsResponse> => {
  const response = await apiClient.request("get", "/advisors", {
    query: {
      page: params.page,
      limit: params.limit,
      keywords: params.keywords,
    },
  });
  return response as unknown as GetAdvisorsResponse;
};

export type CreateAdvisorRequest = {
  name: string;
  email: string;
  type: "HeadOfDepartment" | "HeadOfStudyProgram";
  studyProgramId: number | null;
};

export type CreateAdvisorResponse = {
  success: boolean;
};

export const createAdvisor = async (
  payload: CreateAdvisorRequest
): Promise<CreateAdvisorResponse> => {
  const response = await apiClient.request("post", "/advisors", undefined, payload);
  return response as unknown as CreateAdvisorResponse;
};

export type DeleteAdvisorResponse = {
  success: boolean;
};

type ApiClientRequest = (method: string, url: string, ...args: unknown[]) => Promise<unknown>;

export const deleteAdvisor = async (id: number): Promise<DeleteAdvisorResponse> => {
  const api = apiClient as unknown as { request: ApiClientRequest };
  const response = await api.request("delete", `/advisors/${id}`);
  return response as unknown as DeleteAdvisorResponse;
};
