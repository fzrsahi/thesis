import { components } from "@/app/shared/types/api";

import apiClient from "./apiClient";

export type StudentItem = components["schemas"]["StudentPersonalData"];
export type PaginationMeta = components["schemas"]["Pagination"];

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
