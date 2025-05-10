import { zodResolver } from "@hookform/resolvers/zod";
import { LoginPayload } from "./loginSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "./loginSchema";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginPayload) {
    setIsLoading(true);
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
    }, 1000);
  }

  return { form, isLoading, setShowPassword, showPassword, onSubmit };
};

export default useLogin;
