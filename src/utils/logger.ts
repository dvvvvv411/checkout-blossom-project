
/**
 * Conditional logging utility
 * Only logs in development environment or when explicitly enabled
 */
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const logger = {
  // Development-only logs
  dev: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[DEV] ${message}`, ...args);
    }
  },
  
  // Error logging (always shown)
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  
  // Warning logging (always shown)
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  // Info logging (always shown for important information)
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  }
};
