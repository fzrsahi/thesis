import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/app/server/auth/with-auth";
import {
  getActiveModelSettingUsecase,
  updateModelSettingUsecase,
} from "@/app/server/model-setting/usecase/model-setting.usecase";
import { internalServerError } from "@/app/server/utils/error/internal-server-error";
import { ROLES } from "@/app/shared/const/role";
import { modelSettingUpdateSchema } from "@/app/shared/validations/schema/modelSettingSchema";

export const GET = withAuth(
  async (_req: NextRequest) => {
    try {
      const activeSetting = await getActiveModelSettingUsecase();

      return NextResponse.json({
        success: true,
        data: activeSetting,
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: "Failed to get model setting",
        errorResponse: { code: "INTERNAL_ERROR", message: "Failed to get model setting" },
      });
    }
  },
  [ROLES.ADMIN]
);

export const PUT = withAuth(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      const result = modelSettingUpdateSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid data", details: result.error.errors },
          { status: 400 }
        );
      }

      const provider = result.data.provider || "azure-openai";
      const model = result.data.model || "gpt-4o";

      const updated = await updateModelSettingUsecase(provider, model, result.data);

      return NextResponse.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      return internalServerError(error, {
        errorLogMessage: "Failed to update model setting",
        errorResponse: { code: "INTERNAL_ERROR", message: "Failed to update model setting" },
      });
    }
  },
  [ROLES.ADMIN]
);
