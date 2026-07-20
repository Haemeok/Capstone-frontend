import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/api/errors";

export const shouldRetryQuery = (failureCount: number, error: unknown) =>
  !ApiError.isUnauthorized(error) && failureCount < 1;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: shouldRetryQuery,
    },
  },
});
