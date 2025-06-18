
// Data transformation utilities for backend/frontend compatibility

export interface BackendOrderData {
  shop_id: string;
  product?: string; // Backend uses 'product' instead of 'product_name'
  product_name?: string; // Fallback for correct format
  product_type: "standard" | "premium";
  liters?: number; // Backend uses 'liters' instead of 'quantity_liters'
  quantity_liters?: number; // Fallback for correct format
  price_per_liter: number;
  delivery_fee: number;
  tax_rate: number;
  currency: string;
  total_net: number;
  total_tax: number;
  total_gross: number;
}

export interface BackendShopConfig {
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

// Transform backend order data to frontend format
export const transformOrderData = (backendData: any): any => {
  console.log("Transforming backend order data:", backendData);
  
  // Handle both old and new field formats
  const transformed = {
    shop_id: backendData.shop_id,
    product_name: backendData.product_name || backendData.product || "Heizöl",
    product_type: backendData.product_type || "standard",
    quantity_liters: backendData.quantity_liters || backendData.liters || 0,
    price_per_liter: backendData.price_per_liter || 0,
    delivery_fee: backendData.delivery_fee || 0,
    tax_rate: backendData.tax_rate || 0.19,
    currency: backendData.currency || "EUR",
    total_net: backendData.total_net || 0,
    total_tax: backendData.total_tax || 0,
    total_gross: backendData.total_gross || 0,
  };
  
  console.log("Transformed order data:", transformed);
  return transformed;
};

// Transform backend shop config to frontend format
export const transformShopConfig = (backendData: any): any => {
  console.log("Transforming backend shop config:", backendData);
  
  const transformed = {
    shop_id: backendData.shop_id,
    accent_color: backendData.accent_color || "#2563eb",
    language: backendData.language || "DE",
    payment_methods: backendData.payment_methods || ["vorkasse", "rechnung"],
    currency: backendData.currency || "EUR",
    company_name: backendData.company_name || "Demo Shop",
    logo_url: backendData.logo_url,
    support_phone: backendData.support_phone,
    checkout_mode: backendData.checkout_mode || "standard",
  };
  
  console.log("Transformed shop config:", transformed);
  return transformed;
};

// Validate transformed order data
export const validateOrderData = (data: any): boolean => {
  console.log("Validating order data:", data);
  
  const requiredFields = [
    'shop_id',
    'product_name', 
    'quantity_liters',
    'price_per_liter',
    'total_gross'
  ];
  
  for (const field of requiredFields) {
    if (!data[field] && data[field] !== 0) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Additional validation
  if (typeof data.quantity_liters !== 'number' || data.quantity_liters <= 0) {
    console.error('Invalid quantity_liters:', data.quantity_liters);
    return false;
  }
  
  if (typeof data.price_per_liter !== 'number' || data.price_per_liter <= 0) {
    console.error('Invalid price_per_liter:', data.price_per_liter);
    return false;
  }
  
  if (typeof data.total_gross !== 'number' || data.total_gross <= 0) {
    console.error('Invalid total_gross:', data.total_gross);
    return false;
  }
  
  console.log("Order data validation passed");
  return true;
};

// Validate transformed shop config
export const validateShopConfig = (data: any): boolean => {
  console.log("Validating shop config:", data);
  
  const requiredFields = ['shop_id', 'company_name'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`Missing required field in shop config: ${field}`);
      return false;
    }
  }
  
  console.log("Shop config validation passed");
  return true;
};
