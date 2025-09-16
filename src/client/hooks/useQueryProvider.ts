import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";

type UseQueryProviderProps<T> = {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;
};

const useQueryProvider = <T>({ queryKey, queryFn, options }: UseQueryProviderProps<T>) =>
  useQuery({
    staleTime: 1000 * 60 * 60 * 24 * 2,
    queryKey,
    queryFn: async () => {
      const res = await queryFn();
      return res;
    },
    retry: (failureCount: number) => {
      if (failureCount < 2) return true;
      return false;
    },
    refetchOnWindowFocus: false,
    ...options,
  });

export default useQueryProvider;
