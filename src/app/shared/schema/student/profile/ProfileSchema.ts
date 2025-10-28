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
  achievements: z
    .array(
      z.object({
        title: z.string().nonempty({ message: "Title is required" }),
        description: z.string().nonempty({ message: "Description is required" }),
        date: z.string().nonempty({ message: "Date is required" }),
      })
    )
    .default([]),
  interests: z.array(z.string().nonempty({ message: "Interest is required" })).default([]),
  skills: z.array(z.string().nonempty({ message: "Skill is required" })).default([]),
  experiences: z
    .array(
      z.object({
        organization: z.string().nonempty({ message: "Organization is required" }),
        position: z.string().nonempty({ message: "Position is required" }),
        description: z.string().nonempty({ message: "Description is required" }),
        startDate: z.string().nonempty({ message: "Start date is required" }),
        endDate: z.string().optional(),
      })
    )
    .default([]),
}) satisfies z.ZodType<UpdateAcademicDataRequest>;

export type PersonalDataPayload = z.infer<typeof personalDataSchema>;
export type AcademicDataPayload = z.infer<typeof academicDataSchema>;
