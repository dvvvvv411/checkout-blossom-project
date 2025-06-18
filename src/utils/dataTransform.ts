
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
  basePrice?: number; // Backend field for net total
  totalAmount?: number; // Backend field for gross total
  // Legacy fields for backwards compatibility
  total_net?: number;
  total_tax?: number;
  total_gross?: number;
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
  const quantity_liters = backendData.quantity_liters || backendData.liters || 0;
  const price_per_liter = backendData.price_per_liter || 0;
  const delivery_fee = backendData.delivery_fee || 0;
  const tax_rate = backendData.tax_rate || 0.19;
  
  // Use new field names (basePrice, totalAmount) or fall back to legacy fields
  let total_net = backendData.basePrice || backendData.total_net;
  let total_gross = backendData.totalAmount || backendData.total_gross;
  let total_tax = backendData.total_tax;
  
  // If we have basePrice and totalAmount, calculate total_tax
  if (backendData.basePrice !== undefined && backendData.totalAmount !== undefined) {
    total_net = backendData.basePrice;
    total_gross = backendData.totalAmount;
    total_tax = total_gross - total_net;
    console.log("Calculated total_tax from basePrice and totalAmount:", total_tax);
  }
  // If we don't have the totals, calculate them
  else if (!total_net || !total_gross) {
    const net_amount = (quantity_liters * price_per_liter) + delivery_fee;
    const tax_amount = net_amount * tax_rate;
    
    total_net = net_amount;
    total_tax = tax_amount;
    total_gross = net_amount + tax_amount;
    
    console.log("Calculated missing totals:", { total_net, total_tax, total_gross });
  }
  // If we only have total_tax missing, calculate it
  else if (!total_tax) {
    total_tax = total_gross - total_net;
    console.log("Calculated missing total_tax:", total_tax);
  }
  
  const transformed = {
    shop_id: backendData.shop_id,
    product_name: backendData.product_name || backendData.product || "Heizöl",
    product_type: backendData.product_type || "standard",
    quantity_liters,
    price_per_liter,
    delivery_fee,
    tax_rate,
    currency: backendData.currency || "EUR",
    total_net: Number(total_net.toFixed(2)),
    total_tax: Number(total_tax.toFixed(2)),
    total_gross: Number(total_gross.toFixed(2)),
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
  
  // Validate that totals make sense
  if (typeof data.total_net === 'number' && typeof data.total_tax === 'number') {
    const calculated_gross = data.total_net + data.total_tax;
    const tolerance = 0.01; // Allow small rounding differences
    
    if (Math.abs(calculated_gross - data.total_gross) > tolerance) {
      console.error('Total calculation mismatch:', {
        calculated_gross,
        provided_gross: data.total_gross,
        difference: Math.abs(calculated_gross - data.total_gross)
      });
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
