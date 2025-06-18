
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSupportedLanguage(lang?: string): "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" {
  const supportedLanguages = ["DE", "EN", "FR", "IT", "ES", "PL", "NL"] as const;
  
  if (!lang) return "DE";
  
  const upperLang = lang.toUpperCase() as "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
  
  if (supportedLanguages.includes(upperLang)) {
    return upperLang;
  }
  
  // Fallback for common language codes
  const langMap: Record<string, "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL"> = {
    "DE": "DE",
    "EN": "EN", 
    "GB": "EN",
    "US": "EN",
    "FR": "FR",
    "IT": "IT",
    "ES": "ES",
    "PL": "PL",
    "NL": "NL",
    "BE": "NL", // Belgian Dutch
  };
  
  return langMap[upperLang] || "DE";
}
