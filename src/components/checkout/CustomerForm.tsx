
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
  const [testMode, setTestMode] = useState(false);
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

  useEffect(() => {
    if (!showBillingAddress) {
      setCompletedSteps(prev => ({ ...prev, billing: true }));
    }
  }, [showBillingAddress]);

  useEffect(() => {
    if (!shopConfig?.payment_methods || shopConfig.payment_methods.length <= 1) {
      setCompletedSteps(prev => ({ ...prev, payment: true }));
    }
  }, [shopConfig]);

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

    // Validierung bei Eingabe
    const error = validateField(field.replace("delivery_address.", "").replace("billing_address.", ""), value, showBillingAddress);
    if (error) {
      setFieldError(field, error);
    } else {
      clearFieldError(field);
    }
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field);
    const value = getFieldValue(field);
    const error = validateField(field.replace("delivery_address.", "").replace("billing_address.", ""), value, showBillingAddress);
    if (error) {
      setFieldError(field, error);
    } else {
      clearFieldError(field);
      // Step als completed markieren wenn kein Fehler
      updateStepCompletion(field);
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

  const updateStepCompletion = (field: string) => {
    if (field === "email") {
      setCompletedSteps(prev => ({ ...prev, email: true }));
    } else if (["first_name", "last_name", "phone"].includes(field)) {
      const contactComplete = formData.first_name && formData.last_name && formData.phone;
      setCompletedSteps(prev => ({ ...prev, contact: !!contactComplete }));
    } else if (field.startsWith("delivery_address.")) {
      const deliveryComplete = formData.delivery_address.street && 
                              formData.delivery_address.postal_code && 
                              formData.delivery_address.city;
      setCompletedSteps(prev => ({ ...prev, delivery: !!deliveryComplete }));
    } else if (field.startsWith("billing_address.")) {
      const billingComplete = !showBillingAddress || 
                             (formData.billing_address?.street && 
                              formData.billing_address?.postal_code && 
                              formData.billing_address?.city);
      setCompletedSteps(prev => ({ ...prev, billing: !!billingComplete }));
    }
  };

  const handleBillingAddressToggle = (checked: boolean) => {
    setShowBillingAddress(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        billing_address: {
          street: "",
          postal_code: "",
          city: "",
        },
      }));
      setCompletedSteps(prev => ({ ...prev, billing: false }));
    } else {
      setFormData(prev => ({
        ...prev,
        billing_address: undefined,
      }));
      setCompletedSteps(prev => ({ ...prev, billing: true }));
    }
  };

  const handleStepComplete = (step: string) => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
  };

  const handleTermsAccepted = (accepted: boolean) => {
    setTermsAccepted(accepted);
    setCompletedSteps(prev => ({ ...prev, terms: accepted }));
  };

  const handleTestModeChange = (enabled: boolean) => {
    setTestMode(enabled);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: getTranslation("order_error", supportedLanguage),
        description: getTranslation("checkout_token_missing", supportedLanguage),
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: getTranslation("order_error", supportedLanguage),
        description: getTranslation("terms_required", supportedLanguage),
        variant: "destructive",
      });
      return;
    }

    // Testmodus: Direkt zur Bestätigungsseite ohne API-Call
    if (testMode) {
      console.log("Testmodus aktiviert - simuliere erfolgreiche Bestellung");
      
      // Simuliere Bestelldaten für Testmodus - IMMER als Manual/Standard Mode
      const mockOrderResponse = {
        order_id: "TEST-" + Date.now(),
        status: "confirmed",
        confirmation_number: "TEST-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        payment_instructions: {
          bank_details: {
            account_holder: "Test Firma GmbH",
            iban: "DE89 3704 0044 0532 0130 00",
            bic: "COBADEFFXXX",
            reference: "TEST-REF-" + Math.random().toString(36).substr(2, 9).toUpperCase()
          }
        },
        total_amount: orderData.total_gross,
        currency: orderData.currency
      };

      // Testdaten in sessionStorage speichern - shopConfig auf manual/standard setzen
      const testShopConfig = {
        ...shopConfig,
        checkout_mode: "standard" // Force standard mode für Testmodus
      };

      sessionStorage.setItem('orderConfirmation', JSON.stringify({
        orderResponse: mockOrderResponse,
        customerData: formData,
        orderData: orderData,
        shopConfig: testShopConfig, // Überschreibe shopConfig für Standard-Modus
        submittedAt: new Date().toISOString()
      }));
      
      toast({
        title: "Testmodus",
        description: "Simulation erfolgreich - weiterleitung zur Bestätigungsseite",
      });
      
      // Zur Bestätigungsseite weiterleiten
      setTimeout(() => {
        window.location.href = '/confirmation';
      }, 1500);
      
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

    const isValid = validateForm(formValues, showBillingAddress);
    
    if (!isValid) {
      toast({
        title: getTranslation("order_error", supportedLanguage),
        description: getTranslation("order_error_message", supportedLanguage),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting order submission...");
      
      const orderResponse = await submitOrder(formData, orderData, token);
      
      console.log("Order submission successful:", orderResponse);
      
      toast({
        title: getTranslation("order_success", supportedLanguage),
        description: getTranslation("order_success_message", supportedLanguage),
      });
      
      // Zur Bestätigungsseite weiterleiten
      setTimeout(() => {
        window.location.href = '/confirmation';
      }, 1500);
      
    } catch (error) {
      console.error("Order submission failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage === "TOKEN_EXPIRED") {
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: getTranslation("token_expired", supportedLanguage),
          variant: "destructive",
        });
        // Nach 3 Sekunden zur Startseite redirecten
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else if (errorMessage.startsWith("VALIDATION_ERROR")) {
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: getTranslation("validation_error", supportedLanguage),
          variant: "destructive",
        });
      } else if (errorMessage.startsWith("SERVER_ERROR")) {
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: getTranslation("server_error", supportedLanguage),
          variant: "destructive",
        });
      } else {
        toast({
          title: getTranslation("order_error", supportedLanguage),
          description: getTranslation("network_error", supportedLanguage),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const allStepsCompleted = Object.values(completedSteps).every(Boolean);

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
            language={supportedLanguage}
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
          />

          {shopConfig?.payment_methods && shopConfig.payment_methods.length > 1 && (
            <PaymentMethodCard
              paymentMethod={formData.payment_method}
              paymentMethods={shopConfig.payment_methods}
              onChange={(method) => handleInputChange("payment_method", method)}
              onComplete={() => handleStepComplete("payment")}
              isCompleted={completedSteps.payment}
              language={supportedLanguage}
            />
          )}

          <TermsCard
            termsAccepted={termsAccepted}
            onChange={handleTermsAccepted}
            isCompleted={completedSteps.terms}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            allStepsCompleted={allStepsCompleted}
            accentColor={accentColor}
            language={supportedLanguage}
            testMode={testMode}
            onTestModeChange={handleTestModeChange}
          />
        </form>
      </div>
    </div>
  );
};
