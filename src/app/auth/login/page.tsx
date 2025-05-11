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

import useLogin from "./useLogin";

const LoginPage = () => {
  const { form, isLoading, showPassword, setShowPassword, onSubmit } = useLogin();

  return (
    <div className="flex min-h-screen">
      <div className="relative flex w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-12 text-white">
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

      <div className="flex w-1/2 flex-col justify-center bg-black p-12 text-white">
        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-1 text-center text-3xl font-bold">Masuk</h1>
          <p className="my-1 text-center text-sm text-gray-300">
            Silahkan masukan akun anda yang terdaftar
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                          className="w-full rounded-md border border-zinc-500 bg-black px-3 py-2 focus:border-black focus:ring-0"
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
                    <FormLabel className="text-sm text-gray-100">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full rounded-md border border-zinc-500 bg-black px-3 py-2 focus:border-black focus:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-2.5 right-3 text-gray-500 hover:text-black focus:outline-none"
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
                className="mt-2 w-full cursor-pointer rounded-md bg-gray-100 py-2 text-black hover:bg-gray-300"
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
