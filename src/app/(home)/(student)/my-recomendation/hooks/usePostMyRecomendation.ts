import { useMutationPostMyRecomendation } from "../_api/useMutationPostMyRecomendation";

const usePostMyRecomendation = () => {
  const { mutate: createMyRecomendation, isPending: isCreating } = useMutationPostMyRecomendation();

  return { createMyRecomendation, isCreating };
};

export { usePostMyRecomendation };
