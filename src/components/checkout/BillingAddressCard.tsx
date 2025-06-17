
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { MapPin, Building } from "lucide-react";

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
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");

  const checkCompletion = (
    updatedFirstName?: string,
    updatedLastName?: string,
    updatedStreet?: string, 
    updatedPostalCode?: string, 
    updatedCity?: string
  ) => {
    if (!showBillingAddress) {
      onComplete();
      return;
    }
    
    const fName = updatedFirstName ?? billingFirstName;
    const lName = updatedLastName ?? billingLastName;
    const streetValue = updatedStreet ?? street;
    const postalCodeValue = updatedPostalCode ?? postalCode;
    const cityValue = updatedCity ?? city;
    
    if (fName && lName && streetValue && postalCodeValue && cityValue) {
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
    if (field === "billing_first_name") {
      setBillingFirstName(value);
      checkCompletion(value, billingLastName, street, postalCode, city);
    } else if (field === "billing_last_name") {
      setBillingLastName(value);
      checkCompletion(billingFirstName, value, street, postalCode, city);
    } else {
      onChange(field, value);
      if (field === "billing_address.street") {
        checkCompletion(billingFirstName, billingLastName, value, postalCode, city);
      } else if (field === "billing_address.postal_code") {
        checkCompletion(billingFirstName, billingLastName, street, value, city);
      } else if (field === "billing_address.city") {
        checkCompletion(billingFirstName, billingLastName, street, postalCode, value);
      }
    }
  };

  return (
    <Card className={`transition-all duration-200 ${focused ? "ring-2 ring-blue-500 ring-opacity-50" : ""} bg-white border-gray-200`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <span>Rechnungsadresse</span>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Building className="h-3 w-3 text-gray-500" />
                Wohin soll die Rechnung gesendet werden?
              </div>
            </div>
          </div>
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
            Rechnungsadresse weicht von Lieferadresse ab
          </Label>
        </div>

        <Collapsible open={showBillingAddress}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing_first_name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Vorname *
                </Label>
                <Input
                  id="billing_first_name"
                  value={billingFirstName}
                  onChange={(e) => handleChange("billing_first_name", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required={showBillingAddress}
                  className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                  placeholder="Vorname"
                />
              </div>
              
              <div>
                <Label htmlFor="billing_last_name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nachname *
                </Label>
                <Input
                  id="billing_last_name"
                  value={billingLastName}
                  onChange={(e) => handleChange("billing_last_name", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required={showBillingAddress}
                  className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                  placeholder="Nachname"
                />
              </div>
            </div>

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
                placeholder="Straße und Hausnummer"
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
                  placeholder="PLZ"
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
                  placeholder="Stadt"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
