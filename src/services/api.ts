// API Services für Checkout-System

import { 
  transformOrderData, 
  transformShopConfig, 
  validateOrderData, 
  validateShopConfig 
} from "@/utils/dataTransform";
import { logger } from "@/utils/logger";

export interface OrderData {
  shop_id: string;
  product_name: string;
  product_type: "standard" | "premium";
  quantity_liters: number;
  price_per_liter: number;
  delivery_fee: number;
  tax_rate: number;
  currency: string;
  total_net: number;
  total_tax: number;
  total_gross: number;
}

export interface ShopConfig {
  shop_id: string;
  accent_color: string;
  language: "DE" | "EN" | "FR";
  payment_methods: Array<"vorkasse" | "rechnung">;
  currency: string;
  company_name: string;
  logo_url?: string;
  support_phone?: string;
  checkout_mode?: "instant" | "standard";
  shop_url?: string; // Added shop URL field
}

export interface CustomerData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  delivery_address: {
    street: string;
    postal_code: string;
    city: string;
  };
  billing_address?: {
    street: string;
    postal_code: string;
    city: string;
  };
  payment_method: "vorkasse" | "rechnung";
}

export interface OrderSubmissionPayload {
  token: string;
  shop_id: string;
  product_name: string;
  product_type: "standard" | "premium";
  quantity_liters: number;
  price_per_liter: number;
  delivery_fee: number;
  tax_rate: number;
  currency: string;
  total_net: number;
  total_tax: number;
  total_gross: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_street: string;
  delivery_postal_code: string;
  delivery_city: string;
  billing_street?: string;
  billing_postal_code?: string;
  billing_city?: string;
  payment_method_id: "vorkasse" | "rechnung";
  terms_accepted: boolean;
}

export interface OrderResponse {
  order_id: string;
  order_number?: string; // Added 7-digit order number
  status: "pending" | "confirmed" | "failed";
  confirmation_number: string;
  payment_instructions?: {
    bank_details?: {
      account_holder: string;
      iban: string;
      bic: string;
      reference: string;
    };
  };
  total_amount: number;
  currency: string;
}

// New interface for the combined order data and shop ID response
export interface OrderDataWithShopId {
  orderData: OrderData;
  shopId: string;
}

// New interface for bank data
export interface BankData {
  account_holder: string;
  iban: string;
  bic: string;
  bank_name?: string;
}

// Error types für bessere Fehlerbehandlung
export interface ApiError {
  type: 'CORS_ERROR' | 'TOKEN_EXPIRED' | 'VALIDATION_ERROR' | 'SERVER_ERROR' | 'NETWORK_ERROR';
  message: string;
  statusCode?: number;
}

// Validierungsfunktionen
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Internationale Telefonnummern-Validierung (flexibel)
  const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){7,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// UUID validation function
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Function to extract shop ID from URL
const extractShopIdFromUrl = (): string | null => {
  logger.dev("Extracting shop ID from URL");
  
  // Try to get shop ID from URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const shopIdFromParams = urlParams.get('shop_id') || urlParams.get('shopId');
  
  if (shopIdFromParams) {
    logger.devDetailed("Shop ID found in URL params:", shopIdFromParams);
    if (isValidUUID(shopIdFromParams)) {
      logger.dev("Valid UUID found in URL params");
      return shopIdFromParams;
    } else {
      logger.warn("Shop ID from URL params is not a valid UUID:", shopIdFromParams);
    }
  }
  
  // Try to extract from path (e.g., /checkout/shop/uuid)
  const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
  
  // Look for UUID pattern in path segments
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    if (isValidUUID(segment)) {
      logger.dev("Valid UUID found in path:", segment);
      return segment;
    }
  }
  
  logger.warn("No valid shop ID found in URL");
  return null;
};

// Function to extract shop URL from URL parameters or referrer
const extractShopUrlFromRequest = (): string | null => {
  logger.dev("Extracting shop URL from request");
  
  // Try to get shop URL from URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const shopUrlFromParams = urlParams.get('shop_url') || urlParams.get('return_url') || urlParams.get('redirect_url');
  
  if (shopUrlFromParams) {
    logger.devDetailed("Shop URL found in URL params:", shopUrlFromParams);
    
    // Validate the URL
    try {
      new URL(shopUrlFromParams);
      logger.dev("Valid shop URL found in URL params");
      return shopUrlFromParams;
    } catch (error) {
      logger.warn("Invalid shop URL from URL params:", shopUrlFromParams);
    }
  }
  
  // Try to get from document referrer as fallback
  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      // Only use referrer if it's not from the same domain (checkout domain)
      if (referrerUrl.hostname !== window.location.hostname) {
        logger.dev("Using referrer as shop URL:", document.referrer);
        return referrerUrl.origin;
      } else {
        logger.dev("Referrer is from same domain, skipping");
      }
    } catch (error) {
      logger.warn("Invalid referrer URL:", document.referrer);
    }
  }
  
  logger.dev("No valid shop URL found in request");
  return null;
};

// Store captured shop URL in sessionStorage for later use
const storeShopUrl = (shopUrl: string): void => {
  try {
    sessionStorage.setItem('capturedShopUrl', shopUrl);
    logger.dev("Shop URL stored in sessionStorage:", shopUrl);
  } catch (error) {
    logger.warn("Failed to store shop URL in sessionStorage:", error);
  }
};

// Retrieve stored shop URL from sessionStorage
const getStoredShopUrl = (): string | null => {
  try {
    const storedUrl = sessionStorage.getItem('capturedShopUrl');
    if (storedUrl) {
      logger.dev("Retrieved shop URL from sessionStorage:", storedUrl);
      return storedUrl;
    }
  } catch (error) {
    logger.warn("Failed to retrieve shop URL from sessionStorage:", error);
  }
  return null;
};

// Initialize shop URL capture when the checkout loads
export const initializeShopUrlCapture = (): void => {
  const capturedShopUrl = extractShopUrlFromRequest();
  if (capturedShopUrl) {
    storeShopUrl(capturedShopUrl);
  }
};

// Währungsformatierung
export const formatCurrency = (
  amount: number, 
  currency: string = "EUR", 
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE"
): string => {
  const locale = getLocaleFromLanguage(language);
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to EUR if currency is not supported
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
};

export const formatLiters = (
  liters: number, 
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE"
): string => {
  const locale = getLocaleFromLanguage(language);
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: liters % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(liters);
};

const getLocaleFromLanguage = (language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL"): string => {
  const localeMap = {
    "DE": "de-DE",
    "EN": "en-US", 
    "FR": "fr-FR",
    "IT": "it-IT",
    "ES": "es-ES",
    "PL": "pl-PL",
    "NL": "nl-NL"
  };
  
  return localeMap[language] || "de-DE";
};

// Enhanced Fetch-Funktion mit verbessertem CORS-Handling und Debugging
const fetchWithCorsHandling = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const startTime = performance.now();
  logger.dev(`Making ${options.method || 'GET'} request to: ${url}`);
  
  const enhancedOptions: RequestInit = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache', // Prevent aggressive caching
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, enhancedOptions);
    const endTime = performance.now();
    
    logger.devDetailed(`Response: ${response.status} ${response.statusText} (${Math.round(endTime - startTime)}ms)`);
    
    return response;
  } catch (error) {
    const endTime = performance.now();
    logger.error(`Fetch error after ${Math.round(endTime - startTime)}ms:`, error?.message);
    
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        logger.error('Network or CORS error detected');
        throw new Error('CORS_ERROR');
      }
    }
    
    throw error;
  }
};

// Modified function to fetch bank data using POST request
export const fetchBankData = async (shopId?: string): Promise<BankData | null> => {
  logger.dev("Fetching bank data");
  
  // If no shop ID provided, try to extract from URL
  let actualShopId = shopId;
  if (!actualShopId) {
    actualShopId = extractShopIdFromUrl();
  }
  
  if (!actualShopId || actualShopId.trim() === '') {
    logger.error('No valid shop ID available for bank data fetch');
    return null;
  }

  // Validate shop ID format
  if (!isValidUUID(actualShopId)) {
    logger.error('Invalid shop ID format (not a UUID):', actualShopId);
    return null;
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-shop-bankdata`;
  const requestBody = {
    shop_id: actualShopId
  };
  
  try {
    const response = await fetchWithCorsHandling(url, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        logger.warn('Bank data not found - this is expected for shops without bank configuration');
        return null;
      } else if (response.status >= 500) {
        logger.error('Server error fetching bank data');
        throw new Error('SERVER_ERROR');
      } else {
        logger.error(`HTTP error fetching bank data: ${response.status}`);
        throw new Error('VALIDATION_ERROR');
      }
    }
    
    const rawData = await response.json();
    logger.dev("Bank data received successfully");
    
    // Validate bank data structure
    if (!rawData || typeof rawData !== 'object') {
      logger.warn('Invalid bank data structure received');
      return null;
    }
    
    // Handle both nested and flat data structures
    let bankDataSource = rawData;
    
    // Check if data is nested in bank_data object
    if (rawData.bank_data && typeof rawData.bank_data === 'object') {
      logger.devDetailed("Using nested bank_data object");
      bankDataSource = rawData.bank_data;
    }
    
    const bankData: BankData = {
      account_holder: bankDataSource.account_holder || '',
      iban: bankDataSource.iban || '',
      bic: bankDataSource.bic || '',
      bank_name: bankDataSource.bank_name
    };
    
    // Validate required fields
    if (!bankData.account_holder || !bankData.iban || !bankData.bic) {
      logger.warn('Bank data missing required fields');
      return null;
    }
    
    logger.info('Bank data validated successfully');
    return bankData;
  } catch (error) {
    logger.error("Error fetching bank data:", error);
    
    if (error instanceof Error && error.message === 'CORS_ERROR') {
      logger.warn('CORS error fetching bank data - this is expected in development');
    } else {
      logger.warn('Error fetching bank data - bank transfers may not be available');
    }
    
    return null;
  }
};

// Updated fallback data functions
const getFallbackOrderDataWithShopId = (token: string): OrderDataWithShopId => ({
  orderData: {
    shop_id: "demo-shop-123",
    product_name: "Premium Heizöl",
    product_type: "premium",
    quantity_liters: 1000,
    price_per_liter: 1.05,
    delivery_fee: 0,
    tax_rate: 0.19,
    currency: "EUR",
    total_net: 882.35,
    total_tax: 167.65,
    total_gross: 1050.00
  },
  shopId: "demo-shop-123"
});

const getFallbackShopConfig = (shopId: string): ShopConfig => ({
  shop_id: shopId,
  accent_color: "#2563eb",
  language: "DE",
  payment_methods: ["vorkasse", "rechnung"],
  currency: "EUR",
  company_name: "Heizöl Premium GmbH",
  logo_url: undefined,
  support_phone: "+49 123 456789",
  checkout_mode: "standard",
  shop_url: undefined
});

// Updated fetchOrderData function to return both order data and shop ID
export const fetchOrderDataWithShopId = async (token: string): Promise<OrderDataWithShopId> => {
  logger.dev("Fetching order data");
  
  if (!token || token.trim() === '') {
    logger.error('Invalid token provided');
    throw new Error('TOKEN_EXPIRED');
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-order-token?token=${encodeURIComponent(token)}`;
  
  try {
    const response = await fetchWithCorsHandling(url);
    
    if (!response.ok) {
      logger.error(`Order data HTTP error: ${response.status}`);
      
      if (response.status === 401 || response.status === 403) {
        logger.error('Token expired or unauthorized');
        throw new Error('TOKEN_EXPIRED');
      } else if (response.status === 404) {
        logger.error('Order not found');
        throw new Error('TOKEN_EXPIRED');
      } else if (response.status >= 500) {
        logger.error('Server error');
        throw new Error('SERVER_ERROR');
      } else {
        logger.error(`HTTP error: ${response.status}`);
        throw new Error('VALIDATION_ERROR');
      }
    }
    
    const rawData = await response.json();
    logger.dev("Order data received successfully");
    
    // Transform the data to expected format
    const transformedData = transformOrderData(rawData);
    
    // Validate the transformed data
    if (!validateOrderData(transformedData)) {
      logger.error('Order data validation failed after transformation');
      throw new Error('VALIDATION_ERROR');
    }

    // Extract shop ID from the transformed data
    const shopId = transformedData.shop_id;
    if (!shopId) {
      logger.error('Shop ID missing from order data');
      throw new Error('VALIDATION_ERROR');
    }
    
    return {
      orderData: transformedData,
      shopId: shopId
    };
  } catch (error) {
    logger.error("Error fetching order data:", error);
    
    if (error instanceof Error) {
      if (error.message === 'CORS_ERROR') {
        logger.warn('CORS error - using fallback data for demo');
        return getFallbackOrderDataWithShopId(token);
      } else if (['TOKEN_EXPIRED', 'SERVER_ERROR', 'VALIDATION_ERROR'].includes(error.message)) {
        throw error;
      }
    }
    
    logger.warn('Unknown error - using fallback data for demo');
    return getFallbackOrderDataWithShopId(token);
  }
};

// Keep the old fetchOrderData function for backward compatibility
export const fetchOrderData = async (token: string): Promise<OrderData> => {
  const result = await fetchOrderDataWithShopId(token);
  return result.orderData;
};

export const fetchShopConfig = async (shopId: string): Promise<ShopConfig> => {
  logger.dev("Fetching shop config");
  
  if (!shopId || shopId.trim() === '') {
    logger.error('Invalid shop ID provided');
    return getFallbackShopConfig('demo-shop');
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-shop-config/shop/${encodeURIComponent(shopId)}/config`;
  
  try {
    const response = await fetchWithCorsHandling(url);
    
    if (!response.ok) {
      logger.warn(`Shop config HTTP error: ${response.status}`);
      
      if (response.status === 404) {
        logger.warn('Shop config not found - using fallback');
        return getFallbackShopConfig(shopId);
      } else if (response.status >= 500) {
        logger.error('Server error');
        throw new Error('SERVER_ERROR');
      } else {
        logger.error(`HTTP error: ${response.status}`);
        throw new Error('VALIDATION_ERROR');
      }
    }
    
    const rawData = await response.json();
    logger.dev("Shop config received successfully");
    
    // Transform the data to expected format
    const transformedData = transformShopConfig(rawData);
    
    // Validate the transformed data
    if (!validateShopConfig(transformedData)) {
      logger.warn('Shop config validation failed after transformation - using fallback');
      return getFallbackShopConfig(shopId);
    }
    
    return transformedData;
  } catch (error) {
    logger.error("Error fetching shop config:", error);
    
    if (error instanceof Error && error.message === 'CORS_ERROR') {
      logger.warn('CORS error - using fallback shop config');
    } else {
      logger.warn('Error fetching shop config - using fallback');
    }
    
    return getFallbackShopConfig(shopId);
  }
};

export const submitOrder = async (
  customerData: CustomerData, 
  orderData: OrderData, 
  token: string
): Promise<OrderResponse> => {
  const startTime = performance.now();
  logger.dev("Submitting order with performance monitoring");
  
  if (!token || token.trim() === '') {
    throw new Error('TOKEN_EXPIRED');
  }

  // Minimize payload size by removing unnecessary fields
  const payload: OrderSubmissionPayload = {
    token,
    shop_id: orderData.shop_id,
    product_name: orderData.product_name,
    product_type: orderData.product_type,
    quantity_liters: orderData.quantity_liters,
    price_per_liter: orderData.price_per_liter,
    delivery_fee: orderData.delivery_fee,
    tax_rate: orderData.tax_rate,
    currency: orderData.currency,
    total_net: orderData.total_net,
    total_tax: orderData.total_tax,
    total_gross: orderData.total_gross,
    customer_name: `${customerData.first_name} ${customerData.last_name}`,
    customer_email: customerData.email,
    customer_phone: customerData.phone,
    delivery_street: customerData.delivery_address.street,
    delivery_postal_code: customerData.delivery_address.postal_code,
    delivery_city: customerData.delivery_address.city,
    billing_street: customerData.billing_address?.street,
    billing_postal_code: customerData.billing_address?.postal_code,
    billing_city: customerData.billing_address?.city,
    payment_method_id: customerData.payment_method,
    terms_accepted: true
  };

  const url = "https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/create-order";

  try {
    const response = await fetchWithCorsHandling(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      logger.error(`Order submission HTTP error: ${response.status}`);
      
      let errorData: any = {};
      try {
        errorData = await response.json();
        logger.error("Error response data:", errorData);
      } catch (parseError) {
        logger.error("Could not parse error response:", parseError);
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error("TOKEN_EXPIRED");
      } else if (response.status >= 400 && response.status < 500) {
        throw new Error(`VALIDATION_ERROR: ${errorData.message || 'Invalid request data'}`);
      } else {
        throw new Error(`SERVER_ERROR: ${response.status}`);
      }
    }
    
    const result = await response.json();
    const endTime = performance.now();
    logger.info(`Order submitted successfully in ${Math.round(endTime - startTime)}ms`);
    
    // Optimized confirmation data preparation
    const confirmationData = {
      orderResponse: result,
      customerData,
      orderData,
      capturedShopUrl: getStoredShopUrl(),
      submittedAt: new Date().toISOString()
    };
    
    // Store in sessionStorage for confirmation page
    sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmationData));
    logger.dev("Confirmation data stored efficiently");
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    logger.error(`Order submission failed after ${Math.round(endTime - startTime)}ms:`, error);
    
    if (error instanceof Error) {
      if (error.message === 'CORS_ERROR') {
        throw new Error("CORS_ERROR");
      } else if (error.message.includes('TOKEN_EXPIRED') || 
                 error.message.includes('VALIDATION_ERROR') || 
                 error.message.includes('SERVER_ERROR')) {
        throw error;
      }
    }
    
    throw new Error("NETWORK_ERROR");
  }
};
