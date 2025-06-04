import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();

  const {
    mutate: putPersonalData,
    isPending: isPutPending,
    isSuccess: isPutSuccess,
  } = useMutationPutPersonalData({
    onError: (error) => {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.message ?? "");
      }
    },
  });

  const form = useForm<PersonalDataPayload>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      student_id: "",
    },
  });

  const handleSubmit = (formData: PersonalDataPayload) => {
    putPersonalData(formData);
  };

  const resetForm = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    if (
      data &&
      (data.name !== form.getValues("name") ||
        data.email !== form.getValues("email") ||
        data.studentId !== form.getValues("student_id"))
    ) {
      form.reset({
        name: data.name || session?.user?.name || "",
        email: data.email || session?.user?.email || "",
        student_id: data.studentId || "",
      });
    }
  }, [
    data?.name,
    data?.email,
    data?.studentId,
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
    errorMessage,
  };
};

export { usePersonalDataForm };
