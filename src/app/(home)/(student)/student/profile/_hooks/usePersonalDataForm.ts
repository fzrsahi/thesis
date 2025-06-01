import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  PersonalDataPayload,
  personalDataSchema,
} from "@/app/shared/schema/student/profile/ProfileSchema";
import { paths } from "@/app/shared/types/api";

import { useMutationPutPersonalData } from "../_api/useMutationPutPersonalData";

type PersonalDataResponse =
  paths["/students/personal-data"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

const usePersonalDataForm = (data?: PersonalDataResponse | undefined) => {
  const { data: session } = useSession();

  const {
    mutate: putPersonalData,
    isPending: isPutPending,
    isSuccess: isPutSuccess,
  } = useMutationPutPersonalData();

  const form = useForm<PersonalDataPayload>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      student_id: "12345",
    },
  });

  const handleSubmit = (formData: PersonalDataPayload) => {
    putPersonalData(formData);
  };

  const resetForm = () => {
    form.reset();
  };

  useEffect(() => {
    if (
      data &&
      (data.name !== form.getValues("name") ||
        data.email !== form.getValues("email") ||
        data.student_id !== form.getValues("student_id"))
    ) {
      form.reset({
        name: data.name || session?.user?.name || "",
        email: data.email || session?.user?.email || "",
        student_id: data.student_id || "12345",
      });
    }
  }, [
    data?.name,
    data?.email,
    data?.student_id,
    session?.user?.name,
    session?.user?.email,
    data,
    form,
  ]);

  return {
    form,
    handleSubmit,
    resetForm,
    isLoading: isPutPending,
    isSuccess: isPutSuccess,
  };
};

export { usePersonalDataForm };
