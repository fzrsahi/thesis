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
      label: "Personal Data",
      icon: User,
      description: "Your personal information",
    },
    {
      id: "academic" as const,
      label: "Academic Data",
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
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
          <p className="text-zinc-400">Manage your personal and academic information</p>
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
                <p className="text-zinc-400">Major</p>
                <p>Informatics Engineering</p>
              </div>
              <div className="text-sm">
                <p className="text-zinc-400">Faculty</p>
                <p>Engineering</p>
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
                    Personal Data
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your personal information
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
                            <FormLabel className="text-zinc-300">Full Name</FormLabel>
                            <FormControl>
                              {isLoadingPersonal ? (
                                <Skeleton className="h-10 w-full" />
                              ) : (
                                <Input
                                  placeholder="Full name"
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
                            <FormLabel className="text-zinc-300">Student ID</FormLabel>
                            <FormControl>
                              {isLoadingPersonal ? (
                                <Skeleton className="h-10 w-full" />
                              ) : (
                                <Input
                                  placeholder="Student identification number"
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
                      {isSubmittingPersonal ? "Updating..." : "Update Personal Data"}
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
                    Academic Data
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your academic information and achievements
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
                          <FormLabel className="text-zinc-300">GPA</FormLabel>
                          <FormControl>
                            {isLoadingAcademic ? (
                              <Skeleton className="h-10 w-full" />
                            ) : (
                              <Input
                                placeholder="GPA"
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
                      <FormLabel className="text-zinc-300">Interests</FormLabel>

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
                          placeholder="Type an interest and press Enter (e.g., Programming, AI, Design)"
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
                      <FormLabel className="text-zinc-300">Skills</FormLabel>

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
                          placeholder="Type an skill and press Enter (e.g., Programming, Node JS, React JS, Design, etc.)"
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
                        <FormLabel className="text-zinc-300">Achievements</FormLabel>
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
                          <Plus className="h-3 w-3" /> Add Achievement
                        </Button>
                      </div>

                      {isLoadingAcademic ? (
                        <div className="space-y-4">
                          <div className="rounded-lg border border-zinc-700 p-4">
                            <Skeleton className="h-10 w-full" />
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Skeleton className="h-10 w-full" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        achievementFields.map((achieveField, index) => (
                          <div
                            key={achieveField.id}
                            className="space-y-2 rounded-lg border border-zinc-700 p-4"
                          >
                            <div className="flex items-center gap-2">
                              <FormField
                                control={academicForm.control}
                                name={`achievements.${index}.title`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel className="text-zinc-300">
                                      Achievement Title
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Achievement title"
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
                                onClick={() => handleDeleteAchievementClick(index)}
                                className="mt-6 h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <FormField
                                control={academicForm.control}
                                name={`achievements.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-300">Description</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Achievement description"
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
                                name={`achievements.${index}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-300">
                                      Date (Year-Month)
                                    </FormLabel>
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
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Experiences Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Experiences</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendExperience({
                              organization: "",
                              position: "",
                              startDate: "",
                              endDate: "",
                              description: "",
                            })
                          }
                          className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                        >
                          <Plus className="h-3 w-3" /> Add Experience
                        </Button>
                      </div>

                      {isLoadingAcademic ? (
                        <div className="space-y-4">
                          <div className="rounded-lg border border-zinc-700 p-4">
                            <Skeleton className="h-10 w-full" />
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Skeleton className="h-10 w-full" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Skeleton className="h-10 w-full" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="mt-4">
                              <Skeleton className="h-10 w-full" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        experienceFields.map((experienceField, index) => (
                          <div
                            key={experienceField.id}
                            className="space-y-2 rounded-lg border border-zinc-700 p-4"
                          >
                            <div className="flex items-center gap-2">
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.organization`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel className="text-zinc-300">Organization</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Organization name"
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.position`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-300">Position</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Position"
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
                                    <FormLabel className="text-zinc-300">
                                      Start Date (Year-Month)
                                    </FormLabel>
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
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-300">
                                      End Date (Year-Month)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="month"
                                        placeholder="YYYY-MM (Optional)"
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
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-300">Description</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Experience description"
                                        {...field}
                                        className="border-zinc-700 bg-zinc-800 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
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
                      {isSubmittingAcademic ? "Updating..." : "Update Academic Data"}
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
