import { z } from "zod";

import { type components } from "@/app/shared/types/api";

// Type aliases for better readability
type UpdatePersonalDataRequest = components["schemas"]["StudentPersonalDataUpdate"];
type UpdateAcademicDataRequest = components["schemas"]["StudentAcademicDataUpdate"];

// Personal Data Schema
export const personalDataSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  student_id: z.string().min(5, { message: "Invalid student ID" }),
}) satisfies z.ZodType<UpdatePersonalDataRequest>;

// Academic Data Schema
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

// Inferred Types
export type PersonalDataPayload = z.infer<typeof personalDataSchema>;
export type AcademicDataPayload = z.infer<typeof academicDataSchema>;

// Response Types
export interface PersonalDataResponse {
  success: boolean;
  data: {
    name: string;
    email: string;
    student_id: string;
  };
}

export interface AcademicDataResponse {
  success: boolean;
  data: {
    gpa: string;
    transcript_url?: string;
    achievements?: Array<{
      title: string;
      description: string;
      date: string;
    }>;
    memberships?: Array<{
      organization: string;
      position: string;
      start_date: string;
      end_date?: string;
    }>;
  };
}
