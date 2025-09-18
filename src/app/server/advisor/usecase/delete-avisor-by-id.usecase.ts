import { HttpStatusCode } from "axios";

import { ADVISOR_ERROR_RESPONSE } from "../../user/advisor.error";
import { customError } from "../../utils/error/custom-error";
import { deleteAdvisorById, findAdvisorById } from "../advisor.repository";

export const deleteAdvisorByIdUsecase = async (id: number) => {
  const advisor = await findAdvisorById(id);
  if (!advisor) {
    throw customError(
      ADVISOR_ERROR_RESPONSE.ADVISOR_NOT_FOUND.code,
      ADVISOR_ERROR_RESPONSE.ADVISOR_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  await deleteAdvisorById(id);
};
