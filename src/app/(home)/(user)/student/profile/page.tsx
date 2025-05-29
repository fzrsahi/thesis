"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Plus, X, Upload, FileText, User, GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const personalDataSchema = z.object({
  name: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  nim: z.string().min(5, { message: "NIM tidak valid" }),
});

const academicDataSchema = z.object({
  gpa: z.string().optional(),
  interests: z.array(z.object({ value: z.string() })).optional(),
  organizations: z.array(z.object({ name: z.string() })).optional(),
  achievements: z.array(z.object({ title: z.string() })).optional(),
});

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"personal" | "academic">("personal");
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

  const personalForm = useForm<z.infer<typeof personalDataSchema>>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      nim: "",
    },
  });

  const academicForm = useForm<z.infer<typeof academicDataSchema>>({
    resolver: zodResolver(academicDataSchema),
    defaultValues: {
      gpa: "",
      interests: [{ value: "" }],
      organizations: [{ name: "" }],
      achievements: [{ title: "" }],
    },
  });

  const {
    fields: interestFields,
    append: appendInterest,
    remove: removeInterest,
  } = useFieldArray({
    control: academicForm.control,
    name: "interests",
  });

  const {
    fields: organizationFields,
    append: appendOrganization,
    remove: removeOrganization,
  } = useFieldArray({
    control: academicForm.control,
    name: "organizations",
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control: academicForm.control,
    name: "achievements",
  });

  const onSubmitPersonal = () => {
    toast("Data pribadi berhasil diperbarui", {
      description: "Informasi pribadi Anda telah disimpan",
    });
    setIsEditingPersonal(false);
  };

  const onSubmitAcademic = () => {
    toast("Data akademik berhasil diperbarui", {
      description: "Informasi akademik Anda telah disimpan",
    });
    setIsEditingAcademic(false);
  };

  const handleTranscriptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("image/")) {
        setTranscriptFile(file);
        toast("File transkrip berhasil dipilih", {
          description: `File ${file.name} siap untuk diupload`,
        });
      } else {
        toast("Format file tidak didukung", {
          description: "Silakan pilih file PDF atau gambar",
        });
      }
    }
  };

  const uploadTranscript = () => {
    if (transcriptFile) {
      // Simulasi upload
      toast("Transkrip berhasil diupload", {
        description: "File transkrip nilai telah disimpan",
      });
      setTranscriptFile(null);
    }
  };

  const tabs = [
    {
      id: "personal" as const,
      label: "Data Pribadi",
      icon: User,
      description: "Informasi data pribadi Anda",
    },
    {
      id: "academic" as const,
      label: "Data Akademik",
      icon: GraduationCap,
      description: "Informasi akademik dan prestasi Anda",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Profil Pengguna</h1>
          <p className="text-zinc-400">Kelola informasi pribadi dan akademik Anda</p>
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
        {/* Profile Picture Card */}
        <Card className="border-zinc-800 bg-zinc-900 text-white lg:col-span-1">
          <CardHeader>
            <CardTitle>Foto Profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
              <AvatarFallback className="bg-zinc-800 text-2xl">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {(isEditingPersonal || isEditingAcademic) && (
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white text-black hover:bg-zinc-200"
              >
                Ubah Foto
              </Button>
            )}
          </CardContent>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-medium">Informasi Akun</h3>
              <Separator className="bg-zinc-800" />
              <div className="text-sm">
                <p className="text-zinc-400">Status</p>
                <p>Mahasiswa Aktif</p>
              </div>
              <div className="text-sm">
                <p className="text-zinc-400">Bergabung Sejak</p>
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
                    Data Pribadi
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Informasi data pribadi Anda
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {isEditingPersonal ? "Batal" : "Edit"}
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
                            <FormLabel className="text-zinc-300">Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nama lengkap"
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
                        name="nim"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">NIM</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nomor Induk Mahasiswa"
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
                        Simpan Data Pribadi
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
                    Data Akademik
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Informasi akademik dan prestasi Anda
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditingAcademic(!isEditingAcademic)}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {isEditingAcademic ? "Batal" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                <Form {...academicForm}>
                  <form
                    onSubmit={academicForm.handleSubmit(onSubmitAcademic)}
                    className="space-y-6"
                  >
                    {/* IPK Section */}
                    <FormField
                      control={academicForm.control}
                      name="gpa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">IPK</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="IPK"
                              {...field}
                              readOnly={!isEditingAcademic}
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Transcript Upload Section */}
                    <div className="space-y-4">
                      <FormLabel className="text-zinc-300">Transkrip Nilai</FormLabel>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={handleTranscriptUpload}
                            className="hidden"
                            id="transcript-upload"
                            disabled={!isEditingAcademic}
                          />
                          <label
                            htmlFor="transcript-upload"
                            className={`flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white transition-colors hover:bg-zinc-700 ${
                              !isEditingAcademic ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            <Upload className="h-4 w-4" />
                            Pilih File
                          </label>
                          {transcriptFile && (
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <FileText className="h-4 w-4" />
                              {transcriptFile.name}
                            </div>
                          )}
                        </div>
                        {transcriptFile && isEditingAcademic && (
                          <Button
                            type="button"
                            onClick={uploadTranscript}
                            variant="outline"
                            className="w-fit bg-white text-black hover:bg-zinc-200"
                          >
                            Upload Transkrip
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Interests Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Minat</FormLabel>
                        {isEditingAcademic && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendInterest({ value: "" })}
                            className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                          >
                            <Plus className="h-3 w-3" /> Tambah Minat
                          </Button>
                        )}
                      </div>

                      {interestFields.map((interestField, index) => (
                        <div key={interestField.id} className="flex items-center gap-2">
                          <FormField
                            control={academicForm.control}
                            name={`interests.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Contoh: AI, Coding, Design"
                                    {...field}
                                    readOnly={!isEditingAcademic}
                                    className="border-zinc-700 bg-zinc-800 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {isEditingAcademic && index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInterest(index)}
                              className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Organizations Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Organisasi</FormLabel>
                        {isEditingAcademic && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendOrganization({ name: "" })}
                            className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                          >
                            <Plus className="h-3 w-3" /> Tambah Organisasi
                          </Button>
                        )}
                      </div>

                      {organizationFields.map((orgField, index) => (
                        <div key={orgField.id} className="flex items-center gap-2">
                          <FormField
                            control={academicForm.control}
                            name={`organizations.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Nama organisasi"
                                    {...field}
                                    readOnly={!isEditingAcademic}
                                    className="border-zinc-700 bg-zinc-800 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {isEditingAcademic && index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOrganization(index)}
                              className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Achievements Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-zinc-300">Pencapaian</FormLabel>
                        {isEditingAcademic && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendAchievement({ title: "" })}
                            className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
                          >
                            <Plus className="h-3 w-3" /> Tambah Pencapaian
                          </Button>
                        )}
                      </div>

                      {achievementFields.map((achieveField, index) => (
                        <div key={achieveField.id} className="flex items-center gap-2">
                          <FormField
                            control={academicForm.control}
                            name={`achievements.${index}.title`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Judul pencapaian"
                                    {...field}
                                    readOnly={!isEditingAcademic}
                                    className="border-zinc-700 bg-zinc-800 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {isEditingAcademic && index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                              className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {isEditingAcademic && (
                      <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
                        Simpan Data Akademik
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
