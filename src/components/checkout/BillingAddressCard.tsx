
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { MapPin, Check } from "lucide-react";

interface BillingAddressCardProps {
  showBillingAddress: boolean;
  street: string;
  postalCode: string;
  city: string;
  onToggle: (checked: boolean) => void;
  onChange: (field: string, value: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export const BillingAddressCard = ({ 
  showBillingAddress, 
  street, 
  postalCode, 
  city, 
  onToggle, 
  onChange, 
  onComplete,
  isCompleted 
}: BillingAddressCardProps) => {
  const [focused, setFocused] = useState(false);

  const checkCompletion = (updatedStreet?: string, updatedPostalCode?: string, updatedCity?: string) => {
    if (!showBillingAddress) {
      onComplete();
      return;
    }
    
    const streetValue = updatedStreet ?? street;
    const postalCodeValue = updatedPostalCode ?? postalCode;
    const cityValue = updatedCity ?? city;
    
    if (streetValue && postalCodeValue && cityValue) {
      onComplete();
    }
  };

  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    if (!checked) {
      onComplete();
    }
  };

  const handleChange = (field: string, value: string) => {
    onChange(field, value);
    if (field === "billing_address.street") {
      checkCompletion(value, postalCode, city);
    } else if (field === "billing_address.postal_code") {
      checkCompletion(street, value, city);
    } else if (field === "billing_address.city") {
      checkCompletion(street, postalCode, value);
    }
  };

  return (
    <Card className={`transition-all duration-200 ${focused ? "ring-2 ring-blue-500 ring-opacity-50" : ""} ${isCompleted ? "border-green-500" : ""}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : "bg-gray-100"}`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <MapPin className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <span>Rechnungsadresse</span>
          </div>
          {isCompleted && (
            <span className="text-sm text-green-600 font-medium">✓ Abgeschlossen</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 mb-4">
          <Checkbox
            id="billing_different"
            checked={showBillingAddress}
            onCheckedChange={handleToggle}
            className="border-gray-300"
          />
          <Label htmlFor="billing_different" className="text-sm font-medium text-gray-700">
            Rechnungsadresse abweichend
          </Label>
        </div>

        <Collapsible open={showBillingAddress}>
          <CollapsibleContent className="space-y-4">
            <div>
              <Label htmlFor="billing_street" className="text-sm font-medium text-gray-700 mb-2 block">
                Straße und Hausnummer *
              </Label>
              <Input
                id="billing_street"
                value={street}
                onChange={(e) => handleChange("billing_address.street", e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required={showBillingAddress}
                className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                placeholder="Rechnungsstraße 456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing_postal_code" className="text-sm font-medium text-gray-700 mb-2 block">
                  Postleitzahl *
                </Label>
                <Input
                  id="billing_postal_code"
                  value={postalCode}
                  onChange={(e) => handleChange("billing_address.postal_code", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required={showBillingAddress}
                  className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                  placeholder="54321"
                />
              </div>
              
              <div>
                <Label htmlFor="billing_city" className="text-sm font-medium text-gray-700 mb-2 block">
                  Stadt *
                </Label>
                <Input
                  id="billing_city"
                  value={city}
                  onChange={(e) => handleChange("billing_address.city", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required={showBillingAddress}
                  className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                  placeholder="Hamburg"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
