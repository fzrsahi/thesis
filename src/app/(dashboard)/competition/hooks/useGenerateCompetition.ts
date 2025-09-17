import { useState } from "react";

import { CreateCompetitionGeneratePayload } from "@/app/shared/schema/competition/CompetitionGenerateSchema";
import { generateCompetition } from "@/client/api/competitions";

type BackendErrorData = {
  code?: string;
  message?: string;
  error?: { message?: string };
};

type BackendHttpError = {
  response?: { data?: BackendErrorData };
  message?: string;
};

const isBackendHttpError = (e: unknown): e is BackendHttpError => {
  if (!e || typeof e !== "object") return false;
  const maybe = e as Record<string, unknown>;
  return (
    (typeof maybe.response === "object" && maybe.response !== null) ||
    typeof maybe.message === "string"
  );
};

const extractBackendMessage = (e: unknown): string | null => {
  if (isBackendHttpError(e)) {
    const data = (e.response as { data?: BackendErrorData } | undefined)?.data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
    if (e.message) return e.message;
  } else if (e instanceof Error) {
    return e.message;
  }
  return null;
};

export const useGenerateCompetition = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const handleGenerate = async (values: CreateCompetitionGeneratePayload): Promise<boolean> => {
    setGenerateError("");
    setIsGenerating(true);
    try {
      const res = await generateCompetition(values);
      if (res?.success) {
        return true;
      }
      // If API client didn't throw but success is false, use safe fallback
      throw new Error("Gagal menyimpan. Periksa isian atau coba lagi.");
    } catch (e: unknown) {
      const message = extractBackendMessage(e) ?? "Terjadi kesalahan pada server";
      setGenerateError(message);
      throw new Error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGenerateError = () => setGenerateError("");

  return {
    isGenerating,
    generateError,
    handleGenerate,
    resetGenerateError,
  };
};
