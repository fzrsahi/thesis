import { HttpStatusCode } from "axios";

import { customError } from "../../utils/error/custom-error";
import { getLogger } from "../../utils/pino.helper";
import { COMPETITION_ERROR_RESPONSE } from "../competition.error";
import { deleteCompetitionById, findCompetitionById } from "../competition.repository";

export const deleteCompetitionByIdUsecase = async (id: number) => {
  const logger = getLogger({ module: "usecase/delete-competition-by-id" });
  logger.debug({ id }, "Deleting competition by id - start");
  const competition = await findCompetitionById(id);
  if (!competition) {
    logger.info({ id }, "Competition not found");
    throw customError(
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.code,
      COMPETITION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }
  await deleteCompetitionById(id);
  logger.info({ id }, "Competition deleted successfully");
};
