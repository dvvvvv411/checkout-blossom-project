
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrderData, ShopConfig, CustomerData, submitOrder } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { EmailCard } from "./EmailCard";
import { ContactDeliveryCard } from "./ContactDeliveryCard";
import { BillingAddressCard } from "./BillingAddressCard";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { TermsCard } from "./TermsCard";
import { Shield, Sparkles, Rocket } from "lucide-react";

interface CustomerFormProps {
  orderData: OrderData;
  shopConfig?: ShopConfig;
  accentColor: string;
}

export const CustomerForm = ({ orderData, shopConfig, accentColor }: CustomerFormProps) => {
  const [searchParams] = useSearchParams();
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
    payment_method: "rechnung",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Fehler",
        description: "Checkout-Token fehlt",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Fehler",
        description: "Bitte bestätigen Sie die Geschäftsbedingungen",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitOrder(formData, token);
      
      toast({
        title: "Bestellung erfolgreich",
        description: "Ihre Bestellung wurde erfolgreich übermittelt.",
      });
      
    } catch (error) {
      console.error("Order submission failed:", error);
      toast({
        title: "Fehler",
        description: "Bei der Bestellübermittlung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTranslation = (key: string) => {
    const translations = {
      DE: {
        email: "E-Mail-Adresse",
        first_name: "Vorname",
        last_name: "Nachname",
        phone: "Telefonnummer",
        delivery_address: "Lieferadresse",
        street: "Straße und Hausnummer",
        postal_code: "Postleitzahl",
        city: "Stadt",
        billing_different: "Rechnungsadresse abweichend",
        billing_address: "Rechnungsadresse",
        payment_method: "Zahlungsart",
        vorkasse: "Vorkasse",
        rechnung: "Rechnung",
        submit: "Bestellung abschließen",
      },
      EN: {
        email: "Email Address",
        first_name: "First Name",
        last_name: "Last Name",
        phone: "Phone Number",
        delivery_address: "Delivery Address",
        street: "Street and House Number",
        postal_code: "Postal Code",
        city: "City",
        billing_different: "Different billing address",
        billing_address: "Billing Address",
        payment_method: "Payment Method",
        vorkasse: "Prepayment",
        rechnung: "Invoice",
        submit: "Complete Order",
      },
      FR: {
        email: "Adresse e-mail",
        first_name: "Prénom",
        last_name: "Nom",
        phone: "Numéro de téléphone",
        delivery_address: "Adresse de livraison",
        street: "Rue et numéro",
        postal_code: "Code postal",
        city: "Ville",
        billing_different: "Adresse de facturation différente",
        billing_address: "Adresse de facturation",
        payment_method: "Mode de paiement",
        vorkasse: "Paiement anticipé",
        rechnung: "Facture",
        submit: "Finaliser la commande",
      },
    };

    const lang = shopConfig?.language || "DE";
    return translations[lang][key] || translations.DE[key];
  };

  const allStepsCompleted = Object.values(completedSteps).every(Boolean);

  return (
    <div className="space-y-8">
      {/* Enhanced SSL Security Message */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-green-800 text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              SSL-gesicherte Verbindung
            </div>
            <p className="text-green-700 font-medium">Deine Daten sind durch modernste Verschlüsselung geschützt</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <EmailCard
          email={formData.email}
          onChange={(email) => handleInputChange("email", email)}
          onComplete={() => handleStepComplete("email")}
          isCompleted={completedSteps.email}
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
            getTranslation={getTranslation}
          />
        )}

        <TermsCard
          termsAccepted={termsAccepted}
          onChange={handleTermsAccepted}
          isCompleted={completedSteps.terms}
        />

        <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16 blur-xl animate-pulse"></div>
          <div className="relative z-10">
            <Button
              type="submit"
              className={`w-full h-16 text-white font-bold text-xl rounded-2xl transition-all duration-300 hover:shadow-2xl disabled:opacity-50 relative overflow-hidden group ${
                allStepsCompleted ? "animate-pulse shadow-xl" : ""
              }`}
              disabled={isSubmitting || !allStepsCompleted}
              style={{ 
                backgroundColor: allStepsCompleted ? accentColor : "#94a3b8",
                color: "white"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-3">
                {allStepsCompleted && !isSubmitting && <Rocket className="h-5 w-5" />}
                {isSubmitting ? "Wird verarbeitet..." : getTranslation("submit")}
                {allStepsCompleted && !isSubmitting && <Sparkles className="h-5 w-5" />}
              </div>
            </Button>
            
            <p className="text-sm text-gray-600 text-center mt-4 font-medium">
              Mit dem Abschließen der Bestellung stimmst du unseren AGB zu.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
