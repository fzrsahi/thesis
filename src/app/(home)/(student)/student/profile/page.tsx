"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { Plus, X, User, GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";

import { usePersonalData, usePersonalForm, useAcademicForm } from "./_api/usePersonalData";

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"personal" | "academic">("personal");
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);

  const {
    data: personalData,
    isLoading: isLoadingPersonal,
    error: personalError,
  } = usePersonalData();

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
    fields: membershipFields,
    append: appendMembership,
    remove: removeMembership,
  } = useFieldArray({
    control: academicForm.control,
    name: "memberships",
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

  const onSubmitPersonal = () => {
    toast("Personal data updated successfully", {
      description: "Your personal information has been saved",
    });
    setIsEditingPersonal(false);
  };

  const onSubmitAcademic = () => {
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

  if (isLoadingPersonal) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
                  "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
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
                {personalData?.name?.charAt(0) || session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </CardContent>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-medium">Account Information</h3>
              <Separator className="bg-zinc-800" />
              <div className="text-sm">
                <p className="text-zinc-400">Name</p>
                <p>{personalData?.name || "Not provided"}</p>
              </div>
              <div className="text-sm">
                <p className="text-zinc-400">Student ID</p>
                <p>{personalData?.student_id || "Not provided"}</p>
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
                              <Input
                                placeholder="Full name"
                                {...field}
                                readOnly={!isEditingPersonal}
                                className="border-zinc-700 bg-zinc-800 text-white"
                              />
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
                              <Input
                                placeholder="Student identification number"
                                {...field}
                                readOnly={!isEditingPersonal}
                                className="border-zinc-700 bg-zinc-800 text-white"
                              />
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
                            <Input
                              placeholder="Email"
                              {...field}
                              readOnly
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
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
                            <Input
                              placeholder="GPA"
                              {...field}
                              readOnly={!isEditingAcademic}
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Transcript URL Section */}
                    <FormField
                      control={academicForm.control}
                      name="transcript_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Transcript URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Transcript URL"
                              {...field}
                              readOnly={!isEditingAcademic}
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                      {achievementFields.map((achieveField, index) => (
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
                                  <FormLabel className="text-zinc-300">Achievement Title</FormLabel>
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
                      ))}
                    </div>

                    {/* Memberships Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Memberships</FormLabel>
                        {isEditingAcademic && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              appendMembership({
                                organization: "",
                                position: "",
                                start_date: "",
                                end_date: "",
                              })
                            }
                            className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                          >
                            <Plus className="h-3 w-3" /> Add Membership
                          </Button>
                        )}
                      </div>

                      {membershipFields.map((membershipField, index) => (
                        <div
                          key={membershipField.id}
                          className="space-y-2 rounded-lg border border-zinc-700 p-4"
                        >
                          <div className="flex items-center gap-2">
                            <FormField
                              control={academicForm.control}
                              name={`memberships.${index}.organization`}
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
                                onClick={() => removeMembership(index)}
                                className="mt-6 h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <FormField
                              control={academicForm.control}
                              name={`memberships.${index}.position`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-300">Position</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Position/Role"
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
                              name={`memberships.${index}.start_date`}
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
                            <FormField
                              control={academicForm.control}
                              name={`memberships.${index}.end_date`}
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
                          </div>
                        </div>
                      ))}
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
