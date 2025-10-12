import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory";

const personalData = createQueryKeys("personal-data", {
  data: () => ["personal-data"],
  update: () => ["update-personal-data"],
});

const academicData = createQueryKeys("academic-data", {
  data: () => ["academic-data"],
  update: () => ["update-academic-data"],
});

const transcript = createQueryKeys("transcript", {
  list: () => ["transcript"],
  create: () => ["create-transcript"],
  delete: () => ["delete-transcript"],
});

const myRecommendation = createQueryKeys("my-recommendation", {
  data: () => ["my-recommendation"],
  create: () => ["create-my-recommendation"],
});

const studentCompetitionDetail = createQueryKeys("student-competition-detail", {
  data: (studentId: number) => ["student-competition-detail", studentId],
});

export const queryKeys = mergeQueryKeys(
  personalData,
  academicData,
  transcript,
  myRecommendation,
  studentCompetitionDetail
);
