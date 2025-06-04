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
  semester: z.string().regex(/^([1-9]|1[0-2])$/, {
    message: "Semester must be a number between 1 and 12",
  }),
} satisfies InferZodMap<UploadTranscriptRequest>);

export type UploadTranscriptPayload = z.infer<typeof UploadTranscriptSchema>;
export type PostTranscriptResponse =
  paths["/students/transcript"]["post"]["responses"]["200"]["content"]["application/json"];

export type GetTranscriptsResponse =
  paths["/students/transcript"]["get"]["responses"]["200"]["content"]["application/json"];

export type GetTranscriptsResponseData = GetTranscriptsResponse["data"];
