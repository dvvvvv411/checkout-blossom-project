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
export const formatCurrency = (amount: number, currency: string, language: "DE" | "EN" | "FR"): string => {
  const localeMap = {
    DE: "de-DE",
    EN: "en-GB", 
    FR: "fr-FR"
  };
  
  const locale = localeMap[language] || "de-DE";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "EUR",
  }).format(amount);
};

export const formatLiters = (liters: number, language: "DE" | "EN" | "FR"): string => {
  const localeMap = {
    DE: "de-DE",
    EN: "en-GB", 
    FR: "fr-FR"
  };
  
  const locale = localeMap[language] || "de-DE";
  return new Intl.NumberFormat(locale).format(liters);
};

// Verbesserte Fetch-Funktion mit CORS-Handling
const fetchWithCorsHandling = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': window.location.origin,
    'Access-Control-Request-Method': options.method || 'GET',
    'Access-Control-Request-Headers': 'Content-Type, Authorization, Origin',
  };

  const enhancedOptions: RequestInit = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      ...corsHeaders,
      ...options.headers,
    },
  };

  console.log(`Making request to: ${url}`);
  console.log('Request options:', enhancedOptions);

  try {
    const response = await fetch(url, enhancedOptions);
    console.log(`Response status: ${response.status}`);
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('CORS or network error detected');
      throw new Error('CORS_ERROR');
    }
    
    throw error;
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
  console.log(`Fetching order data with shop ID for token: ${token}`);
  
  if (!token || token.trim() === '') {
    console.error('Invalid token provided');
    throw new Error('TOKEN_EXPIRED');
  }

  try {
    const response = await fetchWithCorsHandling(
      `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-order-token?token=${encodeURIComponent(token)}`
    );
    
    if (!response.ok) {
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
  console.log(`Fetching shop config for shop: ${shopId}`);
  
  if (!shopId || shopId.trim() === '') {
    console.error('Invalid shop ID provided');
    return getFallbackShopConfig('demo-shop');
  }

  try {
    const response = await fetchWithCorsHandling(
      `https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/get-shop-config/shop/${encodeURIComponent(shopId)}/config`
    );
    
    if (!response.ok) {
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
  console.log("Submitting order:", { customerData, orderData, token });
  
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

  try {
    const response = await fetchWithCorsHandling(
      "https://luhhnsvwtnmxztcmdxyq.supabase.co/functions/v1/create-order",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("TOKEN_EXPIRED");
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`VALIDATION_ERROR: ${errorData.message || 'Invalid request data'}`);
      } else {
        throw new Error(`SERVER_ERROR: ${response.status}`);
      }
    }
    
    const result = await response.json();
    console.log("Order submitted successfully:", result);
    
    // Bestelldaten in sessionStorage für Bestätigungsseite speichern
    sessionStorage.setItem('orderConfirmation', JSON.stringify({
      orderResponse: result,
      customerData,
      orderData,
      submittedAt: new Date().toISOString()
    }));
    
    return result;
  } catch (error) {
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
