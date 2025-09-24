export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  ADVISOR: "advisor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ADVISOR_TYPES = {
  HEAD_OF_DEPARTMENT: "HeadOfDepartment",
  HEAD_OF_STUDY_PROGRAM: "HeadOfStudyProgram",
} as const;

export type AdvisorType = (typeof ADVISOR_TYPES)[keyof typeof ADVISOR_TYPES];

export const STUDY_PROGRAMS = {
  SISTEM_INFORMASI: { id: 1, name: "Sistem Informasi" },
  PENDIDIKAN_TEKNOLOGI_INFORMASI: { id: 2, name: "Pendidikan Teknologi Informasi" },
} as const;

export type StudyProgram = (typeof STUDY_PROGRAMS)[keyof typeof STUDY_PROGRAMS];

// Indonesian display labels for advisor types
export const ADVISOR_TYPES_ID_LABEL = {
  [ADVISOR_TYPES.HEAD_OF_DEPARTMENT]: "Kepala Jurusan",
  [ADVISOR_TYPES.HEAD_OF_STUDY_PROGRAM]: "Kepala Program Studi",
} as const;
