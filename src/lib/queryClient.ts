import { QueryClient } from '@tanstack/react-query'

/**
 * QueryClient centralisé pour toute l'application
 * Exporté pour permettre l'invalidation du cache depuis authStore
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})
