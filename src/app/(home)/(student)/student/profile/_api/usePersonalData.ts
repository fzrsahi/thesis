import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import {
  type PersonalDataPayload,
  type AcademicDataPayload,
  personalDataSchema,
  academicDataSchema,
} from "@/app/shared/schema/student/profile/ProfileSchema";

import { useQueryGetPersonalData } from "./useQueryGetPersonalData";

const usePersonalData = () => {
  const { data, isLoading, error } = useQueryGetPersonalData();

  return { data, isLoading, error };
};

const usePersonalForm = () => {
  const { data: session } = useSession();

  return useForm<PersonalDataPayload>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      student_id: "",
    },
  });
};

const useAcademicForm = () =>
  useForm<AcademicDataPayload>({
    resolver: zodResolver(academicDataSchema),
    defaultValues: {
      gpa: "0",
      transcript_url: "",
      achievements: [],
      memberships: [],
    },
  });

export { usePersonalData, usePersonalForm, useAcademicForm };
