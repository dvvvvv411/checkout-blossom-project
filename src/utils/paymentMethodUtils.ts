
// Payment method utilities for handling various payment method formats

import { logger } from "./logger";

export type PaymentMethodCode = "vorkasse" | "rechnung";

export interface PaymentMethodMapping {
  code: PaymentMethodCode;
  aliases: string[];
  translations: {
    DE: string;
    EN: string;
    FR: string;
    IT: string;
    ES: string;
    PL: string;
    NL: string;
  };
}

// Comprehensive mapping of payment methods
export const PAYMENT_METHOD_MAPPINGS: PaymentMethodMapping[] = [
  {
    code: "vorkasse",
    aliases: [
      "vorkasse",
      "prepayment", 
      "advance_payment",
      "überweisung",
      "bank_transfer",
      "banktransfer",
      "wire_transfer",
      "sepa",
      "sepa_transfer",
      "banküberweisung"
    ],
    translations: {
      DE: "Vorkasse (Überweisung)",
      EN: "Prepayment (Bank Transfer)",
      FR: "Prépaiement (Virement)",
      IT: "Pagamento anticipato (Bonifico)",
      ES: "Pago por adelantado (Transferencia)",
      PL: "Przedpłata (Przelew)",
      NL: "Vooruitbetaling (Overschrijving)"
    }
  },
  {
    code: "rechnung",
    aliases: [
      "rechnung",
      "invoice",
      "bill",
      "rechnungskauf",
      "purchase_on_account",
      "kauf_auf_rechnung",
      "pay_later",
      "deferred_payment"
    ],
    translations: {
      DE: "Kauf auf Rechnung",
      EN: "Purchase on Invoice",
      FR: "Achat sur facture",
      IT: "Acquisto su fattura",
      ES: "Compra con factura",
      PL: "Zakup na fakturę",
      NL: "Koop op rekening"
    }
  }
];

/**
 * Maps various payment method formats to standardized codes
 */
export const mapPaymentMethodToCode = (method: any): PaymentMethodCode | null => {
  logger.dev("Mapping payment method", { method, type: typeof method });
  
  if (!method) return null;
  
  let methodString = "";
  
  if (typeof method === 'string') {
    methodString = method;
  } else if (typeof method === 'object' && method !== null) {
    // Handle various object structures
    methodString = method.code || method.id || method.type || method.name || method.method || String(method);
  } else {
    methodString = String(method);
  }
  
  const lowercaseMethod = methodString.toLowerCase().trim();
  
  // Find matching payment method
  for (const mapping of PAYMENT_METHOD_MAPPINGS) {
    if (mapping.aliases.some(alias => alias.toLowerCase() === lowercaseMethod)) {
      logger.dev("Successfully mapped payment method", { from: method, to: mapping.code });
      return mapping.code;
    }
  }
  
  logger.warn("Could not map payment method", method);
  return null;
};

/**
 * Gets the display name for a payment method in the specified language
 */
export const getPaymentMethodDisplayName = (
  code: PaymentMethodCode, 
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE"
): string => {
  const mapping = PAYMENT_METHOD_MAPPINGS.find(m => m.code === code);
  return mapping?.translations[language] || code;
};

/**
 * Validates if a string is a valid payment method code
 */
export const isValidPaymentMethodCode = (code: string): code is PaymentMethodCode => {
  return code === "vorkasse" || code === "rechnung";
};

/**
 * Processes an array of payment methods and returns valid, mapped methods
 */
export const processPaymentMethods = (methods: any[]): Array<{
  original: any;
  code: PaymentMethodCode;
  displayName: string;
}> => {
  if (!Array.isArray(methods)) {
    logger.warn("Payment methods is not an array", methods);
    return [];
  }
  
  const processed = methods
    .map(method => {
      const code = mapPaymentMethodToCode(method);
      if (!code) return null;
      
      return {
        original: method,
        code,
        displayName: getPaymentMethodDisplayName(code, "DE")
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  logger.dev("Processed payment methods", { 
    input: methods.length, 
    output: processed.length,
    methods: processed.map(p => p.code)
  });
  
  return processed;
};
