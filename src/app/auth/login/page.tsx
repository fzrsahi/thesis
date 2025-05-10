"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

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

import useLogin from "./useLogin";

export const LoginPage = () => {
  const { form, isLoading, showPassword, setShowPassword, onSubmit } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-12 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-primary/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <LockKeyhole className="text-primary h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Selamat Datang</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Masuk untuk melanjutkan perjalanan Anda
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input placeholder="you@example.com" className="pl-10" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <LockKeyhole className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10 pl-10"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="hover:bg-primary/90 w-full cursor-pointer py-6 text-base font-medium transition-all duration-300 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Memuat..." : "Masuk"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
