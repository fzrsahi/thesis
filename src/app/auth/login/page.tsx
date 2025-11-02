"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

import { AnimatedBlobs } from "@/components/animations/AnimatedBlobs";
import Button from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Input from "@/components/ui/input";

import useLogin from "./useLogin";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LoginForm = () => {
  const {
    form,
    isLoading,
    showPassword,
    setShowPassword,
    onSubmit,
    errorMessage,
    setErrorMessage,
  } = useLogin();

  const [isLight, setIsLight] = useState<boolean>(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("scout-theme") : null;
    if (stored) setIsLight(stored === "light");
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      const theme = customEvent?.detail?.theme;
      if (!theme) return;
      setIsLight(theme === "light");
    };
    window.addEventListener("scout-theme-change", handler as EventListener);
    return () => window.removeEventListener("scout-theme-change", handler as EventListener);
  }, []);

  const colors = {
    mainBg: isLight ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300" : "bg-black",
    cardBg: isLight ? "bg-stone-100/80" : "bg-zinc-900/70",
    cardBorder: isLight ? "border-stone-300/70" : "border-zinc-800/50",
    textPrimary: isLight ? "text-stone-900" : "text-white",
    textSecondary: isLight ? "text-stone-600" : "text-zinc-400",
    inputBg: isLight ? "bg-white" : "bg-zinc-800/50",
    inputBorder: isLight
      ? "border-stone-300 focus:border-stone-400 focus:ring-stone-400/50"
      : "border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500",
    inputText: isLight ? "text-stone-900 placeholder-stone-400" : "text-white",
  } as const;

  const ctaGradientClass = isLight
    ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A] text-white hover:brightness-105"
    : "bg-white text-black hover:bg-zinc-200";

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 ${colors.mainBg}`}
    >
      <AnimatedBlobs />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link href="/">
          <div
            className={`group flex items-center gap-3 rounded-full border p-3 backdrop-blur-md transition-all duration-300 ${
              isLight
                ? "border-stone-300/70 bg-stone-100/80 hover:border-stone-400 hover:bg-stone-100"
                : "border-zinc-800/50 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-800/70"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 ${isLight ? "text-stone-900" : "text-white"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span
              className={`pr-1 text-sm font-medium transition-opacity duration-300 group-hover:opacity-100 ${colors.textPrimary}`}
            >
              Home
            </span>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`relative z-10 mx-auto w-full max-w-lg rounded-xl border p-8 shadow-xl backdrop-blur-md ${colors.cardBorder} ${colors.cardBg}`}
      >
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="mb-4 flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Scout"
              width={56}
              height={56}
              className={`mt-2 ${isLight ? "invert" : ""}`}
            />
            <Image
              src="/images/image.png"
              alt="Universitas Negeri Gorontalo"
              width={48}
              height={48}
            />
          </div>
          <h1 className={`text-xl font-semibold ${colors.textPrimary}`}>Selamat datang di Scout</h1>
          <p className={`mt-1 text-center text-xs ${colors.textSecondary}`}>
            Masuk dengan akun Anda untuk melanjutkan
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className={`h-12 w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus:ring-1 ${colors.inputBg} ${colors.inputText} ${colors.inputBorder}`}
                        {...field}
                        onFocus={() => setErrorMessage(null)}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Kata Sandi"
                        className={`h-12 w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus:ring-1 ${colors.inputBg} ${colors.inputText} ${colors.inputBorder}`}
                        {...field}
                        onFocus={() => setErrorMessage(null)}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-2.5 right-3 transition-colors duration-200 focus:outline-none ${isLight ? "text-stone-500 hover:text-stone-700" : "text-zinc-400 hover:text-zinc-200"}`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {errorMessage && (
              <div className="rounded-md bg-red-500/10 p-2 text-xs font-medium text-red-500">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className={`mt-2 w-full cursor-pointer rounded-md py-2 text-sm font-medium shadow-md transition-all duration-200 disabled:opacity-70 ${ctaGradientClass}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`h-3 w-3 animate-spin rounded-full border-2 ${isLight ? "border-white/60" : "border-zinc-800"} border-t-transparent`}
                  />
                  <span>Memuat...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </Form>
      </motion.div>

      <div className="absolute right-0 bottom-4 left-0 z-10 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Scout.
      </div>
    </div>
  );
};

const LoginPage = () => (
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    }
  >
    <LoginForm />
  </Suspense>
);

export default LoginPage;
