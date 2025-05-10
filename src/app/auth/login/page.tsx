"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import useLogin from "./useLogin";

export default function LoginPage() {
  const { form, isLoading, showPassword, setShowPassword, onSubmit } =
    useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br bg-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-12 bg-white dark:bg-gray-950 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LockKeyhole className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Selamat Datang
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
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
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="pl-10"
                        {...field}
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
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
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

            <Button
              type="submit"
              className="w-full py-6 text-base font-medium transition-all duration-300 hover:shadow-lg hover:bg-primary/90 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Memuat..." : "Masuk"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
