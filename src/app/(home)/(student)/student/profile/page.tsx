/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { Plus, X, User, GraduationCap, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

import { useAcademicData, useAcademicForm } from "./_api/useAcademicData";
import { usePersonalData, usePersonalForm } from "./_api/usePersonalData";

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"personal" | "academic">("personal");
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [transcriptPreview, setTranscriptPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: personalData,
    isLoading: isLoadingPersonal,
    error: personalError,
  } = usePersonalData();

  const { data: academicData, isLoading: isLoadingAcademic } = useAcademicData();

  const personalForm = usePersonalForm();
  const academicForm = useAcademicForm();
  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control: academicForm.control,
    name: "achievements",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: academicForm.control,
    name: "experiences",
  });

  useEffect(() => {
    if (personalData) {
      personalForm.reset({
        name: personalData.name || "",
        student_id: personalData.student_id || "",
        email: personalData.email || "",
      });
    }
  }, [personalData, personalForm]);

  useEffect(() => {
    if (academicData) {
      academicForm.reset({
        gpa: academicData.gpa || "",
        transcript_url: academicData.transcript_url || "",
        interests: academicData.interests || [],
        achievements: academicData.achievements || [],
        experiences: academicData.experiences || [],
      });
      setInterests(academicData.interests || []);
      setTranscriptPreview(academicData.transcript_url || "");
    }
  }, [academicData, academicForm]);

  const handleAddInterest = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && interestInput.trim()) {
      e.preventDefault();
      const newInterest = interestInput.trim();

      if (!interests.includes(newInterest)) {
        setInterests([...interests, newInterest]);
        setInterestInput("");
      }
    }
  };

  const handleRemoveInterest = (indexToRemove: number) => {
    const updatedInterests = interests.filter((_, index) => index !== indexToRemove);
    setInterests(updatedInterests);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload a PDF",
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File too large", {
          description: "Please upload a file smaller than 5MB",
        });
        return;
      }

      setTranscriptFile(file);
      setTranscriptPreview(file.name);
      toast.success("File selected", {
        description: `${file.name} is ready to upload`,
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setTranscriptFile(null);
    setTranscriptPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmitPersonal = () => {
    toast("Personal data updated successfully", {
      description: "Your personal information has been saved",
    });
    setIsEditingPersonal(false);
  };

  const onSubmitAcademic = () => {
    // Here you would handle the file upload to your server
    if (transcriptFile) {
      // Upload logic would go here
    }

    toast("Academic data updated successfully", {
      description: "Your academic information has been saved",
    });
    setIsEditingAcademic(false);
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
              <h3 className="font-medium">Account Information</h3>
              <Separator className="bg-zinc-800" />
              <div className="text-sm">
                <p className="text-zinc-400">Name</p>
                {isLoadingPersonal ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <p>{personalData?.name || "Not provided"}</p>
                )}
              </div>
              <div className="text-sm">
                <p className="text-zinc-400">Student ID</p>
                {isLoadingPersonal ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <p>{personalData?.student_id || "Not provided"}</p>
                )}
              </div>
              <div className="text-sm">
                <p className="text-zinc-400">Status</p>
                <p>Active Student</p>
              </div>
              <div className="text-sm">
                <p className="text-zinc-400">Member Since</p>
                <p>September 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8 lg:col-span-3">
          {activeTab === "personal" && (
            <Card className="border-zinc-800 bg-zinc-900 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Data
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your personal information
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {isEditingPersonal ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                <Form {...personalForm}>
                  <form
                    onSubmit={personalForm.handleSubmit(onSubmitPersonal)}
                    className="space-y-6"
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
                                  readOnly={!isEditingPersonal}
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
                                  readOnly={!isEditingPersonal}
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
                        </FormItem>
                      )}
                    />

                    {isEditingPersonal && (
                      <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
                        Save Personal Data
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "academic" && (
            <Card className="border-zinc-800 bg-zinc-900 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Data
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your academic information and achievements
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditingAcademic(!isEditingAcademic)}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {isEditingAcademic ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                <Form {...academicForm}>
                  <form
                    onSubmit={academicForm.handleSubmit(onSubmitAcademic)}
                    className="space-y-6"
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
                                readOnly={!isEditingAcademic}
                                className="border-zinc-700 bg-zinc-800 text-white"
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Transcript Upload Section */}
                    <div className="space-y-4">
                      <FormLabel className="text-zinc-300">Transcript</FormLabel>

                      {isLoadingAcademic ? (
                        <Skeleton className="h-32 w-full" />
                      ) : (
                        <div className="space-y-4">
                          {/* Current transcript display */}
                          {transcriptPreview && !transcriptFile && (
                            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="rounded bg-zinc-600 p-2">
                                    <Upload className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white">
                                      Current Transcript
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                      {transcriptPreview.includes("http")
                                        ? "Uploaded file"
                                        : transcriptPreview}
                                    </p>
                                  </div>
                                </div>
                                {transcriptPreview.includes("http") && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(transcriptPreview, "_blank")}
                                    className="bg-zinc-700 text-white hover:bg-zinc-600"
                                  >
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* File upload area */}
                          {isEditingAcademic && (
                            <div className="space-y-4">
                              {/* Selected file preview */}
                              {transcriptFile && (
                                <div className="rounded-lg border border-green-600 bg-green-900/20 p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="rounded bg-green-600 p-2">
                                        <Upload className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-white">
                                          Selected File
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                          {transcriptFile.name}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                          {(transcriptFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleRemoveFile}
                                      className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Upload button */}
                              <div
                                onClick={handleUploadClick}
                                className="cursor-pointer rounded-lg border-2 border-dashed border-zinc-600 bg-zinc-800/50 p-8 text-center transition-colors hover:border-zinc-500 hover:bg-zinc-800"
                              >
                                <Upload className="mx-auto h-8 w-8 text-zinc-400" />
                                <p className="mt-2 text-sm font-medium text-white">
                                  {transcriptFile ? "Change transcript file" : "Upload transcript"}
                                </p>
                                <p className="mt-1 text-xs text-zinc-400">
                                  PDF, JPEG, PNG up to 5MB
                                </p>
                              </div>

                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Interests Section - Multi Select Tags */}
                    <div className="space-y-4">
                      <FormLabel className="text-zinc-300">Interests</FormLabel>

                      {/* Display existing interests as tags */}
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <div
                            key={interest}
                            className="flex items-center gap-1 rounded-full bg-zinc-600 px-3 py-1 text-sm text-white"
                          >
                            <span>{interest}</span>
                            {isEditingAcademic && (
                              <button
                                type="button"
                                onClick={() => handleRemoveInterest(interests.indexOf(interest))}
                                className="ml-1 rounded-full p-0.5 hover:bg-zinc-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Input for adding new interests */}
                      {isEditingAcademic && (
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
                      )}
                    </div>

                    {/* Achievements Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Achievements</FormLabel>
                        {isEditingAcademic && (
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
                        )}
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
                                        readOnly={!isEditingAcademic}
                                        className="border-zinc-700 bg-zinc-800 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {isEditingAcademic && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAchievement(index)}
                                  className="mt-6 h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
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
                                        readOnly={!isEditingAcademic}
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
                                    <FormLabel className="text-zinc-300">Date</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Achievement date"
                                        {...field}
                                        readOnly={!isEditingAcademic}
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
                        {isEditingAcademic && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              appendExperience({
                                organization: "",
                                position: "",
                                start_date: "",
                                end_date: "",
                                description: "",
                              })
                            }
                            className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                          >
                            <Plus className="h-3 w-3" /> Add Experience
                          </Button>
                        )}
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
                                        readOnly={!isEditingAcademic}
                                        className="border-zinc-700 bg-zinc-800 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {isEditingAcademic && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(index)}
                                  className="mt-6 h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
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
                                        readOnly={!isEditingAcademic}
                                        className="border-zinc-700 bg-zinc-800 text-white"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={academicForm.control}
                                name={`experiences.${index}.start_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-300">Start Date</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Start date"
                                        {...field}
                                        readOnly={!isEditingAcademic}
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
                                name={`experiences.${index}.end_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-300">End Date</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="End date"
                                        {...field}
                                        readOnly={!isEditingAcademic}
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
                                        readOnly={!isEditingAcademic}
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

                    {isEditingAcademic && (
                      <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
                        Save Academic Data
                      </Button>
                    )}
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
