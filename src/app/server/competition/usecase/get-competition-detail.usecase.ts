import { HttpStatusCode } from "axios";

import { getFileUrl } from "../../google-storage/google-storage.service";
import { customError } from "../../utils/error/custom-error";
import { COMPETITION_ERROR_RESPONSE } from "../competition.error";
import { findCompetitionById } from "../competition.repository";

export const getCompetitionDetailUsecase = async (id: number) => {
  const competition = await findCompetitionById(id);
  if (!competition) {
    throw customError(
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.code,
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }
  return {
    ...competition,
    fileId: competition.fileId ? await getFileUrl(competition.fileId) : competition.fileId,
  };
};
