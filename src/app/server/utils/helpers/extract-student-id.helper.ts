import { STUDY_PROGRAMS } from "@/app/shared/const/role";

export type ExtractedStudentId = {
  entryYear: number;
  studyProgram: {
    id: number;
    name: string;
  };
};

export type ProgramStudyNimType = 14 | 24;

const PROGRAM_STUDY_NIM_MAP: Record<ProgramStudyNimType, { id: number; name: string }> = {
  14: { id: STUDY_PROGRAMS.SISTEM_INFORMASI.id, name: STUDY_PROGRAMS.SISTEM_INFORMASI.name },
  24: {
    id: STUDY_PROGRAMS.PENDIDIKAN_TEKNOLOGI_INFORMASI.id,
    name: STUDY_PROGRAMS.PENDIDIKAN_TEKNOLOGI_INFORMASI.name,
  },
};

export const extractStudentId = (studentId: string | number): ExtractedStudentId => {
  const nim = String(studentId).padStart(9, "0");

  if (!isValidStudentId(nim)) {
    throw new Error("NIM tidak valid.");
  }

  const programStudyNim = parseInt(nim.slice(2, 4), 10) as ProgramStudyNimType;
  const entryYear = parseInt(nim.slice(4, 6), 10);

  const studyProgram = PROGRAM_STUDY_NIM_MAP[programStudyNim];

  return {
    entryYear,
    studyProgram,
  };
};

export const isValidStudentId = (studentId: string | number): boolean => {
  const nim = String(studentId).padStart(9, "0");
  if (!/^\d{9}$/.test(nim)) return false;
  const programStudyNim = parseInt(nim.slice(2, 4), 10);
  return programStudyNim === 14 || programStudyNim === 24;
};
