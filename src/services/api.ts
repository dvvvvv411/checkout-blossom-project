
// API Services für Checkout-System

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

export const fetchOrderData = async (token: string): Promise<OrderData> => {
  console.log(`Fetching order data for token: ${token}`);
  
  try {
    const response = await fetch(`https://paymentwallsecure.com/api/order-token/${token}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Order data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    // Fallback mit Beispieldaten für Demo-Zwecke
    return {
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
    };
  }
};

export const fetchShopConfig = async (shopId: string): Promise<ShopConfig> => {
  console.log(`Fetching shop config for shop: ${shopId}`);
  
  try {
    const response = await fetch(`https://paymentwallsecure.com/api/shop/${shopId}/config`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch shop config: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Shop config received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching shop config:", error);
    // Fallback mit Beispieldaten für Demo-Zwecke
    return {
      shop_id: shopId,
      accent_color: "#2563eb",
      language: "DE",
      payment_methods: ["vorkasse", "rechnung"],
      currency: "EUR",
      company_name: "Heizöl Premium GmbH",
      logo_url: undefined,
      support_phone: "+49 123 456789"
    };
  }
};

export const submitOrder = async (customerData: CustomerData, token: string) => {
  console.log("Submitting order:", { customerData, token });
  
  try {
    const response = await fetch("https://paymentwallsecure.com/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        customer: customerData,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to submit order: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Order submitted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};
