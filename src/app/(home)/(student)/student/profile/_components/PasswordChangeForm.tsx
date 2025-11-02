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

interface PasswordChangeFormProps {
  isLight?: boolean;
}

const PasswordChangeForm = ({ isLight = false }: PasswordChangeFormProps) => {
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

  const labelClass = isLight ? "text-[#5C5245]" : "text-zinc-300";
  const helperClass = isLight ? "text-[#7A6B5B]" : "text-zinc-400";
  const iconColor = isLight ? "text-[#7A6B5B]" : "text-zinc-400";
  const inputClass = isLight
    ? "border-stone-300 bg-white text-[#2F2A24] focus:border-stone-400 focus:ring-stone-400/40"
    : "border-zinc-700 bg-zinc-800 text-white focus:border-zinc-500 focus:ring-zinc-500";
  const toggleClass = isLight
    ? "text-[#7A6B5B] hover:text-[#5C5245]"
    : "text-zinc-400 hover:text-zinc-300";
  const buttonClass = isLight
    ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A] text-white hover:brightness-105"
    : "bg-white text-black hover:bg-zinc-200";
  const spinnerBorder = isLight ? "border-white" : "border-black";

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Password Saat Ini</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform ${iconColor}`}
                    />
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Masukkan password saat ini"
                      {...field}
                      className={`pr-10 pl-10 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className={`absolute top-1/2 right-3 -translate-y-1/2 transform ${toggleClass}`}
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
                <FormLabel className={labelClass}>Password Baru</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform ${iconColor}`}
                    />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Masukkan password baru"
                      {...field}
                      className={`pr-10 pl-10 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute top-1/2 right-3 -translate-y-1/2 transform ${toggleClass}`}
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
                <p className={`text-xs ${helperClass}`}>
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
                <FormLabel className={labelClass}>Konfirmasi Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform ${iconColor}`}
                    />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi password baru"
                      {...field}
                      className={`pr-10 pl-10 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute top-1/2 right-3 -translate-y-1/2 transform ${toggleClass}`}
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
            className={`${buttonClass} disabled:opacity-50`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 animate-spin rounded-full border-b-2 ${spinnerBorder}`} />
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
