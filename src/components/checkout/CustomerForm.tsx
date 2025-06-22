
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrderData, ShopConfig, CustomerData, submitOrder } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { EmailCard } from "./EmailCard";
import { ContactDeliveryCard } from "./ContactDeliveryCard";
import { BillingAddressCard } from "./BillingAddressCard";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { TermsCard } from "./TermsCard";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useFormValidation, FormValues } from "@/hooks/useFormValidation";
import { getTranslation } from "@/utils/translations";
import { logger } from "@/utils/logger";

interface CustomerFormProps {
  orderData: OrderData;
  shopConfig?: ShopConfig;
  accentColor: string;
  showMobileNavigation?: boolean;
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
  capturedShopUrl?: string | null;
}

export const CustomerForm = ({ orderData, shopConfig, accentColor, showMobileNavigation = true, language, capturedShopUrl }: CustomerFormProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CustomerData>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    delivery_address: {
      street: "",
      postal_code: "",
      city: "",
    },
    billing_first_name: "",
    billing_last_name: "",
    payment_method: "vorkasse",
  });

  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStarted, setSubmissionStarted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    email: false,
    contact: false,
    delivery: false,
    billing: true,
    payment: true,
    terms: false,
  });

  const {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    getFieldError,
    hasFieldError,
  } = useFormValidation(language);

  // Auto-copy delivery address and names to billing when billing address is not shown separately
  useEffect(() => {
    if (!showBillingAddress) {
      logger.dev("Auto-copying delivery address and names to billing address", {
        deliveryAddress: formData.delivery_address,
        deliveryNames: { first_name: formData.first_name, last_name: formData.last_name }
      });
      setFormData(prev => ({
        ...prev,
        billing_address: {
          street: prev.delivery_address.street,
          postal_code: prev.delivery_address.postal_code,
          city: prev.delivery_address.city,
        },
        billing_first_name: prev.first_name,
        billing_last_name: prev.last_name,
      }));
    } else {
      logger.dev("Billing address is separate - not auto-copying");
    }
  }, [showBillingAddress, formData.delivery_address, formData.first_name, formData.last_name]);

  // Check step completion whenever form data changes
  useEffect(() => {
    const newCompletedSteps = {
      email: !!formData.email && formData.email.includes("@") && formData.email.includes("."),
      contact: !!(formData.first_name && formData.last_name && formData.phone),
      delivery: !!(formData.delivery_address.street && formData.delivery_address.postal_code && formData.delivery_address.city),
      billing: !showBillingAddress || !!(
        formData.billing_address?.street && 
        formData.billing_address?.postal_code && 
        formData.billing_address?.city &&
        formData.billing_first_name &&
        formData.billing_last_name
      ),
      payment: true,
      terms: termsAccepted,
    };
    
    logger.dev("Step completion status updated", { 
      completedSteps: newCompletedSteps,
      showBillingAddress,
      billingAddress: formData.billing_address,
      billingNames: { first_name: formData.billing_first_name, last_name: formData.billing_last_name }
    });
    
    setCompletedSteps(newCompletedSteps);
  }, [formData, showBillingAddress, termsAccepted]);

  // Auto-select first payment method if available
  useEffect(() => {
    if (shopConfig?.payment_methods && shopConfig.payment_methods.length > 0 && !formData.payment_method) {
      setFormData(prev => ({
        ...prev,
        payment_method: shopConfig.payment_methods[0] as "vorkasse" | "rechnung"
      }));
    }
  }, [shopConfig?.payment_methods, formData.payment_method]);

  const handleInputChange = (field: string, value: string) => {
    logger.dev(`Input change: ${field} = ${value}`);
    
    if (field.startsWith("delivery_address.")) {
      const addressField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        delivery_address: {
          ...prev.delivery_address,
          [addressField]: value,
        },
      }));
    } else if (field.startsWith("billing_address.")) {
      const addressField = field.split(".")[1];
      if (addressField === "first_name" || addressField === "last_name") {
        // Handle billing name fields
        const nameField = addressField === "first_name" ? "billing_first_name" : "billing_last_name";
        logger.dev(`Updating billing name field: ${nameField} = ${value}`);
        setFormData(prev => ({
          ...prev,
          [nameField]: value,
        }));
      } else {
        // Handle billing address fields
        logger.dev(`Updating billing address field: ${addressField} = ${value}`);
        setFormData(prev => ({
          ...prev,
          billing_address: {
            ...prev.billing_address,
            [addressField]: value,
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    clearFieldError(field);
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field);
    const value = getFieldValue(field);
    let validationField = field.replace("delivery_address.", "").replace("billing_address.", "");
    
    // Map billing name fields correctly for validation
    if (field === "billing_address.first_name") {
      validationField = "billing_first_name";
    } else if (field === "billing_address.last_name") {
      validationField = "billing_last_name";
    }
    
    const error = validateField(validationField, value, showBillingAddress);
    if (error) {
      setFieldError(field, error);
    } else {
      clearFieldError(field);
    }
  };

  const getFieldValue = (field: string): string => {
    if (field.startsWith("delivery_address.")) {
      const addressField = field.split(".")[1];
      return formData.delivery_address[addressField] || "";
    } else if (field.startsWith("billing_address.")) {
      const addressField = field.split(".")[1];
      if (addressField === "first_name") {
        return formData.billing_first_name || "";
      } else if (addressField === "last_name") {
        return formData.billing_last_name || "";
      } else {
        return formData.billing_address?.[addressField] || "";
      }
    } else {
      return formData[field] || "";
    }
  };

  const handleBillingAddressToggle = (checked: boolean) => {
    logger.dev(`Billing address toggle: ${checked}`);
    setShowBillingAddress(checked);
    if (checked) {
      // Initialize separate billing address and names
      setFormData(prev => ({
        ...prev,
        billing_address: {
          street: "",
          postal_code: "",
          city: "",
        },
        billing_first_name: "",
        billing_last_name: "",
      }));
      logger.dev("Initialized separate billing address and names");
    } else {
      // Copy delivery address and names to billing
      setFormData(prev => ({
        ...prev,
        billing_address: {
          street: prev.delivery_address.street,
          postal_code: prev.delivery_address.postal_code,
          city: prev.delivery_address.city,
        },
        billing_first_name: prev.first_name,
        billing_last_name: prev.last_name,
      }));
      logger.dev("Copied delivery address and names to billing");
    }
  };

  const handleStepComplete = (step: string) => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
  };

  const handleTermsAccepted = (accepted: boolean) => {
    setTermsAccepted(accepted);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Immediate feedback
    setSubmissionStarted(true);
    
    // Show immediate toast for better UX - now using translated text
    toast({
      title: getTranslation("processing_order", language),
      description: getTranslation("processing_order_message", language),
    });
    
    if (!token) {
      logger.error("Order submission attempted without token");
      toast({
        title: getTranslation("order_error", language),
        description: getTranslation("checkout_token_missing", language),
        variant: "destructive",
      });
      setSubmissionStarted(false);
      return;
    }

    if (!termsAccepted) {
      toast({
        title: getTranslation("order_error", language),
        description: getTranslation("terms_required", language),
        variant: "destructive",
      });
      setSubmissionStarted(false);
      return;
    }

    // Log form data before validation
    logger.dev("Form data before submission:", {
      formData,
      showBillingAddress,
      deliveryAddress: formData.delivery_address,
      billingAddress: formData.billing_address,
      billingNames: { first_name: formData.billing_first_name, last_name: formData.billing_last_name }
    });

    const formValues: FormValues = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      street: formData.delivery_address.street,
      postal_code: formData.delivery_address.postal_code,
      city: formData.delivery_address.city,
      billing_street: formData.billing_address?.street,
      billing_postal_code: formData.billing_address?.postal_code,
      billing_city: formData.billing_address?.city,
      billing_first_name: formData.billing_first_name,
      billing_last_name: formData.billing_last_name,
    };

    logger.dev("Form values for validation:", formValues);

    const isValid = validateForm(formValues, showBillingAddress);
    
    if (!isValid) {
      logger.warn("Form validation failed during submission");
      toast({
        title: getTranslation("order_error", language),
        description: getTranslation("order_error_message", language),
        variant: "destructive",
      });
      setSubmissionStarted(false);
      return;
    }

    setIsSubmitting(true);
    logger.info("Submitting order with billing address and name data:", {
      deliveryAddress: formData.delivery_address,
      billingAddress: formData.billing_address,
      billingNames: { first_name: formData.billing_first_name, last_name: formData.billing_last_name },
      showBillingAddress
    });

    try {
      const startTime = performance.now();
      const orderResponse = await submitOrder(formData, orderData, token);
      const endTime = performance.now();
      
      logger.info(`Order submitted successfully in ${Math.round(endTime - startTime)}ms`);
      
      // Store order confirmation data including captured shop URL
      const confirmationData = {
        orderResponse,
        customerData: formData,
        orderData,
        shopConfig,
        capturedShopUrl,
        submittedAt: new Date().toISOString()
      };
      
      sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmationData));
      
      // Show success feedback immediately
      toast({
        title: getTranslation("order_success", language),
        description: getTranslation("order_success_message", language),
        action: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      });
      
      // Shorter delay for better UX
      setTimeout(() => {
        window.location.href = '/confirmation';
      }, 1000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Order submission failed", { error: errorMessage });
      
      if (errorMessage === "CORS_ERROR") {
        toast({
          title: "Verbindungsfehler (CORS)",
          description: "Die Verbindung zum Server wurde durch Browser-Sicherheitsrichtlinien blockiert. Dies ist ein CORS-Problem. Bitte kontaktieren Sie den Support.",
          variant: "destructive",
        });
      } else if (errorMessage === "TOKEN_EXPIRED") {
        toast({
          title: getTranslation("order_error", language),
          description: "Der Checkout-Link ist abgelaufen. Sie werden zur Startseite weitergeleitet.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else if (errorMessage.startsWith("VALIDATION_ERROR")) {
        toast({
          title: getTranslation("order_error", language),
          description: "Die eingegebenen Daten sind ungültig. Bitte überprüfen Sie Ihre Eingaben.",
          variant: "destructive",
        });
      } else if (errorMessage.startsWith("SERVER_ERROR")) {
        toast({
          title: getTranslation("order_error", language),
          description: "Es gibt ein Problem mit dem Server. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      } else if (errorMessage === "NETWORK_ERROR") {
        toast({
          title: getTranslation("order_error", language),
          description: "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
          variant: "destructive",
        });
      } else {
        toast({
          title: getTranslation("order_error", language),
          description: "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      setSubmissionStarted(false);
    }
  };

  const allStepsCompleted = Object.values(completedSteps).every(Boolean);

  return (
    <div className="space-y-4">
      <div className="px-4 space-y-3 hidden lg:block">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{getTranslation("back", language)}</span>
        </button>
        
        <div className="flex items-center text-sm">
          <span className="text-gray-500">{getTranslation("cart", language)}</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="font-semibold text-gray-900">{getTranslation("information", language)}</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="text-gray-500">{getTranslation("shipping", language)}</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="text-gray-500">{getTranslation("payment", language)}</span>
        </div>
      </div>
      
      <div className={`${isSubmitting ? 'pointer-events-none opacity-60' : ''} ${submissionStarted ? 'animate-pulse' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailCard
            email={formData.email}
            onChange={(email) => handleInputChange("email", email)}
            onComplete={() => handleStepComplete("email")}
            isCompleted={completedSteps.email}
            language={language}
            error={getFieldError("email")}
            onBlur={() => handleFieldBlur("email")}
          />

          <ContactDeliveryCard
            firstName={formData.first_name}
            lastName={formData.last_name}
            phone={formData.phone}
            street={formData.delivery_address.street}
            postalCode={formData.delivery_address.postal_code}
            city={formData.delivery_address.city}
            onChange={handleInputChange}
            onComplete={() => {
              handleStepComplete("contact");
              handleStepComplete("delivery");
            }}
            isCompleted={completedSteps.contact && completedSteps.delivery}
            language={language}
            firstNameError={getFieldError("first_name")}
            lastNameError={getFieldError("last_name")}
            phoneError={getFieldError("phone")}
            streetError={getFieldError("delivery_address.street")}
            postalCodeError={getFieldError("delivery_address.postal_code")}
            cityError={getFieldError("delivery_address.city")}
            onFirstNameBlur={() => handleFieldBlur("first_name")}
            onLastNameBlur={() => handleFieldBlur("last_name")}
            onPhoneBlur={() => handleFieldBlur("phone")}
            onStreetBlur={() => handleFieldBlur("delivery_address.street")}
            onPostalCodeBlur={() => handleFieldBlur("delivery_address.postal_code")}
            onCityBlur={() => handleFieldBlur("delivery_address.city")}
          />

          <BillingAddressCard
            showBillingAddress={showBillingAddress}
            firstName={formData.billing_first_name || ""}
            lastName={formData.billing_last_name || ""}
            street={formData.billing_address?.street || ""}
            postalCode={formData.billing_address?.postal_code || ""}
            city={formData.billing_address?.city || ""}
            onToggle={handleBillingAddressToggle}
            onChange={handleInputChange}
            onComplete={() => handleStepComplete("billing")}
            isCompleted={completedSteps.billing}
            language={language}
            firstNameError={getFieldError("billing_address.first_name")}
            lastNameError={getFieldError("billing_address.last_name")}
            streetError={getFieldError("billing_address.street")}
            postalCodeError={getFieldError("billing_address.postal_code")}
            cityError={getFieldError("billing_address.city")}
            onFirstNameBlur={() => handleFieldBlur("billing_address.first_name")}
            onLastNameBlur={() => handleFieldBlur("billing_address.last_name")}
            onStreetBlur={() => handleFieldBlur("billing_address.street")}
            onPostalCodeBlur={() => handleFieldBlur("billing_address.postal_code")}
            onCityBlur={() => handleFieldBlur("billing_address.city")}
          />

          {shopConfig?.payment_methods && shopConfig.payment_methods.length > 1 && (
            <PaymentMethodCard
              paymentMethod={formData.payment_method}
              paymentMethods={shopConfig.payment_methods}
              onChange={(method) => handleInputChange("payment_method", method)}
              onComplete={() => handleStepComplete("payment")}
              isCompleted={completedSteps.payment}
              language={language}
            />
          )}

          <TermsCard
            termsAccepted={termsAccepted}
            onChange={handleTermsAccepted}
            isCompleted={completedSteps.terms}
            isSubmitting={isSubmitting}
            allStepsCompleted={allStepsCompleted}
            accentColor={accentColor}
            language={language}
          />
        </form>
      </div>
    </div>
  );
};
