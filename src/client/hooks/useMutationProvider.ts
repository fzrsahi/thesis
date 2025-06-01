import {
  QueryFilters,
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * useMutationProvider
 * @param queryKey - The key for the query
 * @param mutationFn - The mutation function to execute
 * @param options - Options for the mutation
 * @param removeQueryKey - Query keys to invalidate on success
 * @returns useMutation response
 */
type UseMutationProviderProps<T, U> = {
  queryKey: QueryKey;
  mutationFn: (params: T) => Promise<U>;
  removeQueryKey?: QueryKey | QueryKey[];
  options?: UseMutationOptions<U, AxiosError<ErrorResponse>, T>;
};

const useMutationProvider = <T, U = undefined>({
  queryKey,
  mutationFn,
  removeQueryKey,
  options,
}: UseMutationProviderProps<T, U>): UseMutationResult<U, AxiosError<ErrorResponse>, T> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKey,
    mutationFn,
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey as QueryFilters);
      const previousValue = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: unknown) => {
        if (old) {
          return {
            ...old,
            data: null,
          };
        }
        return old;
      });
      return previousValue;
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      if (removeQueryKey) {
        if (Array.isArray(removeQueryKey)) {
          await Promise.all(
            removeQueryKey.map(async (key) => {
              await queryClient.invalidateQueries(key as QueryFilters);
            })
          );
        } else {
          await queryClient.invalidateQueries(removeQueryKey as QueryFilters);
        }
      }
    },
    onError: async (err: AxiosError<ErrorResponse>, variables, context) => {
      options?.onError?.(err, variables, context);
      throw err;
    },
  });
};

export default useMutationProvider;
