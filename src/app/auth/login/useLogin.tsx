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

        const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl,
        });

        if (!result?.ok) {
          setErrorMessage(result?.error || "Email atau password salah");
          return;
        }
        if (result?.url) {
          router.push(result.url);
        } else {
          router.push(callbackUrl);
        }
        router.refresh();
      } catch (error) {
        console.error("Login error:", error);
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
