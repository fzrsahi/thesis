import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema, LoginPayload } from "@/app/shared/validations/schema/loginSchema";

const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (formData: LoginPayload) => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.status === 401) {
          setErrorMessage("Email atau password salah");
          return;
        }

        const callbackUrl = new URL(
          searchParams?.get("callbackUrl") ?? "/dashboard",
          process.env.NEXT_PUBLIC_BASE_URL
        );

        router.push(callbackUrl.toString());
        router.refresh();
      } catch (error) {
        setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    },
    [router, searchParams]
  );

  return {
    form,
    isLoading,
    setShowPassword,
    showPassword,
    onSubmit,
    errorMessage,
    setErrorMessage,
  };
};

export default useLogin;
