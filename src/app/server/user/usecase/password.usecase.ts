import { HttpStatusCode } from "axios";

import { compareHash, generateHash } from "@/app/server/utils/bcrypt/bcrypt";
import { customError } from "@/app/server/utils/error/custom-error";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { PasswordChangePayload } from "@/app/shared/validations/schema/passwordSchema";

import { USER_ERROR_RESPONSE } from "../user.error";
import { findUserById, updateUserProfile } from "../user.repository";

const logger = getLogger({ module: "usecase/password" });

export const updatePasswordUsecase = async (userId: number, payload: PasswordChangePayload) => {
  logger.debug({ userId }, "Updating user password - start");
  const { currentPassword, newPassword } = payload;

  const existingUser = await findUserById(userId);
  if (!existingUser) {
    logger.warn({ userId }, "User not found during password update");
    throw customError(
      USER_ERROR_RESPONSE.USER_NOT_FOUND.code,
      USER_ERROR_RESPONSE.USER_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  // Verify current password
  const isCurrentPasswordValid = await compareHash(currentPassword, existingUser.password);

  if (!isCurrentPasswordValid) {
    logger.warn({ userId }, "Invalid current password provided for update");
    throw customError(
      USER_ERROR_RESPONSE.INVALID_PASSWORD.code,
      USER_ERROR_RESPONSE.INVALID_PASSWORD.message,
      HttpStatusCode.BadRequest
    );
  }

  // Hash new password
  const hashedNewPassword = await generateHash(newPassword);

  // Update password
  await updateUserProfile(userId, { password: hashedNewPassword });

  logger.info({ userId }, "User password updated successfully");
  return { success: true };
};
