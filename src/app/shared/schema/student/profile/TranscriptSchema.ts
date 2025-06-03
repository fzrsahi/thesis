import { z } from "zod";

import { paths } from "@/app/shared/types/api";
import { InferZodMap } from "@/app/shared/utils/zod/zodTypeHelper";

type UploadTranscriptRequest = Omit<
  paths["/students/transcript"]["post"]["requestBody"]["content"]["multipart/form-data"],
  "transcript"
> & {
  transcript: File;
};

export const UploadTranscriptSchema = z.object({
  transcript: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Transcript is required",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF format is allowed",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    }),
} satisfies InferZodMap<UploadTranscriptRequest>);

export type UploadTranscriptPayload = z.infer<typeof UploadTranscriptSchema>;
