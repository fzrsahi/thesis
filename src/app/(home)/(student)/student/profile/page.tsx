"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { Plus, X, User, GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

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

import TranscriptManagement from "./_components/TranscriptManagement";
import { useAcademicData } from "./_hooks/useAcademicData";
import { useAcademicDataForm } from "./_hooks/useAcademicDataForm";
import { usePersonalData } from "./_hooks/usePersonalData";
import { usePersonalDataForm } from "./_hooks/usePersonalDataForm";

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"personal" | "academic">("personal");

  const {
    data: personalData,
    isLoading: isLoadingPersonal,
    error: personalError,
  } = usePersonalData();

  const { data: academicData, isLoading: isLoadingAcademic } = useAcademicData();

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
      description: "Your personal information",
    },
    {
      id: "academic" as const,
      label: "Data Prestasi",
      icon: GraduationCap,
      description: "Your academic information and achievements",
    },
  ];

  if (personalError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-400">Error loading profile data</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Profil Mahasiswa</h1>
          <p className="text-zinc-400">Mengelola informasi pribadi dan akademik Anda</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-zinc-800 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
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
        <DialogContent className="border-zinc-800 bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Delete Achievement</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this achievement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {achievementToDelete && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
              <p className="text-sm font-medium text-white">{achievementToDelete.title}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelDeleteAchievement}
              className="text-zinc-400 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDeleteAchievement}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Experience Confirmation Dialog */}
      <Dialog open={isDeleteExperienceDialogOpen} onOpenChange={setIsDeleteExperienceDialogOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this experience? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {experienceToDelete && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
              <p className="text-sm font-medium text-white">{experienceToDelete.organization}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelDeleteExperience}
              className="text-zinc-400 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDeleteExperience}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Profile Info Card */}
        <Card className="border-zinc-800 bg-zinc-900 text-white lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Info</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="bg-zinc-800 text-2xl">
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
              <Separator className="bg-zinc-800" />
              <div className="text-sm">
                <p className="text-zinc-400">Program Studi</p>
                <p>{session?.user?.studyProgram?.name ?? "-"}</p>
              </div>
              <div className="text-sm">
                <p className="text-zinc-400">Angkatan</p>
                <p>{session?.user?.entryYear ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8 lg:col-span-3">
          {activeTab === "personal" && (
            <Card className="border-zinc-800 bg-zinc-900 text-white">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Data Pribadi
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
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
                            <FormLabel className="text-zinc-300">Nama Lengkap</FormLabel>
                            <FormControl>
                              {isLoadingPersonal ? (
                                <Skeleton className="h-10 w-full" />
                              ) : (
                                <Input
                                  placeholder="Nama Lengkap"
                                  {...field}
                                  className="border-zinc-700 bg-zinc-800 text-white"
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
                            <FormLabel className="text-zinc-300">NIM</FormLabel>
                            <FormControl>
                              {isLoadingPersonal ? (
                                <Skeleton className="h-10 w-full" />
                              ) : (
                                <Input
                                  placeholder="NIM"
                                  {...field}
                                  className="border-zinc-700 bg-zinc-800 text-white"
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
                          <FormLabel className="text-zinc-300">Email</FormLabel>
                          <FormControl>
                            {isLoadingPersonal ? (
                              <Skeleton className="h-10 w-full" />
                            ) : (
                              <Input
                                placeholder="Email"
                                {...field}
                                readOnly
                                className="border-zinc-700 bg-zinc-800 text-white"
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
                      className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
                    >
                      {isSubmittingPersonal ? "Memperbarui..." : "Perbarui"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "academic" && (
            <Card className="border-zinc-800 bg-zinc-900 text-white">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Data Akademik & Non Akademik
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
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
                    {/* GPA Section */}
                    <FormField
                      control={academicForm.control}
                      name="gpa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">IPK</FormLabel>
                          <FormControl>
                            {isLoadingAcademic ? (
                              <Skeleton className="h-10 w-full" />
                            ) : (
                              <Input
                                placeholder="IPK"
                                {...field}
                                className="border-zinc-700 bg-zinc-800 text-white"
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Transcript Management Section */}
                    <TranscriptManagement isLoading={isLoadingAcademic} />

                    {/* Interests Section - Multi Select Tags */}
                    <div className="space-y-4">
                      <FormLabel className="text-zinc-300">Minat</FormLabel>

                      {/* Display existing interests as tags */}
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest, index) => (
                          <div
                            key={interest}
                            className="flex items-center gap-1 rounded-full bg-zinc-600 px-3 py-1 text-sm text-white"
                          >
                            <span>{interest}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveInterest(index)}
                              className="ml-1 rounded-full p-0.5 hover:bg-zinc-700"
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
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                        <p className="text-xs text-zinc-400">
                          Press Enter to add an interest. Click the X on tags to remove them.
                        </p>
                      </div>
                    </div>

                    {/* Skills Section - Multi Select Tags */}
                    <div className="space-y-4">
                      <FormLabel className="text-zinc-300">Keterampilan</FormLabel>

                      {/* Display existing interests as tags */}
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <div
                            key={skill}
                            className="flex items-center gap-1 rounded-full bg-zinc-600 px-3 py-1 text-sm text-white"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(index)}
                              className="ml-1 rounded-full p-0.5 hover:bg-zinc-700"
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
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                        <p className="text-xs text-zinc-400">
                          Press Enter to add an Skill. Click the X on tags to remove them.
                        </p>
                      </div>
                    </div>
                    {/* Achievements Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Pencapaian</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendAchievement({
                              title: "",
                              description: "",
                              date: "",
                            })
                          }
                          className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                        >
                          <Plus className="h-3 w-3" /> Tambah Pencapaian
                        </Button>
                      </div>

                      {achievementFields.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center">
                          <TypographyP className="text-zinc-400">
                            Belum ada pencapaian yang ditambahkan. Klik tombol di atas untuk
                          </TypographyP>
                        </div>
                      ) : (
                        achievementFields.map((achieveField, index) => (
                          <div
                            key={achieveField.id}
                            className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <FormField
                                control={academicForm.control}
                                name={`achievements.${index}.title`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel className="text-zinc-300">
                                      Judul Pencapaian
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Judul Pencapaian"
                                        {...field}
                                        className="border-zinc-700 bg-zinc-800 text-white"
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
                                      <FormLabel className="text-zinc-300">Tanggal</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="month"
                                          placeholder="YYYY-MM"
                                          value={formatDateToYearMonth(field.value)}
                                          onChange={(e) =>
                                            field.onChange(formatYearMonthToDate(e.target.value))
                                          }
                                          className="w-48 border-zinc-700 bg-zinc-800 text-white"
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
                                  className="mt-6 h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
                                  <FormLabel className="text-zinc-300">Deskripsi</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Deskripsi Pencapaian"
                                      {...field}
                                      className="min-h-[100px] resize-y border-zinc-700 bg-zinc-800 text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))
                      )}
                    </div>

                    {/* Experiences Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Pengalaman</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendExperience({
                              organization: "",
                              position: "",
                              description: "",
                              startDate: "",
                              endDate: "",
                            })
                          }
                          className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                        >
                          <Plus className="h-3 w-3" /> Tambah Pengalaman
                        </Button>
                      </div>

                      {experienceFields.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center">
                          <TypographyP className="text-zinc-400">
                            Belum ada pengalaman yang ditambahkan. Klik tombol di atas untuk
                          </TypographyP>
                        </div>
                      ) : (
                        experienceFields.map((experienceField, index) => (
                          <div
                            key={experienceField.id}
                            className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.organization`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel className="text-zinc-300">
                                      Organisasi / Perusahaan
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Nama Organisasi / Perusahaan"
                                        {...field}
                                        className="border-zinc-700 bg-zinc-800 text-white"
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
                                className="mt-6 h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
                                    <FormLabel className="text-zinc-300">Posisi</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Posisi"
                                        {...field}
                                        className="border-zinc-700 bg-zinc-800 text-white"
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
                                    <FormLabel className="text-zinc-300">Tanggal Mulai</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="month"
                                        placeholder="YYYY-MM"
                                        value={formatDateToYearMonth(field.value)}
                                        onChange={(e) =>
                                          field.onChange(formatYearMonthToDate(e.target.value))
                                        }
                                        className="border-zinc-700 bg-zinc-800 text-white"
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
                                    <FormLabel className="text-zinc-300">
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
                                        className="border-zinc-700 bg-zinc-800 text-white"
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
                                  <FormLabel className="text-zinc-300">Deskripsi</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Deskripsi Pengalaman"
                                      {...field}
                                      className="min-h-[100px] resize-y border-zinc-700 bg-zinc-800 text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
