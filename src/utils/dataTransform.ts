// Data transformation utilities for backend/frontend compatibility

import { logger } from "@/utils/logger";

export interface BackendOrderData {
  shop_id: string;
  product?: string; // Backend uses 'product' instead of 'product_name'
  product_name?: string; // Fallback for correct format
  product_type: "standard" | "premium";
  liters?: number; // Backend uses 'liters' instead of 'quantity_liters'
  quantity_liters?: number; // Fallback for correct format
  price_per_liter: number;
  delivery_fee: number;
  vat_rate?: number; // Backend uses 'vat_rate' 
  tax_rate?: number; // Legacy fallback field
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
  shop_url?: string; // Added shop URL field
}

// Transform backend order data to frontend format
export const transformOrderData = (backendData: any): any => {
  logger.dev("Transforming order data");
  
  // Validate that we have a shop_id
  if (!backendData.shop_id || typeof backendData.shop_id !== 'string') {
    logger.error('Missing or invalid shop_id in backend data');
    throw new Error('VALIDATION_ERROR: Missing shop_id');
  }
  
  // Handle both old and new field formats
  const quantity_liters = backendData.quantity_liters || backendData.liters || 0;
  const price_per_liter = backendData.price_per_liter || 0;
  const delivery_fee = backendData.delivery_fee || 0;
  
  // Handle VAT rate - backend sends percentage (19), convert to decimal (0.19) for calculations
  let rawVatRate;
  if (backendData.vat_rate !== undefined) {
    rawVatRate = backendData.vat_rate;
    logger.apiDebug("Using vat_rate from backend:", backendData.vat_rate);
  } else if (backendData.tax_rate !== undefined) {
    rawVatRate = backendData.tax_rate;
    logger.apiDebug("Using tax_rate fallback from backend:", backendData.tax_rate);
  } else {
    rawVatRate = 19;
    logger.warn("No VAT rate provided by backend, using default 19%");
  }
  
  // Convert percentage to decimal for calculations (19 -> 0.19)
  const tax_rate = rawVatRate > 1 ? rawVatRate / 100 : rawVatRate;
  
  // Use new field names (basePrice, totalAmount) or fall back to legacy fields
  let total_net = backendData.basePrice || backendData.total_net;
  let total_gross = backendData.totalAmount || backendData.total_gross;
  let total_tax = backendData.total_tax;
  
  // If we have basePrice and totalAmount, calculate total_tax
  if (backendData.basePrice !== undefined && backendData.totalAmount !== undefined) {
    total_net = backendData.basePrice;
    total_gross = backendData.totalAmount;
    total_tax = total_gross - total_net;
    logger.devDetailed("Using provided basePrice and totalAmount:", { total_net, total_gross, total_tax });
  }
  // If we don't have the totals, calculate them correctly
  else if (!total_net || !total_gross) {
    // Calculate the gross amount first (this is the total price including VAT)
    const gross_amount = (quantity_liters * price_per_liter) + delivery_fee;
    
    // Calculate net amount: gross / (1 + tax_rate)
    const net_amount = gross_amount / (1 + tax_rate);
    
    // Calculate tax amount: gross - net
    const tax_amount = gross_amount - net_amount;
    
    total_net = net_amount;
    total_tax = tax_amount;
    total_gross = gross_amount;
    
    logger.devDetailed("Tax calculation:", { 
      gross_amount, 
      net_amount, 
      tax_amount, 
      tax_rate
    });
  }
  // If we only have total_tax missing, calculate it
  else if (!total_tax) {
    total_tax = total_gross - total_net;
    logger.devDetailed("Calculated missing total_tax:", total_tax);
  }
  
  // Debug log for currency mapping
  logger.apiDebug("Backend data structure for currency:", {
    shop_currency: backendData.shop?.currency,
    direct_currency: backendData.currency,
    shop_object: backendData.shop
  });

  // Use shop currency first (new API structure), then fallback to direct currency (legacy)
  const currency = backendData.shop?.currency || backendData.currency || "EUR";
  logger.apiDebug("Currency resolved to:", currency);

  const transformed = {
    shop_id: backendData.shop_id,
    product_name: backendData.product_name || backendData.product || "Heizöl",
    product_type: backendData.product_type || "standard",
    quantity_liters,
    price_per_liter,
    delivery_fee,
    tax_rate,
    currency,
    total_net: Number(total_net.toFixed(2)),
    total_tax: Number(total_tax.toFixed(2)),
    total_gross: Number(total_gross.toFixed(2)),
  };
  
  logger.dev("Order data transformed successfully");
  return transformed;
};

// Transform backend shop config to frontend format
export const transformShopConfig = (backendData: any): any => {
  logger.debugCritical("=== TRANSFORM SHOP CONFIG START ===");
  logger.dev("Transforming shop config - RAW BACKEND DATA:", JSON.stringify(backendData, null, 2));
  
  // Extract shop_id from various possible locations in the backend response
  let shop_id = null;
  
  // Check multiple possible locations for shop_id
  if (backendData.shop_id) {
    shop_id = backendData.shop_id;
  } else if (backendData.shop?.shop_id) {
    shop_id = backendData.shop.shop_id;
  } else if (backendData.shop?.id) {
    shop_id = backendData.shop.id;
  } else if (backendData.id) {
    shop_id = backendData.id;
  } else {
    logger.warn("No shop_id found in expected locations");
    logger.devDetailed("Available fields:", Object.keys(backendData || {}));
    if (backendData.shop) {
      logger.devDetailed("Shop object fields:", Object.keys(backendData.shop || {}));
    }
  }
  
  // Validate that we have a valid shop_id
  if (!shop_id || typeof shop_id !== 'string' || shop_id.trim().length === 0) {
    logger.error('Missing or invalid shop_id in backend shop config');
    // For shop config, we can be more lenient and provide a fallback
    shop_id = "unknown-shop";
    logger.dev("Using fallback shop_id:", shop_id);
  }
  
  // Extract other fields, also checking nested shop object if available
  const shopData = backendData.shop || backendData;
  
  // *** ENHANCED PAYMENT METHODS DEBUGGING ***
  logger.paymentDebug("=== PAYMENT METHODS TRANSFORMATION START ===");
  logger.debugCritical("🔍 DETAILED PAYMENT METHODS ANALYSIS");
  
  // Check all possible locations for payment methods
  const paymentMethodSources = {
    'backendData.payment_methods': backendData.payment_methods,
    'shopData.payment_methods': shopData.payment_methods,
    'backendData.paymentMethods': backendData.paymentMethods,
    'shopData.paymentMethods': shopData.paymentMethods,
    'backendData.available_payment_methods': backendData.available_payment_methods,
    'shopData.available_payment_methods': shopData.available_payment_methods,
    'backendData.shop?.payment_methods': backendData.shop?.payment_methods,
    'backendData.config?.payment_methods': backendData.config?.payment_methods,
  };
  
  logger.paymentDebug("All payment method sources:", paymentMethodSources);
  
  // Extract payment methods with fallback logic
  let rawPaymentMethods = shopData.payment_methods || 
                          backendData.payment_methods || 
                          shopData.paymentMethods || 
                          backendData.paymentMethods ||
                          shopData.available_payment_methods ||
                          shopData.available_payment_methods ||
                          backendData.shop?.payment_methods ||
                          backendData.config?.payment_methods;
  
  logger.debugCritical("🎯 Raw payment methods found:", {
    value: rawPaymentMethods,
    type: typeof rawPaymentMethods,
    isArray: Array.isArray(rawPaymentMethods),
    length: rawPaymentMethods?.length,
    stringified: JSON.stringify(rawPaymentMethods)
  });
  
  // Process payment methods based on their format
  let processedPaymentMethods = ["vorkasse", "rechnung"]; // Default fallback
  logger.debugCritical("🚨 DEFAULT FALLBACK SET - This means backend data was not found or processed correctly");
  
  if (rawPaymentMethods) {
    logger.debugCritical("✅ Raw payment methods exist - processing...");
    
    if (Array.isArray(rawPaymentMethods)) {
      logger.paymentDebug("Payment methods is an array, processing each item:");
      rawPaymentMethods.forEach((method, index) => {
        logger.paymentDebug(`  [${index}]:`, {
          value: method,
          type: typeof method,
          stringValue: String(method),
          isObject: typeof method === 'object' && method !== null,
          objectKeys: typeof method === 'object' && method !== null ? Object.keys(method) : null
        });
      });
      
      // Try to map each method to our standard format
      const mappedMethods = rawPaymentMethods.map(method => {
        if (typeof method === 'string') {
          const normalized = method.toLowerCase().trim();
          logger.paymentDebug(`Processing string method: "${method}" -> "${normalized}"`);
          if (normalized.includes('vorkasse') || normalized.includes('bank_transfer') || normalized.includes('überweisung')) {
            logger.paymentDebug(`✅ Mapped "${method}" to "vorkasse"`);
            return 'vorkasse';
          } else if (normalized.includes('rechnung') || normalized.includes('invoice')) {
            logger.paymentDebug(`✅ Mapped "${method}" to "rechnung"`);
            return 'rechnung';
          }
          logger.paymentDebug(`⚠️ Unknown method "${method}" kept as "${normalized}"`);
          return normalized;
        } else if (typeof method === 'object' && method !== null) {
          // Handle object format
          const code = method.code || method.id || method.type || method.name || method.method;
          logger.paymentDebug(`Processing object method:`, method, `extracted code: "${code}"`);
          if (code) {
            const normalized = String(code).toLowerCase().trim();
            if (normalized.includes('vorkasse') || normalized.includes('bank_transfer') || normalized.includes('überweisung')) {
              logger.paymentDebug(`✅ Mapped object "${code}" to "vorkasse"`);
              return 'vorkasse';
            } else if (normalized.includes('rechnung') || normalized.includes('invoice')) {
              logger.paymentDebug(`✅ Mapped object "${code}" to "rechnung"`);
              return 'rechnung';
            }
            logger.paymentDebug(`⚠️ Unknown object method "${code}" kept as "${normalized}"`);
            return normalized;
          }
        }
        const fallback = String(method).toLowerCase().trim();
        logger.paymentDebug(`🔄 Fallback processing: "${method}" -> "${fallback}"`);
        return fallback;
      }).filter(method => {
        const isValid = method === 'vorkasse' || method === 'rechnung';
        logger.paymentDebug(`Filtering method "${method}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        return isValid;
      });
      
      logger.debugCritical("🎯 Mapped and filtered payment methods:", mappedMethods);
      
      if (mappedMethods.length > 0) {
        processedPaymentMethods = mappedMethods;
        logger.debugCritical("✅ USING PROCESSED METHODS FROM BACKEND");
      } else {
        logger.debugCritical("❌ NO VALID METHODS FOUND - USING FALLBACK");
      }
    } else if (typeof rawPaymentMethods === 'string') {
      logger.paymentDebug("Payment methods is a string:", rawPaymentMethods);
      // Try to parse as JSON or split by common delimiters
      try {
        const parsed = JSON.parse(rawPaymentMethods);
        if (Array.isArray(parsed)) {
          logger.paymentDebug("Successfully parsed string as JSON array:", parsed);
          rawPaymentMethods = parsed;
          // Recursively process the parsed array
          const mapped = parsed.map(method => {
            const normalized = String(method).toLowerCase().trim();
            if (normalized.includes('vorkasse') || normalized.includes('bank_transfer') || normalized.includes('überweisung')) {
              return 'vorkasse';
            } else if (normalized.includes('rechnung') || normalized.includes('invoice')) {
              return 'rechnung';
            }
            return normalized;
          }).filter(method => method === 'vorkasse' || method === 'rechnung');
          
          if (mapped.length > 0) {
            processedPaymentMethods = mapped;
          }
        }
      } catch (e) {
        logger.paymentDebug("String is not JSON, trying comma/semicolon split");
        const split = rawPaymentMethods.split(/[,;]/).map(s => s.trim().toLowerCase());
        const mapped = split.map(method => {
          if (method.includes('vorkasse') || method.includes('bank_transfer') || method.includes('überweisung')) {
            return 'vorkasse';
          } else if (method.includes('rechnung') || method.includes('invoice')) {
            return 'rechnung';
          }
          return method;
        }).filter(method => method === 'vorkasse' || method === 'rechnung');
        
        if (mapped.length > 0) {
          processedPaymentMethods = mapped;
        }
      }
    } else {
      logger.paymentDebug("Payment methods is not array or string, treating as single value:", rawPaymentMethods);
      const normalized = String(rawPaymentMethods).toLowerCase().trim();
      if (normalized.includes('vorkasse') || normalized.includes('bank_transfer') || normalized.includes('überweisung')) {
        processedPaymentMethods = ['vorkasse'];
        logger.debugCritical("✅ Single method mapped to vorkasse");
      } else if (normalized.includes('rechnung') || normalized.includes('invoice')) {
        processedPaymentMethods = ['rechnung'];
        logger.debugCritical("✅ Single method mapped to rechnung");
      }
    }
  } else {
    logger.debugCritical("❌ NO PAYMENT METHODS FOUND IN ANY LOCATION - USING DEFAULTS");
    logger.warn("No payment methods found in any expected location - using defaults");
  }
  
  logger.debugCritical("🏁 FINAL PROCESSED PAYMENT METHODS:", processedPaymentMethods);
  logger.paymentDebug("=== PAYMENT METHODS TRANSFORMATION END ===");
  
  // Extract and validate logo URL
  let logo_url = shopData.logo_url || backendData.logo_url;
  
  // Validate logo URL
  if (logo_url && typeof logo_url === 'string' && logo_url.trim()) {
    // Basic URL validation
    try {
      new URL(logo_url);
      logger.devDetailed("Logo URL validation passed:", logo_url);
    } catch (error) {
      logger.error("Invalid logo URL format:", logo_url);
      logo_url = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=80&fit=crop&crop=center"; // Default logo
      logger.dev("Using default logo due to invalid URL");
    }
  } else {
    logger.devDetailed("No valid logo URL provided, using default");
    logo_url = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=80&fit=crop&crop=center"; // Default logo
  }

  // Enhanced shop URL extraction with multiple field mappings
  let shop_url = shopData.shop_url || 
                 shopData.website_url || 
                 shopData.landing_url || 
                 shopData.return_url ||
                 shopData.redirect_url ||
                 backendData.shop_url || 
                 backendData.website_url || 
                 backendData.landing_url ||
                 backendData.return_url ||
                 backendData.redirect_url;
  
  // Validate shop URL if provided
  if (shop_url && typeof shop_url === 'string' && shop_url.trim()) {
    try {
      new URL(shop_url);
      logger.devDetailed("Shop URL validation passed:", shop_url);
    } catch (error) {
      logger.error("Invalid shop URL format:", shop_url);
      shop_url = undefined; // Clear invalid URL
      logger.dev("Cleared invalid shop URL");
    }
  }
  
  const transformed = {
    shop_id: shop_id,
    accent_color: shopData.accent_color || backendData.accent_color || "#2563eb",
    language: shopData.language || backendData.language || "DE",
    payment_methods: processedPaymentMethods,
    currency: shopData.currency || backendData.currency || "EUR",
    company_name: shopData.company_name || backendData.company_name || "Demo Shop",
    logo_url: logo_url,
    support_phone: shopData.support_phone || backendData.support_phone,
    checkout_mode: shopData.checkout_mode || backendData.checkout_mode || "standard",
    shop_url: shop_url, // Include shop URL in transformed data
  };
  
  logger.debugCritical("=== TRANSFORM SHOP CONFIG COMPLETE ===");
  logger.paymentDebug("Final transformed payment methods:", transformed.payment_methods);
  logger.dev("Shop config transformed successfully - FINAL RESULT:", JSON.stringify(transformed, null, 2));
  return transformed;
};

// Validate transformed order data
export const validateOrderData = (data: any): boolean => {
  logger.dev("Validating order data");
  
  const requiredFields = [
    'shop_id',
    'product_name', 
    'quantity_liters',
    'price_per_liter',
    'total_gross'
  ];
  
  for (const field of requiredFields) {
    if (!data[field] && data[field] !== 0) {
      logger.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Additional validation for shop_id
  if (typeof data.shop_id !== 'string' || data.shop_id.trim().length === 0) {
    logger.error('Invalid shop_id:', data.shop_id);
    return false;
  }
  
  // Additional validation
  if (typeof data.quantity_liters !== 'number' || data.quantity_liters <= 0) {
    logger.error('Invalid quantity_liters:', data.quantity_liters);
    return false;
  }
  
  if (typeof data.price_per_liter !== 'number' || data.price_per_liter <= 0) {
    logger.error('Invalid price_per_liter:', data.price_per_liter);
    return false;
  }
  
  if (typeof data.total_gross !== 'number' || data.total_gross <= 0) {
    logger.error('Invalid total_gross:', data.total_gross);
    return false;
  }
  
  // Validate that totals make sense
  if (typeof data.total_net === 'number' && typeof data.total_tax === 'number') {
    const calculated_gross = data.total_net + data.total_tax;
    const tolerance = 0.01; // Allow small rounding differences
    
    if (Math.abs(calculated_gross - data.total_gross) > tolerance) {
      logger.error('Total calculation mismatch:', {
        calculated_gross,
        provided_gross: data.total_gross,
        difference: Math.abs(calculated_gross - data.total_gross)
      });
      return false;
    }
  }
  
  logger.info("Order data validation passed");
  return true;
};

// Validate transformed shop config
export const validateShopConfig = (data: any): boolean => {
  logger.dev("Validating shop config");
  
  const requiredFields = ['shop_id', 'company_name'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      logger.error(`Missing required field in shop config: ${field}`);
      return false;
    }
  }
  
  // Additional validation for shop_id
  if (typeof data.shop_id !== 'string' || data.shop_id.trim().length === 0) {
    logger.error('Invalid shop_id in shop config:', data.shop_id);
    return false;
  }
  
  // Enhanced payment methods validation
  if (!data.payment_methods || !Array.isArray(data.payment_methods)) {
    logger.error('Invalid payment_methods in shop config:', data.payment_methods);
    return false;
  }
  
  if (data.payment_methods.length === 0) {
    logger.error('Empty payment_methods array in shop config');
    return false;
  }
  
  // Check that all payment methods are valid
  const validMethods = ['vorkasse', 'rechnung'];
  const invalidMethods = data.payment_methods.filter(method => !validMethods.includes(method));
  
  if (invalidMethods.length > 0) {
    logger.error('Invalid payment method codes:', invalidMethods);
    return false;
  }
  
  logger.info("Shop config validation passed");
  return true;
};
