import { QueryClient } from '@tanstack/react-query'
import { logger } from '../utils/logger'

/**
 * QueryClient centralisé pour toute l'application
 * Exporté pour permettre l'invalidation du cache depuis authStore
 *
 * Improved with:
 * - Intelligent retry logic (don't retry 4xx errors except 408, 429)
 * - Exponential backoff for retries
 * - Global error logging
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Intelligent retry logic
      retry: (failureCount, error) => {
        // Max 3 retries
        if (failureCount >= 3) return false

        // Don't retry for client errors (4xx) except 408 (timeout) and 429 (rate limit)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status?: number }).status
          if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false
          }
        }

        return true
      },

      // Exponential backoff: 1s, 2s, 4s
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    mutations: {
      // Don't retry mutations by default (they may have side effects)
      retry: false,

      // Global error handler for mutations
      onError: (error) => {
        logger.error('Mutation error:', error)
      },
    },
  },
})
