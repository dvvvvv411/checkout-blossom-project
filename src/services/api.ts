import { QueryClient } from "@tanstack/react-query";

export interface OrderData {
  product_name: string;
  quantity_liters: number;
  price_per_liter: number;
  delivery_fee: number;
  total_net: number;
  total_tax: number;
  total_gross: number;
  tax_rate: number;
  currency?: string;
}

export interface Address {
  street: string;
  postal_code: string;
  city: string;
}

export interface CustomerData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  delivery_address: Address;
  billing_address?: Address;
  payment_method: "vorkasse" | "rechnung";
}

export interface ShopConfig {
  shop_name?: string;
  logo_url?: string;
  primary_color?: string;
  language?: string;
  payment_methods?: string[];
  terms_url?: string;
  privacy_url?: string;
}

export interface OrderResponse {
  success: boolean;
  order_id?: string;
  error?: string;
}

// Updated to support all 7 languages
export const formatCurrency = (amount: number, currency: string = "EUR", language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE"): string => {
  const locale = {
    DE: "de-DE",
    EN: "en-US", 
    FR: "fr-FR",
    IT: "it-IT",
    ES: "es-ES",
    PL: "pl-PL",
    NL: "nl-NL"
  }[language];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Updated to support all 7 languages
export const formatLiters = (liters: number, language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE"): string => {
  const locale = {
    DE: "de-DE",
    EN: "en-US",
    FR: "fr-FR", 
    IT: "it-IT",
    ES: "es-ES",
    PL: "pl-PL",
    NL: "nl-NL"
  }[language];

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(liters);
};

export const fetchOrderData = async (token: string): Promise<OrderData> => {
  console.log("=== FETCHING ORDER DATA ===");
  console.log("Token:", token);
  
  try {
    const response = await fetch(`https://api.heizoel24.de/api/v1/checkout/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      
      if (response.status === 404) {
        throw new Error("TOKEN_EXPIRED");
      } else if (response.status >= 500) {
        throw new Error("SERVER_ERROR");
      } else {
        throw new Error(`API_ERROR_${response.status}`);
      }
    }

    const data = await response.json();
    console.log("Order data received:", data);
    return data;
  } catch (error) {
    console.error("=== FETCH ORDER DATA ERROR ===");
    console.error("Error details:", error);
    
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("CORS_ERROR");
    }
    
    throw error;
  }
};

export const fetchShopConfig = async (token: string): Promise<ShopConfig> => {
  console.log("=== FETCHING SHOP CONFIG ===");
  console.log("Token:", token);
  
  try {
    const response = await fetch(`https://api.heizoel24.de/api/v1/shop-config/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Shop config not found, using defaults");
      return {};
    }

    const data = await response.json();
    console.log("Shop config received:", data);
    return data;
  } catch (error) {
    console.warn("Failed to fetch shop config, using defaults:", error);
    return {};
  }
};

export const submitOrder = async (
  customerData: CustomerData,
  orderData: OrderData,
  token: string
): Promise<OrderResponse> => {
  console.log("=== SUBMITTING ORDER ===");
  console.log("Customer data:", customerData);
  console.log("Order data:", orderData);
  console.log("Token:", token);

  try {
    const response = await fetch(`https://api.heizoel24.de/api/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer: customerData,
        order: orderData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      
      if (response.status === 401) {
        throw new Error("TOKEN_EXPIRED");
      } else if (response.status === 400) {
        throw new Error("VALIDATION_ERROR");
      } else if (response.status >= 500) {
        throw new Error("SERVER_ERROR");
      } else {
        throw new Error(`API_ERROR_${response.status}`);
      }
    }

    const result = await response.json();
    console.log("Order submitted successfully:", result);
    return result;
  } catch (error) {
    console.error("=== ORDER SUBMISSION ERROR ===");
    console.error("Error details:", error);
    
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("CORS_ERROR");
    }
    
    throw error;
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
