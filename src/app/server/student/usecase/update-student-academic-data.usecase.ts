import { HttpStatusCode } from "axios";

import { uploadFile } from "@/app/server/google-storage/google-storage.service";
import { AcademicDataPayload } from "@/app/shared/schema/student/profile/ProfileSchema";

import { customError } from "../../utils/error/custom-error";
import { STUDENT_ERROR_RESPONSE } from "../student.error";
import { findStudentByUserId, updateStudentAcademicData } from "../student.repository";
import { rebuildStudentVector } from "../student.vector";

export const updateStudentAcademicDataUsecase = async (userId: number, formData: FormData) => {
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  // Expect a JSON string payload and optional files arrays keyed by index
  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    throw customError(
      STUDENT_ERROR_RESPONSE.BAD_REQUEST.code,
      "Invalid payload",
      HttpStatusCode.BadRequest
    );
  }

  const basePayload: AcademicDataPayload = JSON.parse(payloadRaw);

  // Clone to avoid mutation
  const data: AcademicDataPayload = {
    interests: basePayload.interests || [],
    skills: basePayload.skills || [],
    achievements: (basePayload.achievements || []).map((a) => ({ ...a })),
    experiences: (basePayload.experiences || []).map((e) => ({ ...e })),
  } as AcademicDataPayload & { gpa?: string };

  // Handle files for achievements: keys achievementFiles[<index>]
  await Promise.all(
    (data.achievements || []).map(async (_a, i) => {
      const file = formData.get(`achievementFiles[${i}]`);
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadFile(file);
        (data.achievements as Array<Record<string, unknown>>)[i].fileUrl = uploaded.id;
      }
    })
  );

  // Handle files for experiences: keys experienceFiles[<index>]
  await Promise.all(
    (data.experiences || []).map(async (_e, i) => {
      const file = formData.get(`experienceFiles[${i}]`);
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadFile(file);
        (data.experiences as Array<Record<string, unknown>>)[i].fileUrl = uploaded.id;
      }
    })
  );

  await updateStudentAcademicData(student.id, data as unknown as AcademicDataPayload);
  await rebuildStudentVector(userId);
};
