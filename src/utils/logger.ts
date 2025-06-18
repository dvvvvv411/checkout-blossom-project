
/**
 * Conditional logging utility
 * Only logs in development environment or when explicitly enabled
 */
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Flag to control detailed logging - can be toggled for debugging
const ENABLE_DETAILED_LOGGING = false;

export const logger = {
  // Development-only logs
  dev: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[DEV] ${message}`, ...args);
    }
  },
  
  // Detailed development logs (only when flag is enabled)
  devDetailed: (message: string, ...args: any[]) => {
    if (isDevelopment && ENABLE_DETAILED_LOGGING) {
      console.log(`[DEV-DETAILED] ${message}`, ...args);
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
