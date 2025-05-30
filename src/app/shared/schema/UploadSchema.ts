import { z } from "zod";

import { paths } from "@/app/shared/types/api";
import { InferZodMap } from "@/app/shared/utils/zod/zodTypeHelper";

type UploadTranscriptRequest = Omit<
  paths["/students/transcript"]["post"]["requestBody"]["content"]["multipart/form-data"],
  "transcript"
> & {
  transcript: File;
};

const uploadTranscriptSchema = z.object({
  transcript: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "File must be a PDF",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    }),
} satisfies InferZodMap<UploadTranscriptRequest>);

export type UploadTranscriptPayload = z.infer<typeof uploadTranscriptSchema>;
