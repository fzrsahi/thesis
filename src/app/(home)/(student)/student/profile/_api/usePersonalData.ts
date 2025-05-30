import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import {
  type PersonalDataPayload,
  personalDataSchema,
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

export { usePersonalData, usePersonalForm };
