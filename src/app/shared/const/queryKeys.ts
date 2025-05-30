import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory";

const personalData = createQueryKeys("personal-data", {
  data: () => ["personal-data"],
});

const academicData = createQueryKeys("academic-data", {
  data: () => ["academic-data"],
});

export const queryKeys = mergeQueryKeys(personalData, academicData);
