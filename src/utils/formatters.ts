
/**
 * Formats an IBAN by adding spaces every 4 characters for better readability
 * @param iban - The IBAN string to format
 * @returns Formatted IBAN with spaces every 4 characters
 */
export const formatIBAN = (iban: string): string => {
  if (!iban) return '';
  
  // Remove any existing spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Add spaces every 4 characters
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
};
