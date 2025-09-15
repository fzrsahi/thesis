import { PaginatedResult, PaginationParams } from "../../utils/pagination/pagination.types";
import { AdvisorListItem, getAdvisors } from "../advisor.repository";

export const getAdvisorsUsecase = async (
  pagination?: PaginationParams
): Promise<PaginatedResult<AdvisorListItem>> => getAdvisors(pagination);
