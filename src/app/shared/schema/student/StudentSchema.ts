import { z } from "zod";

import { paths } from "@/app/shared/types/api";
import { InferZodMap } from "@/app/shared/utils/zod/zodTypeHelper";

type StudentRequest = paths["/students"]["post"]["requestBody"]["content"]["application/json"];

export const StudentSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  studentId: z.string().nonempty({ message: "Student ID is required" }),
} satisfies InferZodMap<StudentRequest>);

export type StudentPayload = z.infer<typeof StudentSchema>;
export type PostStudentsResponse =
  paths["/students"]["post"]["responses"]["201"]["content"]["application/json"];

export type GetStudentsResponse =
  paths["/students"]["get"]["responses"]["200"]["content"]["application/json"];
export type GetStudentsResponseData = GetStudentsResponse["data"];
