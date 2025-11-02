"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Key,
  Copy,
  Brain,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { type ProfileUpdatePayload } from "@/app/shared/validations/schema/profileSchema";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProfilePage = () => {
  const [isLight, setIsLight] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [llmProvider, setLlmProvider] = useState<string>("azure-openai");
  const [llmModel, setLlmModel] = useState<string>("gpt-4o");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfileData();
  }, []);

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

  const fetchProfileData = async () => {
    try {
      const [profileResponse, modelSettingResponse] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/model-setting"),
      ]);

      const profileResult = await profileResponse.json();
      const modelSettingResult = await modelSettingResponse.json();

      if (profileResult.success) {
        setName(profileResult.data.name || "");
        setEmail(profileResult.data.email || "");
      } else {
        toast.error(profileResult.error || "Gagal memuat profil");
        console.error("Profile fetch error:", profileResult);
      }

      if (modelSettingResult.success && modelSettingResult.data) {
        setApiKey(modelSettingResult.data.apiKey || "");
        setLlmProvider(modelSettingResult.data.provider || "azure-openai");
        setLlmModel(modelSettingResult.data.model || "gpt-4o");
      } else {
        // Set default values if no model setting exists
        setLlmProvider("azure-openai");
        setLlmModel("gpt-4o");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Gagal memuat data. Pastikan koneksi internet Anda stabil.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (name.trim().length < 2) {
      newErrors.name = "Nama harus minimal 2 karakter";
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validate password fields if any password field is filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Password saat ini wajib diisi";
      }

      if (!newPassword) {
        newErrors.newPassword = "Password baru wajib diisi";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "Password harus minimal 8 karakter";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        newErrors.newPassword =
          "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error("Silakan perbaiki kesalahan form");
      return;
    }

    setSaving(true);

    try {
      // Update profile
      const profileUpdateData: ProfileUpdatePayload = {
        name: name.trim(),
        email: email.trim(),
      };

      // Only include password fields if they're being changed
      if (currentPassword && newPassword) {
        profileUpdateData.currentPassword = currentPassword;
        profileUpdateData.newPassword = newPassword;
      }

      const [profileResponse, modelSettingResponse] = await Promise.all([
        fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileUpdateData),
        }),
        fetch("/api/model-setting", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey: apiKey.trim() || undefined,
            provider: llmProvider,
            model: llmModel.trim(),
            isActive: true,
          }),
        }),
      ]);

      const profileResult = await profileResponse.json();
      const modelSettingResult = await modelSettingResponse.json();

      if (profileResult.success) {
        toast.success("Berhasil memperbarui profil");
        setName(profileResult.data.name);
        setEmail(profileResult.data.email);

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(profileResult.error || "Gagal memperbarui profil");
      }

      if (modelSettingResult.success) {
        if (modelSettingResult.data) {
          setApiKey(modelSettingResult.data.apiKey || "");
          setLlmProvider(modelSettingResult.data.provider || "azure-openai");
          setLlmModel(modelSettingResult.data.model || "gpt-4o");
        }
        toast.success("Berhasil memperbarui konfigurasi LLM");
      } else {
        toast.error(modelSettingResult.error || "Gagal memperbarui konfigurasi LLM");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Gagal memperbarui data");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success("API key berhasil disalin ke clipboard");
    }
  };

  // Model options based on provider
  const getModelOptions = () => getModelOptionsForProvider(llmProvider);

  const getModelOptionsForProvider = (provider: string) => {
    switch (provider) {
      case "azure-openai":
        return [
          { value: "gpt-4o", label: "GPT-4o", disabled: false },
          { value: "gpt-4", label: "GPT-4", disabled: true },
          { value: "gpt-4-turbo", label: "GPT-4 Turbo", disabled: true },
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", disabled: true },
        ];
      case "openai":
        return [
          { value: "gpt-4o", label: "GPT-4o", disabled: true },
          { value: "gpt-4", label: "GPT-4", disabled: true },
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", disabled: true },
        ];
      case "google-gemini":
        return [
          { value: "gemini-pro", label: "Gemini Pro", disabled: true },
          { value: "gemini-pro-vision", label: "Gemini Pro Vision", disabled: true },
        ];
      default:
        return [{ value: "gpt-4o", label: "GPT-4o", disabled: false }];
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const borderColor = isLight ? "border-stone-300" : "border-gray-500";
  const cardBorder = isLight ? "border-stone-300/70" : "border-zinc-600/50";
  const cardBg = isLight
    ? "bg-white/90 backdrop-blur-sm"
    : "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900";
  const cardText = isLight ? "text-[#2F2A24]" : "text-white";
  const cardDesc = isLight ? "text-[#5C5245]" : "text-zinc-300";
  const inputBorder = isLight ? "border-stone-300/70" : "border-zinc-600";
  const inputBg = isLight ? "bg-white" : "bg-zinc-800";
  const inputText = isLight ? "text-[#2F2A24]" : "text-white";
  const inputPlaceholder = isLight ? "placeholder-zinc-400" : "placeholder-zinc-400";
  const inputFocus = isLight ? "focus:border-[#F6A964]" : "focus:border-blue-500";
  const labelText = isLight ? "text-[#5C5245]" : "text-zinc-300";
  const iconText = isLight ? "text-zinc-500" : "text-zinc-400";

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className={cn("flex items-center gap-2", textPrimary)}>
          <User className="h-10 w-10 font-extrabold" />
          Pengaturan
        </TypographyH2>
        <TypographyP className={cn("border-b pb-4", borderColor, textSecondary)}>
          Kelola informasi profil, keamanan akun, dan konfigurasi LLM (Large Language Model) Anda
        </TypographyP>
        <div className={cn("mb-6 border-t", borderColor)} />
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
        {/* Profile Information Card */}
        <motion.div variants={staggerItem}>
          <Card
            className={cn(
              "border shadow-xl backdrop-blur-sm transition-colors",
              cardBorder,
              cardBg
            )}
          >
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", cardText)}>
                <User className="h-5 w-5" />
                Informasi Profil
              </CardTitle>
              <CardDescription className={cardDesc}>
                Update informasi dasar profil Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className={labelText}>
                    Nama Lengkap
                  </Label>
                  <div className="relative">
                    <User
                      className={cn(
                        "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform",
                        iconText
                      )}
                    />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      className={cn(
                        "pl-10 transition-colors",
                        inputBorder,
                        inputBg,
                        inputText,
                        inputPlaceholder,
                        inputFocus
                      )}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  {errors.name && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={labelText}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className={cn(
                        "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform",
                        iconText
                      )}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      className={cn(
                        "pl-10 transition-colors",
                        inputBorder,
                        inputBg,
                        inputText,
                        inputPlaceholder,
                        inputFocus
                      )}
                      placeholder="Masukkan email"
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Change Card */}
        <motion.div variants={staggerItem}>
          <Card
            className={cn(
              "border shadow-xl backdrop-blur-sm transition-colors",
              cardBorder,
              cardBg
            )}
          >
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", cardText)}>
                <Shield className="h-5 w-5" />
                Ubah Password
              </CardTitle>
              <CardDescription className={cardDesc}>
                Kosongkan jika tidak ingin mengubah password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className={labelText}>
                  Password Saat Ini
                </Label>
                <div className="relative">
                  <Lock
                    className={cn(
                      "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform",
                      iconText
                    )}
                  />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCurrentPassword(e.target.value)
                    }
                    className={cn(
                      "pr-10 pl-10 transition-colors",
                      inputBorder,
                      inputBg,
                      inputText,
                      inputPlaceholder,
                      inputFocus
                    )}
                    placeholder="Masukkan password saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={cn(
                      "absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors hover:opacity-70",
                      iconText
                    )}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="flex items-center gap-1 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className={labelText}>
                    Password Baru
                  </Label>
                  <div className="relative">
                    <Lock
                      className={cn(
                        "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform",
                        iconText
                      )}
                    />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPassword(e.target.value)
                      }
                      className={cn(
                        "pr-10 pl-10 transition-colors",
                        inputBorder,
                        inputBg,
                        inputText,
                        inputPlaceholder,
                        inputFocus
                      )}
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={cn(
                        "absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors hover:opacity-70",
                        iconText
                      )}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={labelText}>
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className={cn(
                        "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform",
                        iconText
                      )}
                    />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setConfirmPassword(e.target.value)
                      }
                      className={cn(
                        "pr-10 pl-10 transition-colors",
                        inputBorder,
                        inputBg,
                        inputText,
                        inputPlaceholder,
                        inputFocus
                      )}
                      placeholder="Konfirmasi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={cn(
                        "absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors hover:opacity-70",
                        iconText
                      )}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* LLM Configuration Card */}
        <motion.div variants={staggerItem}>
          <Card
            className={cn(
              "border shadow-xl backdrop-blur-sm transition-colors",
              cardBorder,
              cardBg
            )}
          >
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", cardText)}>
                <Brain className="h-5 w-5" />
                Konfigurasi LLM
              </CardTitle>
              <CardDescription className={cardDesc}>
                Konfigurasi model Large Language Model (LLM) yang digunakan untuk fitur AI dalam
                aplikasi. Pilih provider dan model sesuai kebutuhan Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <Label htmlFor="llmProvider" className={labelText}>
                  Provider LLM
                </Label>
                <Select
                  value={llmProvider}
                  onValueChange={(value) => {
                    setLlmProvider(value);
                    // Reset model when provider changes - only use enabled models
                    const modelOptions = getModelOptionsForProvider(value);
                    const enabledModel = modelOptions.find((m) => !m.disabled);
                    setLlmModel(enabledModel?.value || "gpt-4o");
                  }}
                >
                  <SelectTrigger className={cn("w-full", inputBorder, inputBg, inputText)}>
                    <SelectValue placeholder="Pilih provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="azure-openai">Azure OpenAI</SelectItem>
                    <SelectItem value="openai" disabled>
                      OpenAI <span className="ml-2 text-xs opacity-60">(Akan Datang)</span>
                    </SelectItem>
                    <SelectItem value="google-gemini" disabled>
                      Google Gemini <span className="ml-2 text-xs opacity-60">(Akan Datang)</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-400")}>
                  {llmProvider === "azure-openai" &&
                    "Menggunakan Azure OpenAI Services dengan deployment GPT"}
                  {llmProvider === "openai" &&
                    "Menggunakan OpenAI API langsung atau melalui OpenRouter"}
                  {llmProvider === "google-gemini" && "Menggunakan Google Gemini API"}
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="llmModel" className={labelText}>
                  Model
                </Label>
                <Select value={llmModel} onValueChange={setLlmModel}>
                  <SelectTrigger className={cn("w-full", inputBorder, inputBg, inputText)}>
                    <SelectValue placeholder="Pilih model" />
                  </SelectTrigger>
                  <SelectContent>
                    {getModelOptions().map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                        {option.disabled && (
                          <span className="ml-2 text-xs opacity-60">(Akan Datang)</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-400")}>
                  Model saat ini:{" "}
                  <span className="font-medium">
                    {getModelOptions().find((m) => m.value === llmModel)?.label || llmModel}
                  </span>
                </p>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="apiKey" className={labelText}>
                  API Key{" "}
                  {llmProvider === "azure-openai"
                    ? "Azure OpenAI"
                    : llmProvider === "openai"
                      ? "OpenAI"
                      : "Google Gemini"}
                </Label>
                <div className="relative">
                  <Key
                    className={cn(
                      "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform",
                      iconText
                    )}
                  />
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                    className={cn(
                      "pr-24 pl-10 transition-colors",
                      inputBorder,
                      inputBg,
                      inputText,
                      inputPlaceholder,
                      inputFocus
                    )}
                    placeholder={`Masukkan ${llmProvider === "azure-openai" ? "Azure OpenAI" : llmProvider === "openai" ? "OpenAI" : "Google Gemini"} API key`}
                  />
                  <div className="absolute top-1/2 right-3 flex -translate-y-1/2 transform items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className={cn("transition-colors hover:opacity-70", iconText)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {apiKey && (
                      <button
                        type="button"
                        onClick={handleCopyApiKey}
                        className={cn("transition-colors hover:opacity-70", iconText)}
                        title="Salin API key"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {!apiKey && (
                  <p className="flex items-center gap-1 text-sm text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    API key diperlukan untuk menggunakan fitur AI. Masukkan API key Anda di atas.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={staggerItem} className="flex justify-end">
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className={cn(
              "rounded-lg px-8 py-2 font-medium text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              isLight
                ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A] hover:from-[#F2A558] hover:to-[#D86330]"
                : "bg-gradient-to-r from-black to-black hover:from-black hover:to-black"
            )}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                Menyimpan...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
