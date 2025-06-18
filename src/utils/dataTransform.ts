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
  
  // Validate that we have a shop_id
  if (!backendData.shop_id || typeof backendData.shop_id !== 'string') {
    console.error('Missing or invalid shop_id in backend data:', backendData);
    throw new Error('VALIDATION_ERROR: Missing shop_id');
  }
  
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
  console.log("Backend data type:", typeof backendData);
  console.log("Backend data keys:", Object.keys(backendData || {}));
  
  // Extract shop_id from various possible locations in the backend response
  let shop_id = null;
  
  // Check multiple possible locations for shop_id
  if (backendData.shop_id) {
    shop_id = backendData.shop_id;
    console.log("Found shop_id directly:", shop_id);
  } else if (backendData.shop?.shop_id) {
    shop_id = backendData.shop.shop_id;
    console.log("Found shop_id in nested shop object:", shop_id);
  } else if (backendData.shop?.id) {
    shop_id = backendData.shop.id;
    console.log("Found shop_id as 'id' in nested shop object:", shop_id);
  } else if (backendData.id) {
    shop_id = backendData.id;
    console.log("Found shop_id as 'id' directly:", shop_id);
  } else {
    console.warn("No shop_id found in any expected location");
    console.log("Available fields:", Object.keys(backendData || {}));
    if (backendData.shop) {
      console.log("Shop object fields:", Object.keys(backendData.shop || {}));
    }
  }
  
  // Validate that we have a valid shop_id
  if (!shop_id || typeof shop_id !== 'string' || shop_id.trim().length === 0) {
    console.error('Missing or invalid shop_id in backend shop config:', {
      extracted_shop_id: shop_id,
      backend_data: backendData
    });
    // For shop config, we can be more lenient and provide a fallback
    shop_id = "unknown-shop";
    console.log("Using fallback shop_id:", shop_id);
  }
  
  // Extract other fields, also checking nested shop object if available
  const shopData = backendData.shop || backendData;
  
  const transformed = {
    shop_id: shop_id,
    accent_color: shopData.accent_color || backendData.accent_color || "#2563eb",
    language: shopData.language || backendData.language || "DE",
    payment_methods: shopData.payment_methods || backendData.payment_methods || ["vorkasse", "rechnung"],
    currency: shopData.currency || backendData.currency || "EUR",
    company_name: shopData.company_name || backendData.company_name || "Demo Shop",
    logo_url: shopData.logo_url || backendData.logo_url,
    support_phone: shopData.support_phone || backendData.support_phone,
    checkout_mode: shopData.checkout_mode || backendData.checkout_mode || "standard",
  };
  
  console.log("Transformed shop config:", transformed);
  console.log("Final shop_id for validation:", transformed.shop_id);
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
  
  // Additional validation for shop_id
  if (typeof data.shop_id !== 'string' || data.shop_id.trim().length === 0) {
    console.error('Invalid shop_id:', data.shop_id);
    return false;
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
  console.log("Shop config data type:", typeof data);
  console.log("Shop config shop_id:", data?.shop_id, "type:", typeof data?.shop_id);
  
  const requiredFields = ['shop_id', 'company_name'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`Missing required field in shop config: ${field}`, {
        field_value: data[field],
        all_data: data
      });
      return false;
    }
  }
  
  // Additional validation for shop_id
  if (typeof data.shop_id !== 'string' || data.shop_id.trim().length === 0) {
    console.error('Invalid shop_id in shop config:', {
      shop_id: data.shop_id,
      shop_id_type: typeof data.shop_id,
      shop_id_length: data.shop_id?.length,
      trimmed_length: data.shop_id?.trim?.()?.length
    });
    return false;
  }
  
  console.log("Shop config validation passed");
  return true;
};
