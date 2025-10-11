import { z } from "zod";

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini harus diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru dan konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export type PasswordChangePayload = z.infer<typeof passwordChangeSchema>;
