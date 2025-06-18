
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeliveryAddressCardProps {
  street: string;
  postalCode: string;
  city: string;
  onChange: (field: string, value: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export const DeliveryAddressCard = ({ street, postalCode, city, onChange, onComplete, isCompleted }: DeliveryAddressCardProps) => {
  const [focused, setFocused] = useState(false);

  const checkCompletion = (updatedStreet?: string, updatedPostalCode?: string, updatedCity?: string) => {
    const streetValue = updatedStreet ?? street;
    const postalCodeValue = updatedPostalCode ?? postalCode;
    const cityValue = updatedCity ?? city;
    
    if (streetValue && postalCodeValue && cityValue) {
      onComplete();
    }
  };

  const handleChange = (field: string, value: string) => {
    onChange(field, value);
    if (field === "delivery_address.street") {
      checkCompletion(value, postalCode, city);
    } else if (field === "delivery_address.postal_code") {
      checkCompletion(street, value, city);
    } else if (field === "delivery_address.city") {
      checkCompletion(street, postalCode, value);
    }
  };

  return (
    <Card className={`transition-all duration-200 ${focused ? "ring-2 ring-blue-500 ring-opacity-50" : ""} ${isCompleted ? "border-green-500" : ""}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="delivery_street" className="text-sm font-medium text-gray-700 mb-2 block">
              Straße und Hausnummer *
            </Label>
            <Input
              id="delivery_street"
              value={street}
              onChange={(e) => handleChange("delivery_address.street", e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
              placeholder="Musterstraße 123"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delivery_postal_code" className="text-sm font-medium text-gray-700 mb-2 block">
                Postleitzahl *
              </Label>
              <Input
                id="delivery_postal_code"
                value={postalCode}
                onChange={(e) => handleChange("delivery_address.postal_code", e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                placeholder="12345"
              />
            </div>
            
            <div>
              <Label htmlFor="delivery_city" className="text-sm font-medium text-gray-700 mb-2 block">
                Stadt *
              </Label>
              <Input
                id="delivery_city"
                value={city}
                onChange={(e) => handleChange("delivery_address.city", e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                placeholder="Berlin"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
