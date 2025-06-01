import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AcademicDataPayload,
  academicDataSchema,
} from "@/app/shared/schema/student/profile/ProfileSchema";

const useAcademicDataForm = () =>
  useForm<AcademicDataPayload>({
    resolver: zodResolver(academicDataSchema),
    defaultValues: {
      gpa: "",
      interests: [],
      achievements: [],
      experiences: [],
    },
  });

export { useAcademicDataForm };
