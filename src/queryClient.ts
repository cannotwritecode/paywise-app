import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2m
      cacheTime: 1000 * 60 * 60 * 24, // 24h
      refetchOnWindowFocus: false,
    },
  },
});
