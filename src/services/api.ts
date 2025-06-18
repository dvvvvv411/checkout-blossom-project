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
  logger.dev("=== EXTRACTING SHOP ID FROM URL ===");
  logger.dev("Current URL:", window.location.href);
  logger.dev("Current pathname:", window.location.pathname);
  logger.dev("Current search params:", window.location.search);
  
  // Try to get shop ID from URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const shopIdFromParams = urlParams.get('shop_id') || urlParams.get('shopId');
  
  if (shopIdFromParams) {
    logger.dev("Shop ID found in URL params:", shopIdFromParams);
    if (isValidUUID(shopIdFromParams)) {
      logger.dev("✅ Valid UUID found in URL params");
      return shopIdFromParams;
    } else {
      logger.warn("⚠️ Shop ID from URL params is not a valid UUID:", shopIdFromParams);
    }
  }
  
  // Try to extract from path (e.g., /checkout/shop/uuid)
  const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
  logger.dev("Path segments:", pathSegments);
  
  // Look for UUID pattern in path segments
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    if (isValidUUID(segment)) {
      logger.dev("✅ Valid UUID found in path:", segment);
      return segment;
    }
  }
  
  logger.warn("❌ No valid shop ID found in URL");
  return null;
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
  logger.dev(`=== FETCH REQUEST DEBUG ===`);
  logger.dev(`URL: ${url}`);
  logger.dev(`Method: ${options.method || 'GET'}`);
  logger.dev(`Headers:`, options.headers);
  logger.dev(`Body:`, options.body);
  logger.dev(`Current Origin: ${window.location.origin}`);
  
  const enhancedOptions: RequestInit = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  logger.dev(`Enhanced options:`, enhancedOptions);

  try {
    logger.dev(`Making fetch request...`);
    const response = await fetch(url, enhancedOptions);
    
    logger.dev(`=== FETCH RESPONSE DEBUG ===`);
    logger.dev(`Status: ${response.status} ${response.statusText}`);
    logger.dev(`Headers:`, Object.fromEntries(response.headers.entries()));
    logger.dev(`OK: ${response.ok}`);
    logger.dev(`Type: ${response.type}`);
    logger.dev(`URL: ${response.url}`);
    
    return response;
  } catch (error) {
    logger.error(`=== FETCH ERROR DEBUG ===`);
    logger.error('Error object:', error);
    logger.dev('Error type:', typeof error);
    logger.dev('Error constructor:', error?.constructor?.name);
    logger.error('Error message:', error?.message);
    logger.dev('Error stack:', error?.stack);
    
    if (error instanceof TypeError) {
      logger.error('TypeError detected - likely CORS or network issue');
      if (error.message.includes('Failed to fetch')) {
        logger.error('Failed to fetch - definitive CORS or network error');
        throw new Error('CORS_ERROR');
      }
    }
    
    logger.error('Rethrowing original error');
    throw error;
  }
};

// Modified function to fetch bank data using POST request
export const fetchBankData = async (shopId?: string): Promise<BankData | null> => {
  logger.dev(`=== BANK DATA FETCH START ===`);
  
  // If no shop ID provided, try to extract from URL
  let actualShopId = shopId;
  if (!actualShopId) {
    logger.dev("No shop ID provided, attempting to extract from URL...");
    actualShopId = extractShopIdFromUrl();
  }
  
  logger.dev(`Using shop ID: ${actualShopId}`);
  
  if (!actualShopId || actualShopId.trim() === '') {
    logger.error('No valid shop ID available for bank data fetch');
    return null;
  }

  // Validate shop ID format
  if (!isValidUUID(actualShopId)) {
    logger.error('Invalid shop ID format (not a UUID):', actualShopId);
    return null;
  }

  // Changed to POST request with shop ID in body
  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-shop-bankdata`;
  const requestBody = {
    shop_id: actualShopId
  };
  
  logger.dev(`POST request body:`, requestBody);
  
  try {
    const response = await fetchWithCorsHandling(url, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      logger.warn(`=== BANK DATA HTTP ERROR ===`);
      logger.warn(`Status: ${response.status}`);
      
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
    logger.dev("=== BANK DATA SUCCESS ===");
    logger.dev("Raw bank data received:", rawData);
    
    // Validate bank data structure
    if (!rawData || typeof rawData !== 'object') {
      logger.warn('Invalid bank data structure received');
      return null;
    }
    
    // Handle both nested and flat data structures
    let bankDataSource = rawData;
    
    // Check if data is nested in bank_data object
    if (rawData.bank_data && typeof rawData.bank_data === 'object') {
      logger.dev("=== NESTED BANK DATA DETECTED ===");
      logger.dev("Extracting from bank_data object:", rawData.bank_data);
      bankDataSource = rawData.bank_data;
    } else {
      logger.dev("=== FLAT BANK DATA STRUCTURE ===");
      logger.dev("Using root level data");
    }
    
    logger.dev("=== BANK DATA SOURCE ===");
    logger.dev("Bank data source for processing:", bankDataSource);
    
    const bankData: BankData = {
      account_holder: bankDataSource.account_holder || '',
      iban: bankDataSource.iban || '',
      bic: bankDataSource.bic || '',
      bank_name: bankDataSource.bank_name
    };
    
    logger.dev("=== PROCESSED BANK DATA ===");
    logger.dev("Processed bank data:", bankData);
    
    // Validate required fields
    if (!bankData.account_holder || !bankData.iban || !bankData.bic) {
      logger.warn('Bank data missing required fields:', {
        account_holder: !!bankData.account_holder,
        iban: !!bankData.iban,
        bic: !!bankData.bic,
        data: bankData
      });
      return null;
    }
    
    logger.info('✅ Validated bank data:', bankData);
    return bankData;
  } catch (error) {
    logger.error("=== BANK DATA ERROR ===");
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
  checkout_mode: "standard"
});

// Updated fetchOrderData function to return both order data and shop ID
export const fetchOrderDataWithShopId = async (token: string): Promise<OrderDataWithShopId> => {
  logger.dev(`=== ORDER DATA FETCH START ===`);
  logger.dev(`Token: ${token?.substring(0, 10)}...`);
  
  if (!token || token.trim() === '') {
    logger.error('Invalid token provided');
    throw new Error('TOKEN_EXPIRED');
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-order-token?token=${encodeURIComponent(token)}`;
  
  try {
    const response = await fetchWithCorsHandling(url);
    
    if (!response.ok) {
      logger.error(`=== ORDER DATA HTTP ERROR ===`);
      logger.error(`Status: ${response.status}`);
      logger.error(`Status Text: ${response.statusText}`);
      
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
    logger.dev("=== ORDER DATA SUCCESS ===");
    logger.dev("Raw order data received:", rawData);
    
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
    
    logger.dev(`Extracted shop ID: ${shopId}`);
    
    return {
      orderData: transformedData,
      shopId: shopId
    };
  } catch (error) {
    logger.error("=== ORDER DATA ERROR ===");
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
  logger.dev(`=== SHOP CONFIG FETCH START ===`);
  logger.dev(`Shop ID: ${shopId}`);
  
  if (!shopId || shopId.trim() === '') {
    logger.error('Invalid shop ID provided');
    return getFallbackShopConfig('demo-shop');
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-shop-config/shop/${encodeURIComponent(shopId)}/config`;
  
  try {
    const response = await fetchWithCorsHandling(url);
    
    if (!response.ok) {
      logger.warn(`=== SHOP CONFIG HTTP ERROR ===`);
      logger.warn(`Status: ${response.status}`);
      
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
    logger.dev("=== SHOP CONFIG SUCCESS ===");
    logger.dev("Raw shop config received:", rawData);
    
    // Transform the data to expected format
    const transformedData = transformShopConfig(rawData);
    
    // Validate the transformed data
    if (!validateShopConfig(transformedData)) {
      logger.warn('Shop config validation failed after transformation - using fallback');
      return getFallbackShopConfig(shopId);
    }
    
    return transformedData;
  } catch (error) {
    logger.error("=== SHOP CONFIG ERROR ===");
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
  logger.dev("=== ORDER SUBMISSION START ===");
  logger.dev("Customer data:", customerData);
  logger.dev("Order data:", orderData);
  logger.dev("Token:", token?.substring(0, 10) + "...");
  
  if (!token || token.trim() === '') {
    throw new Error('TOKEN_EXPIRED');
  }

  // Vollständige Payload für Backend erstellen
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

  logger.dev("=== ORDER SUBMISSION PAYLOAD ===");
  logger.dev("Payload:", JSON.stringify(payload, null, 2));

  const url = "https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/create-order";

  try {
    const response = await fetchWithCorsHandling(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    logger.dev("=== ORDER SUBMISSION RESPONSE ===");
    logger.dev(`Status: ${response.status}`);
    logger.dev(`OK: ${response.ok}`);
    
    if (!response.ok) {
      logger.error(`=== ORDER SUBMISSION HTTP ERROR ===`);
      
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
    logger.info("=== ORDER SUBMISSION SUCCESS ===");
    logger.info("Order submitted successfully:", result);
    
    // Enhanced debugging for sessionStorage data
    logger.dev("=== SESSION STORAGE DEBUG ===");
    logger.dev("About to store in sessionStorage:");
    logger.dev("- orderResponse:", JSON.stringify(result, null, 2));
    logger.dev("- customerData:", JSON.stringify(customerData, null, 2));
    logger.dev("- orderData:", JSON.stringify(orderData, null, 2));
    
    // Fetch shop config and bank data for sessionStorage
    let shopConfigToStore = null;
    let bankDataToStore = null;
    
    if (orderData.shop_id) {
      try {
        logger.dev("=== FETCHING ADDITIONAL DATA FOR SESSION STORAGE ===");
        
        // Fetch shop config
        logger.dev("Fetching shop config for sessionStorage...");
        shopConfigToStore = await fetchShopConfig(orderData.shop_id);
        logger.dev("Shop config for sessionStorage:", JSON.stringify(shopConfigToStore, null, 2));
        
        // Check if this is express/instant mode and fetch bank data if needed
        if (shopConfigToStore && (shopConfigToStore.checkout_mode === "instant")) {
          logger.dev("=== INSTANT MODE DETECTED - FETCHING BANK DATA ===");
          logger.dev("Checkout mode:", shopConfigToStore.checkout_mode);
          
          bankDataToStore = await fetchBankData(orderData.shop_id);
          logger.dev("Bank data for sessionStorage:", JSON.stringify(bankDataToStore, null, 2));
          
          if (bankDataToStore) {
            logger.info("✅ Bank data successfully fetched for instant mode");
            
            // Inject bank data into the order response for the confirmation page
            // Use order_number as payment reference, fallback to order_id
            const paymentReference = result.order_number || result.order_id || result.confirmation_number;
            result.payment_instructions = {
              ...result.payment_instructions,
              bank_details: {
                account_holder: bankDataToStore.account_holder,
                iban: bankDataToStore.iban,
                bic: bankDataToStore.bic,
                reference: paymentReference
              }
            };
            
            logger.info("✅ Bank details injected into order response with order_number reference:", result.payment_instructions.bank_details);
            logger.dev("Payment reference used:", paymentReference);
          } else {
            logger.warn("⚠️ No bank data available for instant mode - bank transfer instructions will not be shown");
          }
        } else {
          logger.dev("ℹ️ Not in instant mode or no shop config - checkout_mode:", shopConfigToStore?.checkout_mode);
        }
      } catch (error) {
        logger.warn("Could not fetch additional data for sessionStorage:", error);
      }
    }
    
    const confirmationData = {
      orderResponse: result,
      customerData,
      orderData,
      shopConfig: shopConfigToStore,
      bankData: bankDataToStore,
      submittedAt: new Date().toISOString()
    };
    
    logger.dev("=== FINAL CONFIRMATION DATA ===");
    logger.dev("Final confirmation data to store:", JSON.stringify(confirmationData, null, 2));
    
    // Enhanced debugging for bank details in the final result
    logger.dev("=== BANK DETAILS FINAL CHECK ===");
    logger.dev("Order response payment_instructions:", result.payment_instructions);
    logger.dev("Bank details in payment_instructions:", result.payment_instructions?.bank_details);
    logger.dev("Checkout mode:", shopConfigToStore?.checkout_mode);
    logger.dev("Bank data separately stored:", bankDataToStore);
    
    // Bestelldaten in sessionStorage für Bestätigungsseite speichern
    sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmationData));
    
    // Verify storage
    const storedData = sessionStorage.getItem('orderConfirmation');
    logger.dev("Verification - data actually stored:", storedData);
    
    return result;
  } catch (error) {
    logger.error("=== ORDER SUBMISSION ERROR ===");
    logger.error("Error submitting order:", error);
    
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
