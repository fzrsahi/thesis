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
