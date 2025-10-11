import { HttpStatusCode } from "axios";

import { compareHash, generateHash } from "@/app/server/utils/bcrypt/bcrypt";
import { customError } from "@/app/server/utils/error/custom-error";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { ProfileUpdatePayload } from "@/app/shared/validations/schema/profileSchema";

import { USER_ERROR_RESPONSE } from "../user.error";
import { findUserById, updateUserProfile } from "../user.repository";

export const getProfileUsecase = async (userId: number) => {
  const logger = getLogger({ module: "usecase/get-profile" });
  logger.debug({ userId }, "Getting profile - start");

  const user = await findUserById(userId, {
    id: true,
    email: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  });

  if (!user) {
    throw customError(
      USER_ERROR_RESPONSE.USER_NOT_FOUND.code,
      USER_ERROR_RESPONSE.USER_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  logger.info({ userId }, "Getting profile - success");
  return user;
};

export const updateProfileUsecase = async (userId: number, payload: ProfileUpdatePayload) => {
  const logger = getLogger({ module: "usecase/update-profile" });
  logger.debug({ userId, hasPasswordChange: !!payload.newPassword }, "Updating profile - start");

  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw customError(
      USER_ERROR_RESPONSE.USER_NOT_FOUND.code,
      USER_ERROR_RESPONSE.USER_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  // If changing password, verify current password
  if (payload.newPassword && payload.currentPassword) {
    const isCurrentPasswordValid = await compareHash(
      payload.currentPassword,
      existingUser.password
    );

    if (!isCurrentPasswordValid) {
      throw customError(
        USER_ERROR_RESPONSE.INVALID_PASSWORD.code,
        USER_ERROR_RESPONSE.INVALID_PASSWORD.message,
        HttpStatusCode.BadRequest
      );
    }
  }

  // Prepare update data
  const updateData: Partial<{ name: string; email: string; password: string }> = {};
  if (payload.name) updateData.name = payload.name;
  if (payload.email) updateData.email = payload.email;
  if (payload.newPassword) updateData.password = await generateHash(payload.newPassword);

  const updatedUser = await updateUserProfile(userId, updateData);

  logger.info({ userId }, "Updating profile - success");
  return updatedUser;
};
