import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory";

const personalData = createQueryKeys("personal-data", {
  data: () => ["personal-data"],
  update: () => ["update-personal-data"],
});

const academicData = createQueryKeys("academic-data", {
  data: () => ["academic-data"],
  update: () => ["update-academic-data"],
});

export const queryKeys = mergeQueryKeys(personalData, academicData);
