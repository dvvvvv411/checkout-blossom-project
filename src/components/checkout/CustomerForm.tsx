import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { OrderData, ShopConfig, CustomerData, submitOrder } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { User, Mail, Phone, MapPin, CreditCard } from "lucide-react";

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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Kontaktdaten</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                {getTranslation("email")} *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="pl-10 h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  placeholder="ihre@email.de"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("first_name")} *
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  required
                  className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  placeholder="Max"
                />
              </div>
              
              <div>
                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("last_name")} *
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  required
                  className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  placeholder="Mustermann"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                {getTranslation("phone")} *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="pl-10 h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  placeholder="+49 123 456789"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{getTranslation("delivery_address")}</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="delivery_street" className="text-sm font-medium text-gray-700 mb-2 block">
                {getTranslation("street")} *
              </Label>
              <Input
                id="delivery_street"
                value={formData.delivery_address.street}
                onChange={(e) => handleInputChange("delivery_address.street", e.target.value)}
                required
                className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                placeholder="Musterstraße 123"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery_postal_code" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("postal_code")} *
                </Label>
                <Input
                  id="delivery_postal_code"
                  value={formData.delivery_address.postal_code}
                  onChange={(e) => handleInputChange("delivery_address.postal_code", e.target.value)}
                  required
                  className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  placeholder="12345"
                />
              </div>
              
              <div>
                <Label htmlFor="delivery_city" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("city")} *
                </Label>
                <Input
                  id="delivery_city"
                  value={formData.delivery_address.city}
                  onChange={(e) => handleInputChange("delivery_address.city", e.target.value)}
                  required
                  className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  placeholder="Berlin"
                />
              </div>
            </div>
          </div>

          {/* Billing Address Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="billing_different"
                checked={showBillingAddress}
                onCheckedChange={handleBillingAddressToggle}
                className="border-gray-300"
              />
              <Label htmlFor="billing_different" className="text-sm font-medium text-gray-700">
                {getTranslation("billing_different")}
              </Label>
            </div>
          </div>

          {/* Billing Address */}
          <Collapsible open={showBillingAddress}>
            <CollapsibleContent className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">{getTranslation("billing_address")}</h3>
              
              <div>
                <Label htmlFor="billing_street" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("street")} *
                </Label>
                <Input
                  id="billing_street"
                  value={formData.billing_address?.street || ""}
                  onChange={(e) => handleInputChange("billing_address.street", e.target.value)}
                  required={showBillingAddress}
                  className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  placeholder="Rechnungsstraße 456"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billing_postal_code" className="text-sm font-medium text-gray-700 mb-2 block">
                    {getTranslation("postal_code")} *
                  </Label>
                  <Input
                    id="billing_postal_code"
                    value={formData.billing_address?.postal_code || ""}
                    onChange={(e) => handleInputChange("billing_address.postal_code", e.target.value)}
                    required={showBillingAddress}
                    className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                    placeholder="54321"
                  />
                </div>
                
                <div>
                  <Label htmlFor="billing_city" className="text-sm font-medium text-gray-700 mb-2 block">
                    {getTranslation("city")} *
                  </Label>
                  <Input
                    id="billing_city"
                    value={formData.billing_address?.city || ""}
                    onChange={(e) => handleInputChange("billing_address.city", e.target.value)}
                    required={showBillingAddress}
                    className="h-12 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                    placeholder="Hamburg"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Payment Method */}
        {shopConfig?.payment_methods && shopConfig.payment_methods.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{getTranslation("payment_method")}</h2>
            </div>
            
            <RadioGroup
              value={formData.payment_method}
              onValueChange={(value: "vorkasse" | "rechnung") => 
                handleInputChange("payment_method", value)
              }
              className="space-y-3"
            >
              {shopConfig.payment_methods.map((method) => (
                <div key={method} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem 
                    value={method} 
                    id={method}
                    className="border-gray-300"
                  />
                  <Label htmlFor={method} className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                    {getTranslation(method)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Submit Button */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <Button
            type="submit"
            className="w-full h-14 text-white font-semibold text-lg rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
            disabled={isSubmitting}
            style={{ 
              backgroundColor: accentColor,
              color: "white"
            }}
          >
            {isSubmitting ? "Wird verarbeitet..." : getTranslation("submit")}
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Mit dem Abschließen der Bestellung stimmen Sie unseren AGB zu.
          </p>
        </div>
      </form>
    </div>
  );
};
