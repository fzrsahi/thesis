import { z } from "zod";

import { paths } from "../../types/api";
import { InferZodMap } from "../../utils/zod/zodTypeHelper";

type CreateCompetitionGenerateRequest = Omit<
  paths["/competitions/generate"]["post"]["requestBody"]["content"]["multipart/form-data"],
  "file"
> & {
  file?: File;
};

export const competitionGenerateSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    website: z.string().min(1),
    additionalDetails: z.string().optional(),
    file: z.instanceof(File).optional(),
    startPage: z.number().optional(),
    endPage: z.number().optional(),
  } satisfies InferZodMap<CreateCompetitionGenerateRequest>)
  .refine(
    (data) => {
      if ((data.startPage !== undefined || data.endPage !== undefined) && !data.file) {
        return false;
      }
      return true;
    },
    {
      message: "startPage and endPage can only be provided when file is uploaded",
      path: ["startPage", "endPage"],
    }
  );

export type CreateCompetitionGeneratePayload = z.infer<typeof competitionGenerateSchema>;
