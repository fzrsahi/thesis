import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { PasswordChangePayload } from "@/app/shared/validations/schema/passwordSchema";

const updatePassword = async (data: PasswordChangePayload) => {
  const response = await axios.put("/api/students/password", data);
  return response.data;
};

export const useMutationUpdatePassword = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) =>
  useMutation({
    mutationFn: updatePassword,
    ...options,
  });
