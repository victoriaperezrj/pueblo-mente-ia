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
   * Errors - always logged (needed for debugging production issues)
   */
  error: (...args: any[]) => {
    console.error(...args);
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
