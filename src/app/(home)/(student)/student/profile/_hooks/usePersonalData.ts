import { useQueryGetPersonalData } from "../_api/useQueryGetPersonalData";

const usePersonalData = () => {
  const { data, isLoading, error } = useQueryGetPersonalData();

  return { data, isLoading, error };
};

export { usePersonalData };
