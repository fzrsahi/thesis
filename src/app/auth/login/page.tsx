"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import WordParticleAnimation from "@/components/animations/WordParticleAnimation";
import Button from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

import useLogin from "./useLogin";

const LoginPage = () => {
  const {
    form,
    isLoading,
    showPassword,
    setShowPassword,
    onSubmit,
    errorMessage,
    setErrorMessage,
  } = useLogin();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {!isMobile && (
        <div className="relative flex w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-6 text-white md:p-12">
          <WordParticleAnimation />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" />
              <span className="font-semibold">Chill LLMs</span>
            </div>
          </div>
          <div className="relative z-10 max-w-md">
            <blockquote className="text-sm italic">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et saepe provident odit, sit
              reprehenderit quod sunt alias ducimus consequuntur accusamus officia accusantium quo?
              Fugit, explicabo. Ducimus distinctio similique obcaecati dignissimos!
            </blockquote>
          </div>
        </div>
      )}

      <div
        className={`relative flex ${isMobile ? "min-h-screen w-full" : "w-1/2"} flex-col justify-center ${isMobile ? "bg-zinc-900" : "bg-black"} p-6 text-white md:p-12`}
      >
        {isMobile && <WordParticleAnimation className="opacity-70" />}
        {isMobile && (
          <div className="relative z-10 mb-8">
            <div className="flex items-center justify-center gap-2">
              <LockKeyhole className="h-6 w-6" />
              <span className="text-xl font-semibold">Chill LLMs</span>
            </div>
          </div>
        )}
        <div
          className={`relative z-10 mx-auto flex w-full max-w-md flex-col items-center justify-center ${isMobile ? "rounded-lg bg-zinc-800/80 p-6 shadow-lg backdrop-blur-sm" : ""}`}
        >
          <h1 className="mb-2 text-center text-3xl font-bold">Masuk</h1>
          <p className="mb-6 text-center text-sm text-gray-300">
            Silahkan masukan akun anda yang terdaftar
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-full space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-100">Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          className={`w-full rounded-md border ${isMobile ? "border-zinc-600 bg-zinc-700" : "border-zinc-500 bg-black"} px-3 py-2 focus:border-gray-300 focus:ring-1 focus:ring-gray-300`}
                          {...field}
                          onFocus={() => setErrorMessage(null)} // Clear error on focus
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-100">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`w-full rounded-md border ${isMobile ? "border-zinc-600 bg-zinc-700" : "border-zinc-500 bg-black"} px-3 py-2 focus:border-gray-300 focus:ring-1 focus:ring-gray-300`}
                          {...field}
                          onFocus={() => setErrorMessage(null)} // Clear error on focus
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-200 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="text-destructive text-sm font-medium">{errorMessage}</div>
              )}

              <Button
                type="submit"
                className={`mt-6 w-full cursor-pointer rounded-md ${isMobile ? "bg-white" : "bg-gray-100"} py-2.5 font-medium text-black hover:bg-gray-300`}
                disabled={isLoading}
              >
                {isLoading ? "Memuat..." : "Masuk"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
