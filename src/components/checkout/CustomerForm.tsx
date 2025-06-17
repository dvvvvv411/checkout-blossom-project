
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { OrderData, ShopConfig, CustomerData, submitOrder } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

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
    } else {
      setFormData(prev => ({
        ...prev,
        billing_address: undefined,
      }));
    }
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

    setIsSubmitting(true);

    try {
      await submitOrder(formData, token);
      
      toast({
        title: "Bestellung erfolgreich",
        description: "Ihre Bestellung wurde erfolgreich übermittelt.",
      });
      
      // Hier könnte eine Weiterleitung zur Bestätigungsseite erfolgen
      
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Kundendaten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kontaktdaten */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">{getTranslation("email")} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="mt-1 focus:ring-2"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">{getTranslation("first_name")} *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  required
                  className="mt-1 focus:ring-2"
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">{getTranslation("last_name")} *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  required
                  className="mt-1 focus:ring-2"
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">{getTranslation("phone")} *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                className="mt-1 focus:ring-2"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Lieferadresse */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{getTranslation("delivery_address")}</h3>
            
            <div>
              <Label htmlFor="delivery_street">{getTranslation("street")} *</Label>
              <Input
                id="delivery_street"
                value={formData.delivery_address.street}
                onChange={(e) => handleInputChange("delivery_address.street", e.target.value)}
                required
                className="mt-1 focus:ring-2"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery_postal_code">{getTranslation("postal_code")} *</Label>
                <Input
                  id="delivery_postal_code"
                  value={formData.delivery_address.postal_code}
                  onChange={(e) => handleInputChange("delivery_address.postal_code", e.target.value)}
                  required
                  className="mt-1 focus:ring-2"
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                />
              </div>
              
              <div>
                <Label htmlFor="delivery_city">{getTranslation("city")} *</Label>
                <Input
                  id="delivery_city"
                  value={formData.delivery_address.city}
                  onChange={(e) => handleInputChange("delivery_address.city", e.target.value)}
                  required
                  className="mt-1 focus:ring-2"
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                />
              </div>
            </div>
          </div>

          {/* Rechnungsadresse Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="billing_different"
              checked={showBillingAddress}
              onCheckedChange={handleBillingAddressToggle}
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            />
            <Label htmlFor="billing_different">{getTranslation("billing_different")}</Label>
          </div>

          {/* Rechnungsadresse */}
          <Collapsible open={showBillingAddress}>
            <CollapsibleContent className="space-y-4">
              <h3 className="text-lg font-medium">{getTranslation("billing_address")}</h3>
              
              <div>
                <Label htmlFor="billing_street">{getTranslation("street")} *</Label>
                <Input
                  id="billing_street"
                  value={formData.billing_address?.street || ""}
                  onChange={(e) => handleInputChange("billing_address.street", e.target.value)}
                  required={showBillingAddress}
                  className="mt-1 focus:ring-2"
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billing_postal_code">{getTranslation("postal_code")} *</Label>
                  <Input
                    id="billing_postal_code"
                    value={formData.billing_address?.postal_code || ""}
                    onChange={(e) => handleInputChange("billing_address.postal_code", e.target.value)}
                    required={showBillingAddress}
                    className="mt-1 focus:ring-2"
                    style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                  />
                </div>
                
                <div>
                  <Label htmlFor="billing_city">{getTranslation("city")} *</Label>
                  <Input
                    id="billing_city"
                    value={formData.billing_address?.city || ""}
                    onChange={(e) => handleInputChange("billing_address.city", e.target.value)}
                    required={showBillingAddress}
                    className="mt-1 focus:ring-2"
                    style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Zahlungsart */}
          {shopConfig?.payment_methods && shopConfig.payment_methods.length > 1 && (
            <div className="space-y-3">
              <Label>{getTranslation("payment_method")}</Label>
              <RadioGroup
                value={formData.payment_method}
                onValueChange={(value: "vorkasse" | "rechnung") => 
                  handleInputChange("payment_method", value)
                }
              >
                {shopConfig.payment_methods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={method} 
                      id={method}
                      style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                    />
                    <Label htmlFor={method}>{getTranslation(method)}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-white font-medium py-3 rounded-md transition-colors"
            disabled={isSubmitting}
            style={{ 
              backgroundColor: accentColor,
              color: "white"
            }}
          >
            {isSubmitting ? "Wird verarbeitet..." : getTranslation("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
