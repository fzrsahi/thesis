import { useState } from "react";

import { useMutationPostMyRecomendation } from "../_api/useMutationPostMyRecomendation";

const usePostMyRecomendation = () => {
  const [createError, setCreateError] = useState<string | null>(null);

  const { mutate: createMyRecomendation, isPending: isCreating } = useMutationPostMyRecomendation({
    onError: (error) => {
      setCreateError(error?.response?.data?.message || "");
    },
  });

  return { createMyRecomendation, isCreating, error: createError };
};

export { usePostMyRecomendation };
