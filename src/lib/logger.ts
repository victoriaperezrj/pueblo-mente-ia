/**
 * Production-safe logger
 * Only logs in development mode to prevent sensitive data leaks
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Debug logs - only in development
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Errors - handled carefully to avoid leaking sensitive data
   */
  error: (message: string, context?: any) => {
    if (isDev) {
      console.error(message, context);
    } else {
      // In production, only log generic error messages
      console.error('An error occurred');
    }
  },

  /**
   * Warnings - only in development
   */
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Info - only in development
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
};
