import { z } from "zod";

export const modelSettingUpdateSchema = z.object({
  apiKey: z.string().optional(),
  provider: z.enum(["azure-openai", "openai", "google-gemini"]).optional(),
  model: z.string().min(1, { message: "Model is required" }).optional(),
  instanceName: z.string().optional().nullable(),
  gptEndpoint: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type ModelSettingUpdatePayload = z.infer<typeof modelSettingUpdateSchema>;
