import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  currentPassword: z.string().min(1, { message: "Current password is required" }).optional(),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    })
    .optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Current password is required when changing password",
    path: ["currentPassword"],
  }
);

export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>;
