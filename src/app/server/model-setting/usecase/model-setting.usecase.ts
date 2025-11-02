import { getLogger } from "@/app/server/utils/helpers/pino.helper";
import { ModelSettingUpdatePayload } from "@/app/shared/validations/schema/modelSettingSchema";

import {
  createModelSetting,
  findActiveModelSetting,
  getAllModelSettings,
} from "../model-setting.repository";

export const getActiveModelSettingUsecase = async () => {
  const logger = getLogger({ module: "usecase/get-active-model-setting" });
  logger.debug("Getting active model setting - start");

  const setting = await findActiveModelSetting();

  logger.info("Getting active model setting - success");
  return setting;
};

export const getAllModelSettingsUsecase = async () => {
  const logger = getLogger({ module: "usecase/get-all-model-settings" });
  logger.debug("Getting all model settings - start");

  const settings = await getAllModelSettings();

  logger.info("Getting all model settings - success");
  return settings;
};

export const updateModelSettingUsecase = async (
  provider: string,
  model: string,
  payload: ModelSettingUpdatePayload
) => {
  const logger = getLogger({ module: "usecase/update-model-setting" });
  logger.debug({ provider, model }, "Updating model setting - start");

  const updated = await createModelSetting({
    apiKey: payload.apiKey,
    provider: payload.provider || provider,
    model: payload.model || model,
    instanceName: payload.instanceName,
    gptEndpoint: payload.gptEndpoint,
    isActive: payload.isActive ?? true,
  });

  logger.info({ provider, model }, "Updating model setting - success");
  return updated;
};
