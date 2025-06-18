
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

// Calculate totals based on quantity, price, delivery fee and tax rate
const calculateTotals = (quantity: number, pricePerLiter: number, deliveryFee: number, taxRate: number) => {
  console.log("Calculating totals with:", { quantity, pricePerLiter, deliveryFee, taxRate });
  
  const productTotal = quantity * pricePerLiter;
  const totalNet = productTotal + deliveryFee;
  const totalTax = totalNet * taxRate;
  const totalGross = totalNet + totalTax;
  
  console.log("Calculated totals:", { productTotal, totalNet, totalTax, totalGross });
  
  return {
    total_net: Math.round(totalNet * 100) / 100,
    total_tax: Math.round(totalTax * 100) / 100,
    total_gross: Math.round(totalGross * 100) / 100,
  };
};

// Transform backend order data to frontend format
export const transformOrderData = (backendData: any): any => {
  console.log("Transforming backend order data:", backendData);
  
  // Handle both old and new field formats
  const quantity = backendData.quantity_liters || backendData.liters || 0;
  const pricePerLiter = backendData.price_per_liter || 0;
  const deliveryFee = backendData.delivery_fee || 0;
  const taxRate = backendData.tax_rate || 0.19;
  
  // Check if we need to calculate totals
  const hasValidTotals = backendData.total_gross && backendData.total_gross > 0;
  let calculatedTotals = {};
  
  if (!hasValidTotals && quantity > 0 && pricePerLiter > 0) {
    console.log("Backend totals missing or invalid, calculating them...");
    calculatedTotals = calculateTotals(quantity, pricePerLiter, deliveryFee, taxRate);
  } else {
    calculatedTotals = {
      total_net: backendData.total_net || 0,
      total_tax: backendData.total_tax || 0,
      total_gross: backendData.total_gross || 0,
    };
  }
  
  const transformed = {
    shop_id: backendData.shop_id,
    product_name: backendData.product_name || backendData.product || "Heizöl",
    product_type: backendData.product_type || "standard",
    quantity_liters: quantity,
    price_per_liter: pricePerLiter,
    delivery_fee: deliveryFee,
    tax_rate: taxRate,
    currency: backendData.currency || "EUR",
    ...calculatedTotals,
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

// Validate transformed order data with improved flexibility
export const validateOrderData = (data: any): boolean => {
  console.log("Validating order data:", data);
  
  const requiredFields = [
    'shop_id',
    'product_name', 
    'quantity_liters',
    'price_per_liter'
  ];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!data[field] && data[field] !== 0) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Validate numeric fields
  if (typeof data.quantity_liters !== 'number' || data.quantity_liters <= 0) {
    console.error('Invalid quantity_liters:', data.quantity_liters);
    return false;
  }
  
  if (typeof data.price_per_liter !== 'number' || data.price_per_liter <= 0) {
    console.error('Invalid price_per_liter:', data.price_per_liter);
    return false;
  }
  
  // More flexible total_gross validation - allow 0 but warn about it
  if (typeof data.total_gross !== 'number') {
    console.error('Invalid total_gross type:', typeof data.total_gross);
    return false;
  }
  
  if (data.total_gross <= 0) {
    console.warn('Total gross is 0 or negative:', data.total_gross);
    
    // Try to recalculate if we have the necessary data
    if (data.quantity_liters > 0 && data.price_per_liter > 0) {
      console.log('Attempting to recalculate totals...');
      const recalculated = calculateTotals(
        data.quantity_liters,
        data.price_per_liter,
        data.delivery_fee || 0,
        data.tax_rate || 0.19
      );
      
      // Update the data object with recalculated values
      Object.assign(data, recalculated);
      console.log('Updated data with recalculated totals:', data);
      
      if (data.total_gross <= 0) {
        console.error('Even after recalculation, total_gross is invalid:', data.total_gross);
        return false;
      }
    } else {
      console.error('Cannot recalculate totals due to missing quantity or price data');
      return false;
    }
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
