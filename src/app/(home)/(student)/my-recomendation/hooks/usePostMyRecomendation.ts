import { useState } from "react";
import { toast } from "sonner";

import { useMutationPostMyRecomendation } from "../_api/useMutationPostMyRecomendation";

const usePostMyRecomendation = () => {
  const [createError, setCreateError] = useState<string | null>(null);

  const { mutate: createMyRecomendation, isPending: isCreating } = useMutationPostMyRecomendation({
    onError: (error) => {
      const message = error?.response?.data?.message || "Terjadi kesalahan";
      setCreateError(message);
      toast.error(message);
    },
  });

  return { createMyRecomendation, isCreating, error: createError };
};

export { usePostMyRecomendation };
