import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AcademicDataPayload,
  academicDataSchema,
} from "@/app/shared/schema/student/profile/ProfileSchema";

import { useQueryGetAcademicData } from "./useQueryGetAcademicData";

const useAcademicData = () => {
  const { data, isLoading, error } = useQueryGetAcademicData();

  return { data, isLoading, error };
};

const useAcademicForm = () =>
  useForm<AcademicDataPayload>({
    resolver: zodResolver(academicDataSchema),
    defaultValues: {
      gpa: "",
      interests: [],
      achievements: [],
      experiences: [],
    },
  });

export { useAcademicData, useAcademicForm };
