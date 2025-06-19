
import { useState } from "react";
import { validateEmail, validatePhone, validateRequired } from "@/services/api";
import { getTranslation } from "@/utils/translations";
import { logger } from "@/utils/logger";

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormValues {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  postal_code: string;
  city: string;
  billing_street?: string;
  billing_postal_code?: string;
  billing_city?: string;
}

export const useFormValidation = (language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL" = "DE") => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (field: string, value: string, showBillingAddress?: boolean): string => {
    logger.dev(`Validating field: ${field}`, { value, showBillingAddress });
    
    switch (field) {
      case "email":
        if (!validateRequired(value)) {
          return getTranslation("email_required", language);
        }
        if (!validateEmail(value)) {
          return getTranslation("email_invalid", language);
        }
        break;
      
      case "first_name":
        if (!validateRequired(value)) {
          return getTranslation("first_name_required", language);
        }
        break;
      
      case "last_name":
        if (!validateRequired(value)) {
          return getTranslation("last_name_required", language);
        }
        break;
      
      case "phone":
        if (!validateRequired(value)) {
          return getTranslation("phone_required", language);
        }
        if (!validatePhone(value)) {
          return getTranslation("phone_invalid", language);
        }
        break;
      
      case "street":
      case "postal_code":
      case "city":
        // Delivery address fields - no validation (accept any input)
        logger.dev(`Delivery address field ${field} - no validation required`);
        break;
        
      case "billing_street":
      case "billing_postal_code":
      case "billing_city":
        // Billing address fields - only validate if separate billing address is shown
        if (showBillingAddress) {
          logger.dev(`Billing address field ${field} - separate billing address enabled, validating if needed`);
          // For now, we accept any input for billing address fields too
          // This can be changed later if specific validation is required
        } else {
          logger.dev(`Billing address field ${field} - using delivery address, no validation needed`);
        }
        break;
    }
    
    logger.dev(`Field ${field} validation passed`);
    return "";
  };

  const validateForm = (values: FormValues, showBillingAddress: boolean): boolean => {
    logger.dev("Form validation start", { values, showBillingAddress });
    
    const newErrors: ValidationErrors = {};
    
    // Validate required fields (email, names, phone)
    const requiredFields = ["email", "first_name", "last_name", "phone"];
    
    for (const field of requiredFields) {
      const error = validateField(field, values[field], showBillingAddress);
      if (error) {
        logger.dev(`Validation error for ${field}`, error);
        newErrors[field] = error;
      }
    }
    
    // Address fields validation - currently no validation required
    // Delivery address
    logger.dev("Delivery address validation - accepting all inputs", {
      street: values.street,
      postal_code: values.postal_code,
      city: values.city
    });
    
    // Billing address - only if separate billing address is shown
    if (showBillingAddress) {
      logger.dev("Billing address validation - separate billing address enabled, accepting all inputs", {
        billing_street: values.billing_street,
        billing_postal_code: values.billing_postal_code,
        billing_city: values.billing_city
      });
    } else {
      logger.dev("Billing address validation - using delivery address");
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    logger.dev("Form validation result", { errors: newErrors, isValid });
    
    return isValid;
  };

  const setFieldTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const setFieldError = (field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearFieldError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const getFieldError = (field: string): string => {
    return touched[field] ? errors[field] || "" : "";
  };

  const hasFieldError = (field: string): boolean => {
    return touched[field] && !!errors[field];
  };

  return {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    getFieldError,
    hasFieldError,
  };
};
