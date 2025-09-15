import { PaginationParams, PaginatedResult } from "../../utils/pagination/pagination.types";
import { getStudents, StudentListItem } from "../student.repository";

export const getStudentsUsecase = async (
  pagination?: PaginationParams
): Promise<PaginatedResult<StudentListItem>> => getStudents(pagination);
