import { CreateCompetitionGeneratePayload } from "@/app/shared/schema/competition/CompetitionGenerateSchema";
import { components, paths } from "@/app/shared/types/api";

import apiClient from "./apiClient";

export type CompetitionItem = components["schemas"]["Competition"];
export type PaginationMeta = components["schemas"]["Pagination"];

export type GetCompetitionsParams = {
  page?: number;
  limit?: number;
  keywords?: string;
};

export type GetCompetitionsResponse = {
  success?: boolean;
  data?: CompetitionItem[];
  pagination?: PaginationMeta;
};

export const getCompetitions = async (
  params: GetCompetitionsParams
): Promise<GetCompetitionsResponse> => {
  const response = await apiClient.request("get", "/competitions", {
    query: {
      page: params.page,
      limit: params.limit,
      keywords: params.keywords,
    },
  });
  return response as unknown as GetCompetitionsResponse;
};

export type GenerateCompetitionRequest = Omit<
  paths["/competitions/generate"]["post"]["requestBody"]["content"]["multipart/form-data"],
  "file"
> & { file?: File };

export type GenerateCompetitionResponse = components["schemas"]["GenerateCompetitionResponse"];

export const generateCompetition = async (
  payload: CreateCompetitionGeneratePayload
): Promise<{ success: boolean; data: GenerateCompetitionResponse }> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("website", payload.website);
  if (payload.additionalDetails) formData.append("additionalDetails", payload.additionalDetails);
  if (payload.file) formData.append("file", payload.file);
  if (payload.startPage !== undefined) formData.append("startPage", String(payload.startPage));
  if (payload.endPage !== undefined) formData.append("endPage", String(payload.endPage));

  const response = await apiClient.request("post", "/competitions/generate", undefined, formData);
  return response as unknown as { success: boolean; data: GenerateCompetitionResponse };
};

export type GetCompetitionDetailResponse = {
  success?: boolean;
  data?: CompetitionItem;
};

type ApiClientRequest = (method: string, url: string, ...args: unknown[]) => Promise<unknown>;

export const getCompetitionDetail = async (id: number): Promise<GetCompetitionDetailResponse> => {
  const api = apiClient as unknown as { request: ApiClientRequest };
  const response = await api.request("get", `/competitions/${id}`);
  return response as unknown as GetCompetitionDetailResponse;
};
