import { HttpStatusCode } from "axios";

import { getLogger } from "@/app/server/utils/pino.helper";
import { AdvisorPayload } from "@/app/shared/schema/advisor/AdvisorSchema";

import { USER_ERROR_RESPONSE } from "../../user/user.error";
import { createUser, findUserByEmail } from "../../user/user.repository";
import { generateHash } from "../../utils/bcrypt/bcrypt";
import { customError } from "../../utils/error/custom-error";
import { createAdvisor } from "../advisor.repository";

export const createAdvisorUsecase = async (body: AdvisorPayload) => {
  const logger = getLogger({ module: "usecase/create-advisor" });
  logger.debug({ email: body.email }, "Creating advisor - start");
  const user = await findUserByEmail(body.email);

  if (user) {
    throw customError(
      USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.code,
      USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.message,
      HttpStatusCode.Conflict
    );
  }
  const hashedPassword = await generateHash(body.email);
  const newUser = await createUser({
    ...body,
    password: hashedPassword,
  });

  await createAdvisor(newUser.id);
  logger.info({ userId: newUser.id }, "Creating advisor - success");
};
