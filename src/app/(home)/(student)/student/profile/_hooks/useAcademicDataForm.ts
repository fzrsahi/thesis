import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState, KeyboardEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import {
  AcademicDataPayload,
  academicDataSchema,
} from "@/app/shared/schema/student/profile/ProfileSchema";
import { paths } from "@/app/shared/types/api";

import { useMutationPutAcademicData } from "../_api/useMutationPutAcademicData";

type AcademicDataResponse =
  paths["/students/academic-data"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

const useAcademicDataForm = (data?: AcademicDataResponse | undefined) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [isDeleteAchievementDialogOpen, setIsDeleteAchievementDialogOpen] = useState(false);
  const [isDeleteExperienceDialogOpen, setIsDeleteExperienceDialogOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState<{
    index: number;
    title: string;
  } | null>(null);
  const [experienceToDelete, setExperienceToDelete] = useState<{
    index: number;
    organization: string;
  } | null>(null);

  const {
    mutate: putAcademicData,
    isPending: isPutPending,
    isSuccess: isPutSuccess,
  } = useMutationPutAcademicData({
    onSuccess: () => {
      toast.success("Data prestasi berhasil diperbarui");
      setErrorMessage("");
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        const errorMsg = error.response?.data.message ?? "Gagal memperbarui data prestasi";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } else {
        toast.error("Gagal memperbarui data prestasi");
      }
    },
  });

  const form = useForm({
    resolver: zodResolver(academicDataSchema),
    defaultValues: {
      gpa: "",
      interests: [],
      skills: [],
      achievements: [],
      experiences: [],
    },
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  // Date formatting utilities
  const formatDateToYearMonth = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    } catch {
      return "";
    }
  };

  const formatYearMonthToDate = (yearMonth: string) => {
    if (!yearMonth) return "";
    return `${yearMonth}-01`;
  };

  // Interests management
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

  // Skills management
  const handleAddSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();

      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    const updatedSkills = skills.filter((_, index) => index !== indexToRemove);
    setSkills(updatedSkills);
  };

  // Achievement deletion handlers
  const handleDeleteAchievementClick = (index: number) => {
    const title = form.getValues(`achievements.${index}.title`) || "Untitled Achievement";
    setAchievementToDelete({ index, title });
    setIsDeleteAchievementDialogOpen(true);
  };

  const handleConfirmDeleteAchievement = () => {
    if (achievementToDelete) {
      removeAchievement(achievementToDelete.index);
      toast.success("Prestasi berhasil dihapus");
      setIsDeleteAchievementDialogOpen(false);
      setAchievementToDelete(null);
    }
  };

  const handleCancelDeleteAchievement = () => {
    setIsDeleteAchievementDialogOpen(false);
    setAchievementToDelete(null);
  };

  // Experience deletion handlers
  const handleDeleteExperienceClick = (index: number) => {
    const organization =
      form.getValues(`experiences.${index}.organization`) || "Untitled Experience";
    setExperienceToDelete({ index, organization });
    setIsDeleteExperienceDialogOpen(true);
  };

  const handleConfirmDeleteExperience = () => {
    if (experienceToDelete) {
      removeExperience(experienceToDelete.index);
      toast.success("Pengalaman berhasil dihapus");
      setIsDeleteExperienceDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const handleCancelDeleteExperience = () => {
    setIsDeleteExperienceDialogOpen(false);
    setExperienceToDelete(null);
  };

  // Wrapper functions with toast notifications
  const handleAddAchievement = () => {
    appendAchievement({
      title: "",
      description: "",
      date: "",
      issuer: "",
    });
    toast.success("Prestasi baru ditambahkan");
  };

  const handleAddExperience = () => {
    appendExperience({
      organization: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    toast.success("Pengalaman baru ditambahkan");
  };

  const handleSubmit = (formData: AcademicDataPayload) => {
    const formDataWithSkillsAndInterests: AcademicDataPayload = {
      ...formData,
      skills,
      interests,
    };
    putAcademicData(formDataWithSkillsAndInterests);
  };

  const resetForm = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    if (data) {
      const formatAchievements =
        data.achievements?.map((achievement) => ({
          title: achievement.title || "",
          description: achievement.description || "",
          date: achievement.date ? new Date(achievement.date).toISOString().split("T")[0] : "",
        })) || [];

      const formatExperiences =
        data.experiences?.map((experience) => ({
          organization: experience.organization || "",
          position: experience.position || "",
          description: experience.description || "",
          startDate: experience.startDate
            ? new Date(experience.startDate).toISOString().split("T")[0]
            : "",
          endDate: experience.endDate
            ? new Date(experience.endDate).toISOString().split("T")[0]
            : "",
        })) || [];

      form.reset({
        gpa: data.gpa || "",
        interests: data.interests || [],
        skills: data.skills || [],
        achievements: formatAchievements,
        experiences: formatExperiences,
      });

      // Set interests state
      setSkills(data.skills || []);
      setInterests(data.interests || []);
    }
  }, [data, form]);

  return {
    form,
    handleSubmit,
    resetForm,
    isLoading: isPutPending,
    isSuccess: isPutSuccess,
    errorMessage,

    // Field arrays
    achievementFields,
    appendAchievement: handleAddAchievement,
    removeAchievement,
    experienceFields,
    appendExperience: handleAddExperience,
    removeExperience,

    // Interests management
    interestInput,
    setInterestInput,
    interests,
    setInterests,
    handleAddInterest,
    handleRemoveInterest,

    // Skills management
    skillInput,
    setSkillInput,
    skills,
    setSkills,
    handleAddSkill,
    handleRemoveSkill,

    // Date formatting utilities
    formatDateToYearMonth,
    formatYearMonthToDate,

    // Delete confirmation dialogs
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
  };
};

export { useAcademicDataForm };
