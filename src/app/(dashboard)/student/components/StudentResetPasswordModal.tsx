"use client";

import { Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3, TypographyP } from "@/components/ui/typography";

interface StudentResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<boolean>;
  studentName?: string;
  studentId?: string;
  submitText?: string;
}

export const StudentResetPasswordModal = ({
  open,
  onOpenChange,
  onSubmit,
  studentName,
  studentId,
  submitText = "Reset Password",
}: StudentResetPasswordModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const success = await onSubmit();
      if (success) {
        onOpenChange(false);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat reset password. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError("");
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md">
        <Card className="border-2 border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl">
          <CardHeader className="border-b border-zinc-700 bg-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Reset Password</CardTitle>
                <CardDescription className="text-zinc-400">
                  {studentName && studentId
                    ? `Reset password untuk ${studentName} (${studentId})`
                    : "Reset password mahasiswa"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <TypographyP className="text-sm text-red-400">{error}</TypographyP>
                </div>
              )}

              {/* Warning Message */}
              <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" />
                  <div className="space-y-2">
                    <TypographyH3 className="text-sm font-semibold text-orange-300">
                      Konfirmasi Reset Password
                    </TypographyH3>
                    <TypographyP className="text-sm text-zinc-300">
                      Password akan di reset menjadi NIM mahasiswa
                    </TypographyP>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <div className="space-y-2">
                  <TypographyP className="text-sm font-medium text-zinc-300">
                    Mahasiswa yang akan direset password:
                  </TypographyP>
                  <div className="space-y-1">
                    <TypographyP className="text-sm text-white">
                      <span className="text-zinc-400">Nama:</span> {studentName || "Tidak tersedia"}
                    </TypographyP>
                    <TypographyP className="text-sm text-white">
                      <span className="text-zinc-400">NIM:</span> {studentId || "Tidak tersedia"}
                    </TypographyP>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : submitText}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
