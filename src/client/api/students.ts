import { components, paths } from "@/app/shared/types/api";

import apiClient from "./apiClient";

export type StudentItem = components["schemas"]["StudentPersonalData"];
export type PaginationMeta = components["schemas"]["Pagination"];
export type StudentDetail =
  paths["/students/{id}"]["get"]["responses"][200]["content"]["application/json"]["data"];

export type GetStudentsParams = {
  page?: number;
  limit?: number;
  keywords?: string;
};

export type GetStudentsResponse = {
  success?: boolean;
  data?: StudentItem[];
  pagination?: PaginationMeta;
};

export const getStudents = async (params: GetStudentsParams): Promise<GetStudentsResponse> => {
  const response = await apiClient.request("get", "/students", {
    query: {
      page: params.page,
      limit: params.limit,
      keywords: params.keywords,
    },
  });
  return response as unknown as GetStudentsResponse;
};

export type CreateStudentRequest = {
  name: string;
  email: string;
  studentId: string;
};

export type CreateStudentResponse = {
  success: boolean;
};

export const createStudent = async (
  payload: CreateStudentRequest
): Promise<CreateStudentResponse> => {
  const response = await apiClient.request("post", "/students", undefined, payload);
  return response as unknown as CreateStudentResponse;
};

export type GetStudentDetailResponse = {
  success?: boolean;
  data?: StudentDetail;
};

type ApiClientRequest = (method: string, url: string, ...args: unknown[]) => Promise<unknown>;

export const getStudentDetail = async (id: number): Promise<GetStudentDetailResponse> => {
  const api = apiClient as unknown as { request: ApiClientRequest };
  const response = await api.request("get", `/students/${id}`);
  return response as unknown as GetStudentDetailResponse;
};

export type DeleteStudentResponse = {
  success: boolean;
};

export const deleteStudent = async (id: number): Promise<DeleteStudentResponse> => {
  const api = apiClient as unknown as { request: ApiClientRequest };
  const response = await api.request("delete", `/students/${id}`);
  return response as unknown as DeleteStudentResponse;
};
