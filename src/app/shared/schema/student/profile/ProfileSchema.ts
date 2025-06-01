import { z } from "zod";

import { type components } from "@/app/shared/types/api";

type UpdatePersonalDataRequest = components["schemas"]["StudentPersonalDataUpdate"];
type UpdateAcademicDataRequest = components["schemas"]["StudentAcademicDataUpdate"];

export const personalDataSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  student_id: z.string().min(5, { message: "Invalid student ID" }),
}) satisfies z.ZodType<UpdatePersonalDataRequest>;

export const academicDataSchema = z.object({
  gpa: z.string().optional(),
  transcript_url: z.string().url().optional(),
  achievements: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
      })
    )
    .optional(),
  interests: z.array(z.string()).optional(),
  experiences: z
    .array(
      z.object({
        organization: z.string(),
        position: z.string(),
        description: z.string(),
        start_date: z.string(),
        end_date: z.string().optional(),
      })
    )
    .optional(),
}) satisfies z.ZodType<UpdateAcademicDataRequest>;

export type PersonalDataPayload = z.infer<typeof personalDataSchema>;
export type AcademicDataPayload = z.infer<typeof academicDataSchema>;
