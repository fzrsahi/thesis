import { useQueryGetAcademicData } from "../_api/useQueryGetAcademicData";

const useAcademicData = () => {
  const { data, isLoading, error } = useQueryGetAcademicData();

  return { data, isLoading, error };
};

export { useAcademicData };
