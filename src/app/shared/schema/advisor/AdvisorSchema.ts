import { z } from "zod";

import { paths } from "@/app/shared/types/api";
import { InferZodMap } from "@/app/shared/utils/zod/zodTypeHelper";

type AdvisorRequest = paths["/advisors"]["post"]["requestBody"]["content"]["application/json"];

export const AdvisorSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  studyProgramId: z.number().nullable(),
  type: z.enum(["HeadOfDepartment", "HeadOfStudyProgram"]),
} satisfies InferZodMap<AdvisorRequest>);

export type AdvisorPayload = z.infer<typeof AdvisorSchema>;
export type PostStudentsResponse =
  paths["/advisors"]["post"]["responses"]["201"]["content"]["application/json"];

export type GetAdvisorsResponse =
  paths["/advisors"]["get"]["responses"]["200"]["content"]["application/json"];
export type GetAdvisorsResponseData = GetAdvisorsResponse["data"];
