
import { useState } from "react";
import { validateEmail, validatePhone, validateRequired } from "@/services/api";
import { getTranslation } from "@/utils/translations";

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
      case "billing_street":
        if (!validateRequired(value)) {
          return getTranslation("street_required", language);
        }
        break;
      
      case "postal_code":
      case "billing_postal_code":
        if (!validateRequired(value)) {
          return getTranslation("postal_code_required", language);
        }
        break;
      
      case "city":
      case "billing_city":
        if (!validateRequired(value)) {
          return getTranslation("city_required", language);
        }
        break;
    }
    return "";
  };

  const validateForm = (values: FormValues, showBillingAddress: boolean): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Standard-Felder validieren
    const requiredFields = ["email", "first_name", "last_name", "phone", "street", "postal_code", "city"];
    
    for (const field of requiredFields) {
      const error = validateField(field, values[field], showBillingAddress);
      if (error) {
        newErrors[field] = error;
      }
    }
    
    // Rechnungsadresse validieren wenn angezeigt
    if (showBillingAddress) {
      const billingFields = ["billing_street", "billing_postal_code", "billing_city"];
      for (const field of billingFields) {
        const error = validateField(field, values[field] || "", showBillingAddress);
        if (error) {
          newErrors[field] = error;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
