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
import { Shield, ShieldCheck } from "lucide-react";

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
    <div className="space-y-6">
      {/* SSL Security Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-green-800">SSL-gesicherte Verbindung</div>
            <p className="text-green-700 text-sm">Ihre Daten werden sicher übertragen und verarbeitet</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Button
            type="submit"
            className={`w-full h-14 text-white font-semibold text-lg rounded-lg transition-all duration-200 disabled:opacity-50 ${
              allStepsCompleted ? "shadow-lg hover:shadow-xl" : ""
            }`}
            disabled={isSubmitting || !allStepsCompleted}
            style={{ 
              backgroundColor: allStepsCompleted ? accentColor : "#6b7280",
              color: "white"
            }}
          >
            {isSubmitting ? "Bestellung wird verarbeitet..." : getTranslation("submit")}
          </Button>
          
          <p className="text-sm text-gray-600 text-center mt-3">
            Mit dem Abschließen der Bestellung stimmen Sie unseren AGB zu.
          </p>
        </div>
      </form>
    </div>
  );
};
