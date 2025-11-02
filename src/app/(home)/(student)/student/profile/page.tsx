"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { Plus, X, User, GraduationCap, AlertCircle, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import {
  PersonalDataPayload,
  AcademicDataPayload,
} from "@/app/shared/schema/student/profile/ProfileSchema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";
import Skeleton from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import PasswordChangeForm from "./_components/PasswordChangeForm";
import TranscriptManagement from "./_components/TranscriptManagement";
import { useAcademicData } from "./_hooks/useAcademicData";
import { useAcademicDataForm } from "./_hooks/useAcademicDataForm";
import { usePersonalData } from "./_hooks/usePersonalData";
import { usePersonalDataForm } from "./_hooks/usePersonalDataForm";
import { useTranscript } from "./_hooks/useTranscript";

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"personal" | "academic">("personal");
  const [isLight, setIsLight] = useState<boolean>(true);

  const {
    data: personalData,
    isLoading: isLoadingPersonal,
    error: personalError,
  } = usePersonalData();

  const { data: academicData, isLoading: isLoadingAcademic } = useAcademicData();
  const { transcripts, isLoadingTranscripts } = useTranscript();

  const {
    form: personalForm,
    handleSubmit: handleSubmitPersonal,
    isLoading: isSubmittingPersonal,
    errorMessage,
    resetForm,
  } = usePersonalDataForm(personalData);

  const {
    form: academicForm,
    handleSubmit: handleSubmitAcademic,
    isLoading: isSubmittingAcademic,
    errorMessage: academicErrorMessage,
    resetForm: resetAcademicForm,
    achievementFields,
    appendAchievement,
    experienceFields,
    appendExperience,
    interestInput,
    setInterestInput,
    interests,
    handleAddInterest,
    handleRemoveInterest,
    formatDateToYearMonth,
    formatYearMonthToDate,
    isDeleteAchievementDialogOpen,
    setIsDeleteAchievementDialogOpen,
    isDeleteExperienceDialogOpen,
    setIsDeleteExperienceDialogOpen,
    achievementToDelete,
    experienceToDelete,
    handleDeleteAchievementClick,
    handleConfirmDeleteAchievement,
    handleCancelDeleteAchievement,
    handleDeleteExperienceClick,
    handleConfirmDeleteExperience,
    handleCancelDeleteExperience,
    skillInput,
    setSkillInput,
    skills,
    handleAddSkill,
    handleRemoveSkill,
    setAchievementFileAt,
    setExperienceFileAt,
  } = useAcademicDataForm(academicData);

  const onSubmitPersonal = (data: PersonalDataPayload) => {
    handleSubmitPersonal(data);
  };

  const onSubmitAcademic = (data: AcademicDataPayload) => {
    handleSubmitAcademic(data);
  };

  const tabs = [
    {
      id: "personal" as const,
      label: "Data Pribadi",
      icon: User,
      description: "Data Pribadi Anda",
    },
    {
      id: "academic" as const,
      label: "Data Prestasi",
      icon: GraduationCap,
      description: "Data Akademik dan Prestasi Anda",
    },
  ];

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

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const textMuted = isLight ? "text-[#7A6B5B]" : "text-zinc-500";
  const cardBase = isLight
    ? "border-stone-300 bg-white/90 text-[#2F2A24]"
    : "border-zinc-800 bg-zinc-900 text-white";
  const inputBase = isLight
    ? "border-stone-300 bg-white text-[#2F2A24] focus:border-stone-400 focus:ring-stone-400/40"
    : "border-zinc-700 bg-zinc-800 text-white focus:border-zinc-500 focus:ring-zinc-500";
  const tagBase = isLight ? "bg-[#EED4BC] text-[#2F2A24]" : "bg-zinc-600 text-white";
  const dashedBorder = isLight
    ? "border-stone-300/80 text-[#5C5245]"
    : "border-zinc-700 text-zinc-400";
  const separatorClass = isLight ? "bg-stone-300/80" : "bg-zinc-800";
  const tabContainer = isLight ? "bg-zinc-200/70" : "bg-zinc-800";
  const tabActive = isLight ? "bg-white text-[#2F2A24] shadow-sm" : "bg-white text-black shadow-sm";
  const tabInactive = isLight
    ? "text-[#6B5A4A] hover:bg-[#EED4BC] hover:text-[#2F2A24]"
    : "text-zinc-400 hover:bg-zinc-700 hover:text-white";
  const ctaButton = isLight
    ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A] text-white hover:brightness-105"
    : "bg-white text-black hover:bg-zinc-200";

  if (personalError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-400">Error loading profile data</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 transition-colors duration-300", textPrimary)}>
      {/* Header with Navigation */}
      <div className="space-y-4">
        <div>
          <h1 className={cn("text-2xl font-bold", textPrimary)}>Profil Mahasiswa</h1>
          <p className={cn("text-sm md:text-base", textSecondary)}>
            Mengelola informasi pribadi dan akademik Anda
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={cn("flex space-x-1 rounded-lg p-1", tabContainer)}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                  activeTab === tab.id ? tabActive : tabInactive
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delete Achievement Confirmation Dialog */}
      <Dialog open={isDeleteAchievementDialogOpen} onOpenChange={setIsDeleteAchievementDialogOpen}>
        <DialogContent
          className={cn(
            "text-sm",
            isLight
              ? "border-stone-300 bg-white text-[#2F2A24]"
              : "border-zinc-800 bg-zinc-900 text-white"
          )}
        >
          <DialogHeader>
            <DialogTitle className={textPrimary}>Delete Achievement</DialogTitle>
            <DialogDescription className={textSecondary}>
              Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {achievementToDelete && (
            <div
              className={cn(
                "rounded-lg border p-3",
                isLight ? "border-stone-300 bg-white/80" : "border-zinc-700 bg-zinc-800"
              )}
            >
              <p className={cn("text-sm font-medium", textPrimary)}>{achievementToDelete.title}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelDeleteAchievement}
              className={cn(
                "hover:bg-opacity-80",
                isLight
                  ? "text-[#7A6B5B] hover:bg-stone-200"
                  : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
              )}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDeleteAchievement}
              className={cn(
                "text-white",
                isLight ? "bg-red-500 hover:bg-red-600" : "bg-red-600 hover:bg-red-700"
              )}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Experience Confirmation Dialog */}
      <Dialog open={isDeleteExperienceDialogOpen} onOpenChange={setIsDeleteExperienceDialogOpen}>
        <DialogContent
          className={cn(
            "text-sm",
            isLight
              ? "border-stone-300 bg-white text-[#2F2A24]"
              : "border-zinc-800 bg-zinc-900 text-white"
          )}
        >
          <DialogHeader>
            <DialogTitle className={textPrimary}>Delete Experience</DialogTitle>
            <DialogDescription className={textSecondary}>
              Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {experienceToDelete && (
            <div
              className={cn(
                "rounded-lg border p-3",
                isLight ? "border-stone-300 bg-white/80" : "border-zinc-700 bg-zinc-800"
              )}
            >
              <p className={cn("text-sm font-medium", textPrimary)}>
                {experienceToDelete.organization}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelDeleteExperience}
              className={cn(
                "hover:bg-opacity-80",
                isLight
                  ? "text-[#7A6B5B] hover:bg-stone-200"
                  : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
              )}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDeleteExperience}
              className={cn(
                "text-white",
                isLight ? "bg-red-500 hover:bg-red-600" : "bg-red-600 hover:bg-red-700"
              )}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Profile Info Card */}
        <Card className={cn("transition-colors lg:col-span-1", cardBase)}>
          <CardHeader>
            <CardTitle className={textPrimary}>Profile Info</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarFallback
                className={cn(
                  "text-2xl",
                  isLight ? "bg-zinc-200 text-[#2F2A24]" : "bg-zinc-800 text-white"
                )}
              >
                {isLoadingPersonal ? (
                  <Skeleton className="h-8 w-8" />
                ) : (
                  personalData?.name?.charAt(0) || session?.user?.name?.charAt(0) || "U"
                )}
              </AvatarFallback>
            </Avatar>
          </CardContent>
          <CardContent>
            <div className="space-y-2">
              <Separator className={separatorClass} />
              <div className="text-sm">
                <p className={textMuted}>Program Studi</p>
                <p>{session?.user?.studyProgram?.name ?? "-"}</p>
              </div>
              <div className="text-sm">
                <p className={textMuted}>Angkatan</p>
                <p>{session?.user?.entryYear ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8 lg:col-span-3">
          {activeTab === "personal" && (
            <Card className={cn("transition-colors", cardBase)}>
              <CardHeader>
                <div>
                  <CardTitle className={cn("flex items-center gap-2", textPrimary)}>
                    <User className="h-5 w-5" />
                    Data Pribadi
                  </CardTitle>
                  <CardDescription className={textSecondary}>
                    Informasi pribadi Anda
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...personalForm}>
                  <form
                    onSubmit={personalForm.handleSubmit(onSubmitPersonal)}
                    className="space-y-6"
                    onChange={() => {
                      resetForm();
                    }}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={personalForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={textSecondary}>Nama Lengkap</FormLabel>
                            <FormControl>
                              {isLoadingPersonal ? (
                                <Skeleton className="h-10 w-full" />
                              ) : (
                                <Input
                                  placeholder="Nama Lengkap"
                                  {...field}
                                  className={cn("border", inputBase)}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalForm.control}
                        name="student_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={textSecondary}>NIM</FormLabel>
                            <FormControl>
                              {isLoadingPersonal ? (
                                <Skeleton className="h-10 w-full" />
                              ) : (
                                <Input
                                  placeholder="NIM"
                                  {...field}
                                  className={cn("border", inputBase)}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={personalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={textSecondary}>Email</FormLabel>
                          <FormControl>
                            {isLoadingPersonal ? (
                              <Skeleton className="h-10 w-full" />
                            ) : (
                              <Input
                                placeholder="Email"
                                {...field}
                                readOnly
                                className={cn("border", inputBase, "opacity-75")}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                          {errorMessage && (
                            <p className="mt-2 ml-2 text-sm text-red-500">{errorMessage}</p>
                          )}
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmittingPersonal}
                      className={cn("rounded-md disabled:opacity-50", ctaButton)}
                    >
                      {isSubmittingPersonal ? "Memperbarui..." : "Perbarui"}
                    </Button>

                    {/* Password Change Section */}
                    <div className="space-y-4">
                      <div
                        className={cn(
                          "pt-6",
                          isLight ? "border-t border-stone-300/80" : "border-t border-zinc-700"
                        )}
                      >
                        <h3 className={cn("mb-4 text-lg font-medium", textPrimary)}>
                          Ubah Password
                        </h3>
                        <PasswordChangeForm isLight={isLight} />
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "academic" && (
            <Card className={cn("transition-colors", cardBase)}>
              <CardHeader>
                <div>
                  <CardTitle className={cn("flex items-center gap-2", textPrimary)}>
                    <GraduationCap className="h-5 w-5" />
                    Data Akademik & Non Akademik
                  </CardTitle>
                  <CardDescription className={textSecondary}>
                    Informasi akademik & non akademik Anda
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...academicForm}>
                  <form
                    onSubmit={academicForm.handleSubmit(onSubmitAcademic)}
                    className="space-y-6"
                    onChange={() => {
                      resetAcademicForm();
                    }}
                  >
                    {/* IPK (GPA) Display - Readonly from transcript/GET */}
                    <div className="space-y-1">
                      <FormLabel className={textSecondary}>IPK</FormLabel>
                      {isLoadingAcademic ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Input
                          value={academicData?.gpa ?? "-"}
                          readOnly
                          className={cn("border", inputBase, "opacity-75")}
                        />
                      )}
                      {!(isLoadingTranscripts || isLoadingAcademic) && transcripts.length === 0 && (
                        <div className={cn("flex items-center gap-2 text-xs", textSecondary)}>
                          <AlertCircle
                            className={cn(
                              "h-3 w-3",
                              isLight ? "text-[#E36C3A]" : "text-yellow-400"
                            )}
                          />
                          <span>IPK akan muncul setelah Anda mengunggah transcript PDF.</span>
                        </div>
                      )}
                    </div>

                    {/* Transcript Management Section */}
                    <TranscriptManagement isLoading={isLoadingAcademic} isLight={isLight} />

                    {/* Interests Section - Multi Select Tags */}
                    <div className="space-y-4">
                      <FormLabel className={textSecondary}>Minat</FormLabel>

                      {/* Display existing interests as tags */}
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest, index) => (
                          <div
                            key={interest}
                            className={cn(
                              "flex items-center gap-1 rounded-full px-3 py-1 text-sm",
                              tagBase
                            )}
                          >
                            <span>{interest}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveInterest(index)}
                              className={cn(
                                "ml-1 rounded-full p-0.5",
                                isLight ? "hover:bg-[#DCC3A7]" : "hover:bg-zinc-700"
                              )}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Input for adding new interests */}
                      <div className="space-y-2">
                        <Input
                          placeholder="Ketik minat dan tekan Enter (contoh: Programming, AI, Design, dll.)"
                          value={interestInput}
                          onChange={(e) => setInterestInput(e.target.value)}
                          onKeyDown={handleAddInterest}
                          className={cn("border", inputBase)}
                        />
                        <p className={cn("text-xs", textSecondary)}>
                          Press Enter to add an interest. Click the X on tags to remove them.
                        </p>
                      </div>
                    </div>

                    {/* Skills Section - Multi Select Tags */}
                    <div className="space-y-4">
                      <FormLabel className={textSecondary}>Keterampilan</FormLabel>

                      {/* Display existing interests as tags */}
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <div
                            key={skill}
                            className={cn(
                              "flex items-center gap-1 rounded-full px-3 py-1 text-sm",
                              tagBase
                            )}
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(index)}
                              className={cn(
                                "ml-1 rounded-full p-0.5",
                                isLight ? "hover:bg-[#DCC3A7]" : "hover:bg-zinc-700"
                              )}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Input for adding new interests */}
                      <div className="space-y-2">
                        <Input
                          placeholder="Ketik keterampilan dan tekan Enter (contoh: Programming, Node JS, React JS, Design, dll.)"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleAddSkill}
                          className={cn("border", inputBase)}
                        />
                        <p className={cn("text-xs", textSecondary)}>
                          Press Enter to add an Skill. Click the X on tags to remove them.
                        </p>
                      </div>
                    </div>
                    {/* Achievements Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className={textSecondary}>Pencapaian</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendAchievement()}
                          className={cn("flex items-center gap-1 px-3 py-1", ctaButton)}
                        >
                          <Plus className="h-3 w-3" /> Tambah Pencapaian
                        </Button>
                      </div>

                      {achievementFields.length === 0 ? (
                        <div
                          className={cn(
                            "rounded-lg border border-dashed p-8 text-center",
                            dashedBorder
                          )}
                        >
                          <TypographyP className={textSecondary}>
                            Belum ada pencapaian yang ditambahkan. Klik tombol di atas untuk
                          </TypographyP>
                        </div>
                      ) : (
                        achievementFields.map((achieveField, index) => (
                          <div
                            key={achieveField.id}
                            className={cn(
                              "space-y-4 rounded-lg border p-4 transition-colors",
                              isLight
                                ? "border-stone-300 bg-white/90"
                                : "border-zinc-800 bg-zinc-900"
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <FormField
                                control={academicForm.control}
                                name={`achievements.${index}.title`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel className={textSecondary}>
                                      Judul Pencapaian
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Judul Pencapaian"
                                        {...field}
                                        className={cn("border", inputBase)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <FormField
                                  control={academicForm.control}
                                  name={`achievements.${index}.date`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className={textSecondary}>Tanggal</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="month"
                                          placeholder="YYYY-MM"
                                          value={formatDateToYearMonth(field.value)}
                                          onChange={(e) =>
                                            field.onChange(formatYearMonthToDate(e.target.value))
                                          }
                                          className={cn("w-48 border", inputBase)}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAchievementClick(index)}
                                  className={cn(
                                    "mt-6 h-8 w-8 p-0",
                                    isLight
                                      ? "text-[#7A6B5B] hover:bg-stone-200"
                                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                  )}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <FormField
                              control={academicForm.control}
                              name={`achievements.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={textSecondary}>Deskripsi</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Deskripsi Pencapaian"
                                      {...field}
                                      className={cn("min-h-[100px] resize-y border", inputBase)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {!academicForm.getValues(`achievements.${index}.fileUrl`) && (
                              <div className="mt-2">
                                <label
                                  htmlFor={`achievement-file-${index}`}
                                  className={cn(
                                    "block cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
                                    isLight
                                      ? "border-stone-300 bg-white/70 hover:border-stone-400 hover:bg-white"
                                      : "border-zinc-600 bg-zinc-800/60 hover:border-zinc-500 hover:bg-zinc-800"
                                  )}
                                >
                                  <Upload
                                    className={cn(
                                      "mx-auto h-5 w-5",
                                      isLight ? "text-[#7A6B5B]" : "text-zinc-400"
                                    )}
                                  />
                                  <p className={cn("mt-2 text-sm", textPrimary)}>
                                    Klik untuk unggah bukti
                                  </p>
                                  <p className={cn("text-xs", textSecondary)}>
                                    PDF atau Gambar (maks 2MB)
                                  </p>
                                </label>
                                <input
                                  id={`achievement-file-${index}`}
                                  type="file"
                                  accept=".pdf,image/*"
                                  onChange={(e) =>
                                    setAchievementFileAt(index, e.target.files?.[0] || null)
                                  }
                                  className="hidden"
                                />
                              </div>
                            )}
                            {academicForm.getValues(`achievements.${index}.fileUrl`) && (
                              <div
                                className={cn(
                                  "mt-2 flex items-center justify-between rounded-md border p-2",
                                  isLight
                                    ? "border-stone-300 bg-white/80"
                                    : "border-zinc-700 bg-zinc-800"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "h-10 w-10 overflow-hidden rounded",
                                      isLight ? "bg-[#F0E4D6]" : "bg-black"
                                    )}
                                  >
                                    {/* Thumbnail for images */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={
                                        academicForm.getValues(
                                          `achievements.${index}.fileUrl`
                                        ) as string
                                      }
                                      alt="preview"
                                      className="h-10 w-10 object-cover"
                                      onError={(e) => {
                                        // Hide thumbnail if not an image
                                        (e.currentTarget as HTMLImageElement).style.display =
                                          "none";
                                      }}
                                    />
                                  </div>
                                  <span className={cn("text-xs", textSecondary)}>
                                    File terunggah
                                  </span>
                                </div>
                                <a
                                  href={
                                    academicForm.getValues(
                                      `achievements.${index}.fileUrl`
                                    ) as string
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className={cn(
                                    "rounded-md px-3 py-1 text-xs transition-colors",
                                    isLight
                                      ? "bg-[#EED4BC] text-[#2F2A24] hover:bg-[#E3C7A5]"
                                      : "bg-zinc-700 text-white hover:bg-zinc-600"
                                  )}
                                >
                                  View
                                </a>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Experiences Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className={textSecondary}>Pengalaman</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendExperience()}
                          className={cn("flex items-center gap-1 px-3 py-1", ctaButton)}
                        >
                          <Plus className="h-3 w-3" /> Tambah Pengalaman
                        </Button>
                      </div>

                      {experienceFields.length === 0 ? (
                        <div
                          className={cn(
                            "rounded-lg border border-dashed p-8 text-center",
                            dashedBorder
                          )}
                        >
                          <TypographyP className={textSecondary}>
                            Belum ada pengalaman yang ditambahkan. Klik tombol di atas untuk
                          </TypographyP>
                        </div>
                      ) : (
                        experienceFields.map((experienceField, index) => (
                          <div
                            key={experienceField.id}
                            className={cn(
                              "space-y-4 rounded-lg border p-4 transition-colors",
                              isLight
                                ? "border-stone-300 bg-white/90"
                                : "border-zinc-800 bg-zinc-900"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.organization`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel className={textSecondary}>
                                      Organisasi / Perusahaan
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Nama Organisasi / Perusahaan"
                                        {...field}
                                        className={cn("border", inputBase)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExperienceClick(index)}
                                className={cn(
                                  "mt-6 h-8 w-8 p-0",
                                  isLight
                                    ? "text-[#7A6B5B] hover:bg-stone-200"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                )}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.position`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className={textSecondary}>Posisi</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Posisi"
                                        {...field}
                                        className={cn("border", inputBase)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className={textSecondary}>Tanggal Mulai</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="month"
                                        placeholder="YYYY-MM"
                                        value={formatDateToYearMonth(field.value)}
                                        onChange={(e) =>
                                          field.onChange(formatYearMonthToDate(e.target.value))
                                        }
                                        className={cn("border", inputBase)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className={textSecondary}>
                                      Tanggal Selesai (Opsional)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="month"
                                        placeholder="YYYY-MM"
                                        value={formatDateToYearMonth(field.value || "")}
                                        onChange={(e) =>
                                          field.onChange(
                                            e.target.value
                                              ? formatYearMonthToDate(e.target.value)
                                              : ""
                                          )
                                        }
                                        className={cn("border", inputBase)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={academicForm.control}
                              name={`experiences.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={textSecondary}>Deskripsi</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Deskripsi Pengalaman"
                                      {...field}
                                      className={cn("min-h-[100px] resize-y border", inputBase)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {!academicForm.getValues(`experiences.${index}.fileUrl`) && (
                              <div className="mt-2">
                                <label
                                  htmlFor={`experience-file-${index}`}
                                  className={cn(
                                    "block cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
                                    isLight
                                      ? "border-stone-300 bg-white/70 hover:border-stone-400 hover:bg-white"
                                      : "border-zinc-600 bg-zinc-800/60 hover:border-zinc-500 hover:bg-zinc-800"
                                  )}
                                >
                                  <Upload
                                    className={cn(
                                      "mx-auto h-5 w-5",
                                      isLight ? "text-[#7A6B5B]" : "text-zinc-400"
                                    )}
                                  />
                                  <p className={cn("mt-2 text-sm", textPrimary)}>
                                    Klik untuk unggah bukti
                                  </p>
                                  <p className={cn("text-xs", textSecondary)}>
                                    PDF atau Gambar (maks 2MB)
                                  </p>
                                </label>
                                <input
                                  id={`experience-file-${index}`}
                                  type="file"
                                  accept=".pdf,image/*"
                                  onChange={(e) =>
                                    setExperienceFileAt(index, e.target.files?.[0] || null)
                                  }
                                  className="hidden"
                                />
                              </div>
                            )}

                            {academicForm.getValues(`experiences.${index}.fileUrl`) && (
                              <div
                                className={cn(
                                  "mt-2 flex items-center justify-between rounded-md border p-2",
                                  isLight
                                    ? "border-stone-300 bg-white/80"
                                    : "border-zinc-700 bg-zinc-800"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "h-10 w-10 overflow-hidden rounded",
                                      isLight ? "bg-[#F0E4D6]" : "bg-black"
                                    )}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={
                                        academicForm.getValues(
                                          `experiences.${index}.fileUrl`
                                        ) as string
                                      }
                                      alt="preview"
                                      className="h-10 w-10 object-cover"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display =
                                          "none";
                                      }}
                                    />
                                  </div>
                                  <span className={cn("text-xs", textSecondary)}>
                                    File terunggah
                                  </span>
                                </div>
                                <a
                                  href={
                                    academicForm.getValues(`experiences.${index}.fileUrl`) as string
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className={cn(
                                    "rounded-md px-3 py-1 text-xs transition-colors",
                                    isLight
                                      ? "bg-[#EED4BC] text-[#2F2A24] hover:bg-[#E3C7A5]"
                                      : "bg-zinc-700 text-white hover:bg-zinc-600"
                                  )}
                                >
                                  View
                                </a>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {academicErrorMessage && (
                      <p className="mt-2 ml-2 text-sm text-red-500">{academicErrorMessage}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmittingAcademic}
                      className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
                    >
                      {isSubmittingAcademic ? "Memperbarui..." : "Perbarui "}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
