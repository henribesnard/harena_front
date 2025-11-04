/**
 * Centralized logging utility
 * Prevents console.log pollution in production
 * Can be extended to send logs to external services (Sentry, LogRocket, etc.)
 */

const isDev = import.meta.env.MODE === 'development'

export const logger = {
  /**
   * Log informational messages (only in development)
   */
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args)
  },

  /**
   * Log warning messages (only in development)
   */
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args)
  },

  /**
   * Log error messages
   * Always logs errors, but in production should send to error tracking service
   */
  error: (...args: unknown[]) => {
    if (isDev) {
      console.error(...args)
    } else {
      // In production, send to error tracking service
      // Example: Sentry.captureException(args)
      console.error(...args) // Keep for now until Sentry is setup
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args)
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args)
  },

  /**
   * Log table data (only in development)
   */
  table: (data: unknown) => {
    if (isDev) console.table(data)
  }
}
