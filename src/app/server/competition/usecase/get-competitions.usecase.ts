import { PaginationParams } from "../../utils/pagination/pagination.types";
import { getCompetitions } from "../competition.repository";

export const getCompetitionsUsecase = async (pagination: PaginationParams) =>
  getCompetitions(pagination);
