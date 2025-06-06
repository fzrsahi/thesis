import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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

  const {
    mutate: putAcademicData,
    isPending: isPutPending,
    isSuccess: isPutSuccess,
  } = useMutationPutAcademicData({
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.message ?? "");
      }
    },
  });

  const form = useForm<AcademicDataPayload>({
    resolver: zodResolver(academicDataSchema),
    defaultValues: {
      gpa: "",
      interests: [],
      achievements: [],
      experiences: [],
    },
  });

  const handleSubmit = (formData: AcademicDataPayload) => {
    putAcademicData(formData);
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
        achievements: formatAchievements,
        experiences: formatExperiences,
      });
    }
  }, [data, form]);

  return {
    form,
    handleSubmit,
    resetForm,
    isLoading: isPutPending,
    isSuccess: isPutSuccess,
    errorMessage,
  };
};

export { useAcademicDataForm };
