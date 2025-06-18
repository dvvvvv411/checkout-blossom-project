// API Services für Checkout-System

import { 
  transformOrderData, 
  transformShopConfig, 
  validateOrderData, 
  validateShopConfig 
} from "@/utils/dataTransform";

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
  checkout_mode?: "express" | "standard";
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
  console.log(`=== FETCH REQUEST DEBUG ===`);
  console.log(`URL: ${url}`);
  console.log(`Method: ${options.method || 'GET'}`);
  console.log(`Headers:`, options.headers);
  console.log(`Body:`, options.body);
  console.log(`Current Origin: ${window.location.origin}`);
  
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

  console.log(`Enhanced options:`, enhancedOptions);

  try {
    console.log(`Making fetch request...`);
    const response = await fetch(url, enhancedOptions);
    
    console.log(`=== FETCH RESPONSE DEBUG ===`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`OK: ${response.ok}`);
    console.log(`Type: ${response.type}`);
    console.log(`URL: ${response.url}`);
    
    return response;
  } catch (error) {
    console.error(`=== FETCH ERROR DEBUG ===`);
    console.error('Error object:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    
    if (error instanceof TypeError) {
      console.error('TypeError detected - likely CORS or network issue');
      if (error.message.includes('Failed to fetch')) {
        console.error('Failed to fetch - definitive CORS or network error');
        throw new Error('CORS_ERROR');
      }
    }
    
    console.error('Rethrowing original error');
    throw error;
  }
};

// New function to fetch bank data
export const fetchBankData = async (shopId: string): Promise<BankData | null> => {
  console.log(`=== BANK DATA FETCH START ===`);
  console.log(`Shop ID: ${shopId}`);
  
  if (!shopId || shopId.trim() === '') {
    console.error('Invalid shop ID provided for bank data fetch');
    return null;
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-shop-bankdata/${encodeURIComponent(shopId)}`;
  
  try {
    const response = await fetchWithCorsHandling(url);
    
    if (!response.ok) {
      console.warn(`=== BANK DATA HTTP ERROR ===`);
      console.warn(`Status: ${response.status}`);
      
      if (response.status === 404) {
        console.warn('Bank data not found - this is expected for shops without bank configuration');
        return null;
      } else if (response.status >= 500) {
        console.error('Server error fetching bank data');
        throw new Error('SERVER_ERROR');
      } else {
        console.error(`HTTP error fetching bank data: ${response.status}`);
        throw new Error('VALIDATION_ERROR');
      }
    }
    
    const rawData = await response.json();
    console.log("=== BANK DATA SUCCESS ===");
    console.log("Raw bank data received:", rawData);
    
    // Validate bank data structure
    if (!rawData || typeof rawData !== 'object') {
      console.warn('Invalid bank data structure received');
      return null;
    }
    
    const bankData: BankData = {
      account_holder: rawData.account_holder || '',
      iban: rawData.iban || '',
      bic: rawData.bic || '',
      bank_name: rawData.bank_name
    };
    
    // Validate required fields
    if (!bankData.account_holder || !bankData.iban || !bankData.bic) {
      console.warn('Bank data missing required fields:', bankData);
      return null;
    }
    
    console.log('Validated bank data:', bankData);
    return bankData;
  } catch (error) {
    console.error("=== BANK DATA ERROR ===");
    console.error("Error fetching bank data:", error);
    
    if (error instanceof Error && error.message === 'CORS_ERROR') {
      console.warn('CORS error fetching bank data - this is expected in development');
    } else {
      console.warn('Error fetching bank data - bank transfers may not be available');
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
  console.log(`=== ORDER DATA FETCH START ===`);
  console.log(`Token: ${token?.substring(0, 10)}...`);
  
  if (!token || token.trim() === '') {
    console.error('Invalid token provided');
    throw new Error('TOKEN_EXPIRED');
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-order-token?token=${encodeURIComponent(token)}`;
  
  try {
    const response = await fetchWithCorsHandling(url);
    
    if (!response.ok) {
      console.error(`=== ORDER DATA HTTP ERROR ===`);
      console.error(`Status: ${response.status}`);
      console.error(`Status Text: ${response.statusText}`);
      
      if (response.status === 401 || response.status === 403) {
        console.error('Token expired or unauthorized');
        throw new Error('TOKEN_EXPIRED');
      } else if (response.status === 404) {
        console.error('Order not found');
        throw new Error('TOKEN_EXPIRED');
      } else if (response.status >= 500) {
        console.error('Server error');
        throw new Error('SERVER_ERROR');
      } else {
        console.error(`HTTP error: ${response.status}`);
        throw new Error('VALIDATION_ERROR');
      }
    }
    
    const rawData = await response.json();
    console.log("=== ORDER DATA SUCCESS ===");
    console.log("Raw order data received:", rawData);
    
    // Transform the data to expected format
    const transformedData = transformOrderData(rawData);
    
    // Validate the transformed data
    if (!validateOrderData(transformedData)) {
      console.error('Order data validation failed after transformation');
      throw new Error('VALIDATION_ERROR');
    }

    // Extract shop ID from the transformed data
    const shopId = transformedData.shop_id;
    if (!shopId) {
      console.error('Shop ID missing from order data');
      throw new Error('VALIDATION_ERROR');
    }
    
    console.log(`Extracted shop ID: ${shopId}`);
    
    return {
      orderData: transformedData,
      shopId: shopId
    };
  } catch (error) {
    console.error("=== ORDER DATA ERROR ===");
    console.error("Error fetching order data:", error);
    
    if (error instanceof Error) {
      if (error.message === 'CORS_ERROR') {
        console.warn('CORS error - using fallback data for demo');
        return getFallbackOrderDataWithShopId(token);
      } else if (['TOKEN_EXPIRED', 'SERVER_ERROR', 'VALIDATION_ERROR'].includes(error.message)) {
        throw error;
      }
    }
    
    console.warn('Unknown error - using fallback data for demo');
    return getFallbackOrderDataWithShopId(token);
  }
};

// Keep the old fetchOrderData function for backward compatibility
export const fetchOrderData = async (token: string): Promise<OrderData> => {
  const result = await fetchOrderDataWithShopId(token);
  return result.orderData;
};

export const fetchShopConfig = async (shopId: string): Promise<ShopConfig> => {
  console.log(`=== SHOP CONFIG FETCH START ===`);
  console.log(`Shop ID: ${shopId}`);
  
  if (!shopId || shopId.trim() === '') {
    console.error('Invalid shop ID provided');
    return getFallbackShopConfig('demo-shop');
  }

  const url = `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-shop-config/shop/${encodeURIComponent(shopId)}/config`;
  
  try {
    const response = await fetchWithCorsHandling(url);
    
    if (!response.ok) {
      console.warn(`=== SHOP CONFIG HTTP ERROR ===`);
      console.warn(`Status: ${response.status}`);
      
      if (response.status === 404) {
        console.warn('Shop config not found - using fallback');
        return getFallbackShopConfig(shopId);
      } else if (response.status >= 500) {
        console.error('Server error');
        throw new Error('SERVER_ERROR');
      } else {
        console.error(`HTTP error: ${response.status}`);
        throw new Error('VALIDATION_ERROR');
      }
    }
    
    const rawData = await response.json();
    console.log("=== SHOP CONFIG SUCCESS ===");
    console.log("Raw shop config received:", rawData);
    
    // Transform the data to expected format
    const transformedData = transformShopConfig(rawData);
    
    // Validate the transformed data
    if (!validateShopConfig(transformedData)) {
      console.warn('Shop config validation failed after transformation - using fallback');
      return getFallbackShopConfig(shopId);
    }
    
    return transformedData;
  } catch (error) {
    console.error("=== SHOP CONFIG ERROR ===");
    console.error("Error fetching shop config:", error);
    
    if (error instanceof Error && error.message === 'CORS_ERROR') {
      console.warn('CORS error - using fallback shop config');
    } else {
      console.warn('Error fetching shop config - using fallback');
    }
    
    return getFallbackShopConfig(shopId);
  }
};

export const submitOrder = async (
  customerData: CustomerData, 
  orderData: OrderData, 
  token: string
): Promise<OrderResponse> => {
  console.log("=== ORDER SUBMISSION START ===");
  console.log("Customer data:", customerData);
  console.log("Order data:", orderData);
  console.log("Token:", token?.substring(0, 10) + "...");
  
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

  console.log("=== ORDER SUBMISSION PAYLOAD ===");
  console.log("Payload:", JSON.stringify(payload, null, 2));

  const url = "https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/create-order";

  try {
    const response = await fetchWithCorsHandling(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    console.log("=== ORDER SUBMISSION RESPONSE ===");
    console.log(`Status: ${response.status}`);
    console.log(`OK: ${response.ok}`);
    
    if (!response.ok) {
      console.error(`=== ORDER SUBMISSION HTTP ERROR ===`);
      
      let errorData: any = {};
      try {
        errorData = await response.json();
        console.error("Error response data:", errorData);
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
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
    console.log("=== ORDER SUBMISSION SUCCESS ===");
    console.log("Order submitted successfully:", result);
    
    // Enhanced debugging for sessionStorage data
    console.log("=== SESSION STORAGE DEBUG ===");
    console.log("About to store in sessionStorage:");
    console.log("- orderResponse:", JSON.stringify(result, null, 2));
    console.log("- customerData:", JSON.stringify(customerData, null, 2));
    console.log("- orderData:", JSON.stringify(orderData, null, 2));
    
    // Fetch shop config and bank data for sessionStorage
    let shopConfigToStore = null;
    let bankDataToStore = null;
    
    if (orderData.shop_id) {
      try {
        console.log("=== FETCHING ADDITIONAL DATA FOR SESSION STORAGE ===");
        
        // Fetch shop config
        console.log("Fetching shop config for sessionStorage...");
        shopConfigToStore = await fetchShopConfig(orderData.shop_id);
        console.log("Shop config for sessionStorage:", JSON.stringify(shopConfigToStore, null, 2));
        
        // Check if this is express/instant mode and fetch bank data if needed
        if (shopConfigToStore && (shopConfigToStore.checkout_mode === "express" || shopConfigToStore.checkout_mode === "instant")) {
          console.log("=== EXPRESS/INSTANT MODE DETECTED - FETCHING BANK DATA ===");
          console.log("Checkout mode:", shopConfigToStore.checkout_mode);
          
          bankDataToStore = await fetchBankData(orderData.shop_id);
          console.log("Bank data for sessionStorage:", JSON.stringify(bankDataToStore, null, 2));
          
          if (bankDataToStore) {
            console.log("✅ Bank data successfully fetched for express mode");
            
            // Inject bank data into the order response for the confirmation page
            result.payment_instructions = {
              ...result.payment_instructions,
              bank_details: {
                account_holder: bankDataToStore.account_holder,
                iban: bankDataToStore.iban,
                bic: bankDataToStore.bic,
                reference: result.confirmation_number || result.order_id
              }
            };
            
            console.log("✅ Bank details injected into order response:", result.payment_instructions.bank_details);
          } else {
            console.warn("⚠️ No bank data available for express mode - bank transfer instructions will not be shown");
          }
        } else {
          console.log("ℹ️ Not in express/instant mode or no shop config - checkout_mode:", shopConfigToStore?.checkout_mode);
        }
      } catch (error) {
        console.warn("Could not fetch additional data for sessionStorage:", error);
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
    
    console.log("=== FINAL CONFIRMATION DATA ===");
    console.log("Final confirmation data to store:", JSON.stringify(confirmationData, null, 2));
    
    // Enhanced debugging for bank details in the final result
    console.log("=== BANK DETAILS FINAL CHECK ===");
    console.log("Order response payment_instructions:", result.payment_instructions);
    console.log("Bank details in payment_instructions:", result.payment_instructions?.bank_details);
    console.log("Checkout mode:", shopConfigToStore?.checkout_mode);
    console.log("Bank data separately stored:", bankDataToStore);
    
    // Bestelldaten in sessionStorage für Bestätigungsseite speichern
    sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmationData));
    
    // Verify storage
    const storedData = sessionStorage.getItem('orderConfirmation');
    console.log("Verification - data actually stored:", storedData);
    
    return result;
  } catch (error) {
    console.error("=== ORDER SUBMISSION ERROR ===");
    console.error("Error submitting order:", error);
    
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
