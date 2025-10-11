"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  passwordChangeSchema,
  type PasswordChangePayload,
} from "@/app/shared/validations/schema/passwordSchema";
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

import { useMutationUpdatePassword } from "../_api/useMutationUpdatePassword";

const PasswordChangeForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordChangePayload>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: updatePassword } = useMutationUpdatePassword({
    onSuccess: () => {
      toast.success("Password berhasil diubah");
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal mengubah password");
      }
    },
  });

  const onSubmit = async (data: PasswordChangePayload) => {
    setIsSubmitting(true);
    try {
      updatePassword(data);
    } catch (error) {
      toast.error("Gagal mengubah password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Password Saat Ini</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-400" />
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Masukkan password saat ini"
                      {...field}
                      className="border-zinc-700 bg-zinc-800 pr-10 pl-10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 transform text-zinc-400 hover:text-zinc-300"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Password Baru</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-400" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Masukkan password baru"
                      {...field}
                      className="border-zinc-700 bg-zinc-800 pr-10 pl-10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 transform text-zinc-400 hover:text-zinc-300"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-zinc-400">
                  Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, dan
                  angka
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Konfirmasi Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi password baru"
                      {...field}
                      className="border-zinc-700 bg-zinc-800 pr-10 pl-10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 transform text-zinc-400 hover:text-zinc-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-black" />
                Mengubah...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Ubah Password
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordChangeForm;
