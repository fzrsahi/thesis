"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Plus, X } from "lucide-react";
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

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  nim: z.string().min(5, { message: "NIM tidak valid" }),
  gpa: z.string().optional(),
  interests: z.array(z.object({ value: z.string() })).optional(),
  organizations: z.array(z.object({ name: z.string() })).optional(),
  achievements: z.array(z.object({ title: z.string() })).optional(),
});

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      nim: "",
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
    control: form.control,
    name: "interests",
  });

  const {
    fields: organizationFields,
    append: appendOrganization,
    remove: removeOrganization,
  } = useFieldArray({
    control: form.control,
    name: "organizations",
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const onSubmit = () => {
    toast("Profil berhasil diperbarui", {
      description: "Data diri Anda telah disimpan",
    });
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <Card className="border-zinc-800 bg-zinc-900 text-white md:col-span-1">
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
          {isEditing && (
            <Button variant="outline" className="w-full bg-white text-black hover:bg-zinc-200">
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

      <Card className="border-zinc-800 bg-zinc-900 text-white md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Diri</CardTitle>
            <CardDescription className="text-zinc-400">
              Informasi data diri Anda yang tersimpan dalam sistem
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-black hover:bg-zinc-200"
          >
            {isEditing ? "Batal" : "Edit Profil"}
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nama lengkap"
                          {...field}
                          readOnly={!isEditing}
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                <FormField
                  control={form.control}
                  name="nim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">NIM</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nomor Induk Mahasiswa"
                          {...field}
                          readOnly={!isEditing}
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">IPK</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="IPK"
                          {...field}
                          readOnly={!isEditing}
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-zinc-300">Minat</FormLabel>
                  {isEditing && (
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
                      control={form.control}
                      name={`interests.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Contoh: AI, Coding, Design"
                              {...field}
                              readOnly={!isEditing}
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditing && index > 0 && (
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-zinc-300">Organisasi</FormLabel>
                  {isEditing && (
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
                      control={form.control}
                      name={`organizations.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Nama organisasi"
                              {...field}
                              readOnly={!isEditing}
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditing && index > 0 && (
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-zinc-300">Pencapaian</FormLabel>
                  {isEditing && (
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
                      control={form.control}
                      name={`achievements.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Judul pencapaian"
                              {...field}
                              readOnly={!isEditing}
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditing && index > 0 && (
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

              {isEditing && (
                <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
                  Simpan Perubahan
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
