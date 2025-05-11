import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Harus menggunakan email yang valid")
    .max(255, "Email harus memiliki maksimal 255 karakter")
    .toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginPayload = z.infer<typeof loginSchema>;
