import { HttpStatusCode } from "axios";

import { AdvisorPayload } from "@/app/shared/schema/advisor/AdvisorSchema";

import { USER_ERROR_RESPONSE } from "../../user/user.error";
import { createUser, findUserByEmail } from "../../user/user.repository";
import { generateHash } from "../../utils/bcrypt/bcrypt";
import { customError } from "../../utils/error/custom-error";
import { createAdvisor } from "../advisor.repository";

export const createAdvisorUsecase = async (body: AdvisorPayload) => {
  const user = await findUserByEmail(body.email);

  if (user) {
    throw customError(
      USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.message,
      USER_ERROR_RESPONSE.EMAIL_ALREADY_EXISTS.code,
      HttpStatusCode.Conflict
    );
  }
  const hashedPassword = await generateHash(body.email);
  const newUser = await createUser({
    ...body,
    password: hashedPassword,
  });

  await createAdvisor(newUser.id);
};
