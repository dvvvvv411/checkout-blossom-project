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
import { ArrowLeft } from "lucide-react";
import { useFormValidation, FormValues } from "@/hooks/useFormValidation";
import { getTranslation } from "@/utils/translations";
import { getSupportedLanguage } from "@/lib/utils";

interface CustomerFormProps {
  orderData: OrderData;
  shopConfig?: ShopConfig;
  accentColor: string;
  showMobileNavigation?: boolean;
}

export const CustomerForm = ({ orderData, shopConfig, accentColor, showMobileNavigation = true }: CustomerFormProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const supportedLanguage = getSupportedLanguage(shopConfig?.language);
  
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
    payment_method: "vorkasse",
  });

  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  } = useFormValidation(supportedLanguage);

  // Auto-copy delivery address to billing address when billing address is not shown separately
  useEffect(() => {
    if (!showBillingAddress) {
      console.log("=== AUTO-COPYING DELIVERY TO BILLING ===");
      console.log("Delivery address:", formData.delivery_address);
      
      setFormData(prev => ({
        ...prev,
        billing_address: {
          street: prev.delivery_address.street,
          postal_code: prev.delivery_address.postal_code,
          city: prev.delivery_address.city,
        },
      }));
    }
  }, [showBillingAddress, formData.delivery_address]);

  // Check step completion whenever form data changes
  useEffect(() => {
    const newCompletedSteps = {
      email: !!formData.email && formData.email.includes("@") && formData.email.includes("."),
      contact: !!(formData.first_name && formData.last_name && formData.phone),
      delivery: !!(formData.delivery_address.street && formData.delivery_address.postal_code && formData.delivery_address.city),
      billing: !showBillingAddress || !!(formData.billing_address?.street && formData.billing_address?.postal_code && formData.billing_address?.city),
      payment: true, // Payment is always completed since we have default values
      terms: termsAccepted,
    };
    
    console.log("=== STEP COMPLETION CHECK ===");
    console.log("Form data:", formData);
    console.log("Show billing address:", showBillingAddress);
    console.log("Terms accepted:", termsAccepted);
    console.log("Completed steps:", newCompletedSteps);
    
    setCompletedSteps(newCompletedSteps);
  }, [formData, showBillingAddress, termsAccepted]);

  // Automatisch erste Zahlungsmethode auswählen wenn verfügbar
  useEffect(() => {
    if (shopConfig?.payment_methods && shopConfig.payment_methods.length > 0 && !formData.payment_method) {
      setFormData(prev => ({
        ...prev,
        payment_method: shopConfig.payment_methods[0] as "vorkasse" | "rechnung"
      }));
    }
  }, [shopConfig?.payment_methods, formData.payment_method]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`=== INPUT CHANGE: ${field} = ${value} ===`);
    
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
      setFormData(prev => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear any existing error for this field
    clearFieldError(field);
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field);
    const value = getFieldValue(field);
    const error = validateField(field.replace("delivery_address.", "").replace("billing_address.", ""), value, showBillingAddress);
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
      return formData.billing_address?.[addressField] || "";
    } else {
      return formData[field] || "";
    }
  };

  const handleBillingAddressToggle = (checked: boolean) => {
    console.log("=== BILLING ADDRESS TOGGLE ===", checked);
    setShowBillingAddress(checked);
    if (checked) {
      // Initialize with empty billing address for separate input
      setFormData(prev => ({
        ...prev,
        billing_address: {
          street: "",
          postal_code: "",
          city: "",
        },
      }));
    }
    // The useEffect above will handle copying delivery address when checked becomes false
  };

  const handleStepComplete = (step: string) => {
    console.log(`=== STEP COMPLETED: ${step} ===`);
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
  };

  const handleTermsAccepted = (accepted: boolean) => {
    console.log("=== CUSTOMER FORM: Terms accepted changed ===", accepted);
    setTermsAccepted(accepted);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Helper function to get compatible language for TermsCard
  const getTermsLanguage = (lang: typeof supportedLanguage): "DE" | "EN" | "FR" => {
    if (lang === "DE" || lang === "EN" || lang === "FR") {
      return lang;
    }
    // Fallback to German for unsupported languages in TermsCard
    return "DE";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("=== CUSTOMER FORM: handleSubmit called ===");
    e.preventDefault();
    
    console.log("=== FORM SUBMISSION START ===");
    console.log("Token:", token);
    console.log("Terms accepted:", termsAccepted);
    console.log("Form data:", formData);
    console.log("All steps completed:", allStepsCompleted);
    console.log("Completed steps:", completedSteps);
    
    if (!token) {
      console.error("Token missing");
      toast({
        title: getTranslation("order_error", supportedLanguage),
        description: getTranslation("checkout_token_missing", supportedLanguage),
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      console.error("Terms not accepted");
      toast({
        title: getTranslation("order_error", supportedLanguage),
        description: getTranslation("terms_required", supportedLanguage),
        variant: "destructive",
      });
      return;
    }

    // Vollständige Formvalidierung
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
    };

    console.log("=== FORM VALIDATION ===");
    console.log("Form values:", formValues);
    console.log("Show billing address:", showBillingAddress);
    
    const isValid = validateForm(formValues, showBillingAddress);
    
    if (!isValid) {
      console.error("Form validation failed");
      console.error("Validation errors:", errors);
      toast({
        title: getTranslation("order_error", supportedLanguage),
        description: getTranslation("order_error_message", supportedLanguage),
        variant: "destructive",
      });
      return;
    }

    console.log("Form validation passed");
    setIsSubmitting(true);

    try {
      console.log("=== API SUBMISSION START ===");
      
      const orderResponse = await submitOrder(formData, orderData, token);
      
      console.log("=== API SUBMISSION SUCCESS ===");
      console.log("Order response:", orderResponse);
      
      toast({
        title: getTranslation("order_success", supportedLanguage),
        description: getTranslation("order_success_message", supportedLanguage),
      });
      
      // Zur Bestätigungsseite weiterleiten
      setTimeout(() => {
        window.location.href = '/confirmation';
      }, 1500);
      
    } catch (error) {
      console.error("=== API SUBMISSION ERROR ===");
      console.error("Order submission failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error message:", errorMessage);
      
      if (errorMessage === "CORS_ERROR") {
        console.error("CORS error detected");
        toast({
          title: "Verbindungsfehler (CORS)",
          description: "Die Verbindung zum Server wurde durch Browser-Sicherheitsrichtlinien blockiert. Dies ist ein CORS-Problem. Bitte kontaktieren Sie den Support.",
          variant: "destructive",
        });
      } else if (errorMessage === "TOKEN_EXPIRED") {
        console.error("Token expired");
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: "Der Checkout-Link ist abgelaufen. Sie werden zur Startseite weitergeleitet.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else if (errorMessage.startsWith("VALIDATION_ERROR")) {
        console.error("Validation error");
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: "Die eingegebenen Daten sind ungültig. Bitte überprüfen Sie Ihre Eingaben.",
          variant: "destructive",
        });
      } else if (errorMessage.startsWith("SERVER_ERROR")) {
        console.error("Server error");
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: "Es gibt ein Problem mit dem Server. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      } else if (errorMessage === "NETWORK_ERROR") {
        console.error("Network error");
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
          variant: "destructive",
        });
      } else {
        console.error("Unknown error");
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      console.log("=== FORM SUBMISSION END ===");
    }
  };

  const allStepsCompleted = Object.values(completedSteps).every(Boolean);

  console.log("=== CUSTOMER FORM RENDER ===");
  console.log("All steps completed:", allStepsCompleted);
  console.log("Completed steps breakdown:", completedSteps);
  console.log("Terms accepted:", termsAccepted);
  console.log("Is submitting:", isSubmitting);

  return (
    <div className="space-y-4">
      {/* Back Button and Progress Indicator - Show on desktop, hide on mobile since it's at page top */}
      <div className="px-4 space-y-3 hidden lg:block">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{getTranslation("back", supportedLanguage)}</span>
        </button>
        
        <div className="flex items-center text-sm">
          <span className="text-gray-500">{getTranslation("cart", supportedLanguage)}</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="font-semibold text-gray-900">{getTranslation("information", supportedLanguage)}</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="text-gray-500">{getTranslation("shipping", supportedLanguage)}</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="text-gray-500">{getTranslation("payment", supportedLanguage)}</span>
        </div>
      </div>
      
      {/* Formular sperren während Übertragung */}
      <div className={`${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailCard
            email={formData.email}
            onChange={(email) => handleInputChange("email", email)}
            onComplete={() => handleStepComplete("email")}
            isCompleted={completedSteps.email}
            language={supportedLanguage as "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL"}
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
            language={supportedLanguage as "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL"}
            // Pass validation errors
            firstNameError={getFieldError("first_name")}
            lastNameError={getFieldError("last_name")}
            phoneError={getFieldError("phone")}
            streetError={getFieldError("street")}
            postalCodeError={getFieldError("postal_code")}
            cityError={getFieldError("city")}
            // Pass blur handlers
            onFirstNameBlur={() => handleFieldBlur("first_name")}
            onLastNameBlur={() => handleFieldBlur("last_name")}
            onPhoneBlur={() => handleFieldBlur("phone")}
            onStreetBlur={() => handleFieldBlur("street")}
            onPostalCodeBlur={() => handleFieldBlur("postal_code")}
            onCityBlur={() => handleFieldBlur("city")}
          />

          <BillingAddressCard
            showBillingAddress={showBillingAddress}
            street={formData.billing_address?.street || ""}
            postalCode={formData.billing_address?.postal_code || ""}
            city={formData.billing_address?.city || ""}
            onToggle={handleBillingAddressToggle}
            onChange={handleInputChange}
            onComplete={() => handleStepComplete("billing")}
            isCompleted={completedSteps.billing}
            language={supportedLanguage as "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL"}
          />

          {shopConfig?.payment_methods && shopConfig.payment_methods.length > 1 && (
            <PaymentMethodCard
              paymentMethod={formData.payment_method}
              paymentMethods={shopConfig.payment_methods}
              onChange={(method) => handleInputChange("payment_method", method)}
              onComplete={() => handleStepComplete("payment")}
              isCompleted={completedSteps.payment}
              language={supportedLanguage as "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL"}
            />
          )}

          <TermsCard
            termsAccepted={termsAccepted}
            onChange={handleTermsAccepted}
            isCompleted={completedSteps.terms}
            isSubmitting={isSubmitting}
            allStepsCompleted={allStepsCompleted}
            accentColor={accentColor}
            language={supportedLanguage}
          />
        </form>
      </div>
    </div>
  );
};
