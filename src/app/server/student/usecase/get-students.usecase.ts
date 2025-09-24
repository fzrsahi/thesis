import { PaginationParams, PaginatedResult } from "../../utils/pagination/pagination.types";
import { getStudents, StudentListItem } from "../student.repository";

export type StudentFilter = {
  studyProgramId?: number;
  entryYear?: number;
};

export const getStudentsUsecase = async (
  pagination?: PaginationParams,
  filter?: StudentFilter
): Promise<PaginatedResult<StudentListItem>> => getStudents(pagination, filter);
