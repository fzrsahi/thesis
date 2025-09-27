import { HttpStatusCode } from "axios";

import { COMPETITION_ERROR_RESPONSE } from "../../competition/competition.error";
import { customError } from "../../utils/error/custom-error";
import { getRecomendationByCompetitionId } from "../recomendation.repository";

export const getRecomendationByCompetitionIdUsecase = async (competitionId: number) => {
  if (!competitionId || competitionId <= 0) {
    throw customError(
      COMPETITION_ERROR_RESPONSE.BAD_REQUEST.code,
      COMPETITION_ERROR_RESPONSE.BAD_REQUEST.message,
      HttpStatusCode.BadRequest
    );
  }

  const result = await getRecomendationByCompetitionId(competitionId);

  if (!result) {
    throw customError(
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.code,
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  return result;
};
