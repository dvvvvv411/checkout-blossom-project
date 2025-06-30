
/**
 * Conditional logging utility
 * Only logs in development environment or when explicitly enabled
 */
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Flag to control detailed logging - disabled for production
const ENABLE_DETAILED_LOGGING = false; // Disabled detailed logging

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
  
  // Critical debugging logs (always shown in dev, styled for visibility)
  debugCritical: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`%c[🔍 CRITICAL DEBUG] ${message}`, 'background: #ff6b6b; color: white; padding: 2px 8px; border-radius: 3px; font-weight: bold;', ...args);
    }
  },
  
  // Payment method specific debugging
  paymentDebug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`%c[💳 PAYMENT DEBUG] ${message}`, 'background: #4ecdc4; color: white; padding: 2px 8px; border-radius: 3px; font-weight: bold;', ...args);
    }
  },
  
  // API call debugging
  apiDebug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`%c[🌐 API DEBUG] ${message}`, 'background: #45b7d1; color: white; padding: 2px 8px; border-radius: 3px; font-weight: bold;', ...args);
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
