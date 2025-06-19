
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { MapPin, Building, Check } from "lucide-react";
import { getTranslation } from "@/utils/translations";

interface BillingAddressCardProps {
  showBillingAddress: boolean;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  onToggle: (checked: boolean) => void;
  onChange: (field: string, value: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
  firstNameError?: string;
  lastNameError?: string;
  streetError?: string;
  postalCodeError?: string;
  cityError?: string;
  onFirstNameBlur?: () => void;
  onLastNameBlur?: () => void;
  onStreetBlur?: () => void;
  onPostalCodeBlur?: () => void;
  onCityBlur?: () => void;
}

export const BillingAddressCard = ({ 
  showBillingAddress,
  firstName,
  lastName,
  street, 
  postalCode, 
  city, 
  onToggle, 
  onChange, 
  onComplete,
  isCompleted,
  language,
  firstNameError,
  lastNameError,
  streetError,
  postalCodeError,
  cityError,
  onFirstNameBlur,
  onLastNameBlur,
  onStreetBlur,
  onPostalCodeBlur,
  onCityBlur
}: BillingAddressCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleToggle = (checked: boolean) => {
    console.log("=== BILLING ADDRESS CARD: Toggle checkbox ===", checked);
    // Checkbox is "same address" - so we invert the showBillingAddress logic
    onToggle(!checked);
    if (checked) {
      // If "same address" is checked, billing is automatically completed
      onComplete();
    }
  };

  const handleChange = (field: string, value: string) => {
    console.log(`=== BILLING ADDRESS CARD: Field change ${field} = ${value} ===`);
    onChange(field, value);
    
    // Check if all billing fields are completed when showBillingAddress is true
    if (showBillingAddress) {
      let firstNameValue = firstName;
      let lastNameValue = lastName;
      let streetValue = street;
      let postalCodeValue = postalCode;
      let cityValue = city;
      
      // Update the value that was just changed
      if (field === "billing_address.first_name") firstNameValue = value;
      if (field === "billing_address.last_name") lastNameValue = value;
      if (field === "billing_address.street") streetValue = value;
      if (field === "billing_address.postal_code") postalCodeValue = value;
      if (field === "billing_address.city") cityValue = value;
      
      if (firstNameValue && lastNameValue && streetValue && postalCodeValue && cityValue) {
        console.log("=== BILLING ADDRESS: All fields completed ===");
        onComplete();
      }
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      focused 
        ? "ring-2 ring-yellow-500 ring-opacity-30 shadow-lg" 
        : "hover:shadow-md"
    } ${isCompleted ? "bg-gradient-to-br from-green-50 to-white border-green-300" : "bg-white border-gray-200"}`}>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg transition-all duration-300 ${
              isCompleted 
                ? "bg-green-600 shadow-sm" 
                : "bg-blue-600 shadow-sm"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <MapPin className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {getTranslation("billing_address", language)}
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Building className="h-3 w-3 text-gray-500" />
                {getTranslation("billing_description", language)}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 mb-4">
          <Checkbox
            id="billing_same"
            checked={!showBillingAddress}
            onCheckedChange={handleToggle}
            className="border-gray-300"
          />
          <Label htmlFor="billing_same" className="text-sm font-medium text-gray-700">
            {getTranslation("billing_same_as_delivery", language)}
          </Label>
        </div>

        <Collapsible open={showBillingAddress}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing_first_name" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("first_name", language)} *
                </Label>
                <Input
                  id="billing_first_name"
                  value={firstName}
                  onChange={(e) => handleChange("billing_address.first_name", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    setFocused(false);
                    onFirstNameBlur?.();
                  }}
                  required={showBillingAddress}
                  className={`h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all ${
                    firstNameError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder={getTranslation("first_name_placeholder", language)}
                />
                {firstNameError && (
                  <p className="text-sm text-red-600 mt-1">{firstNameError}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="billing_last_name" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("last_name", language)} *
                </Label>
                <Input
                  id="billing_last_name"
                  value={lastName}
                  onChange={(e) => handleChange("billing_address.last_name", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    setFocused(false);
                    onLastNameBlur?.();
                  }}
                  required={showBillingAddress}
                  className={`h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all ${
                    lastNameError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder={getTranslation("last_name_placeholder", language)}
                />
                {lastNameError && (
                  <p className="text-sm text-red-600 mt-1">{lastNameError}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="billing_street" className="text-sm font-medium text-gray-700 mb-2 block">
                {getTranslation("street_house_number", language)} *
              </Label>
              <Input
                id="billing_street"
                value={street}
                onChange={(e) => handleChange("billing_address.street", e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  onStreetBlur?.();
                }}
                required={showBillingAddress}
                className={`h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all ${
                  streetError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder={getTranslation("street_placeholder", language)}
              />
              {streetError && (
                <p className="text-sm text-red-600 mt-1">{streetError}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing_postal_code" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("postal_code", language)} *
                </Label>
                <Input
                  id="billing_postal_code"
                  value={postalCode}
                  onChange={(e) => handleChange("billing_address.postal_code", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    setFocused(false);
                    onPostalCodeBlur?.();
                  }}
                  required={showBillingAddress}
                  className={`h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all ${
                    postalCodeError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder={getTranslation("postal_code_placeholder", language)}
                />
                {postalCodeError && (
                  <p className="text-sm text-red-600 mt-1">{postalCodeError}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="billing_city" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("city", language)} *
                </Label>
                <Input
                  id="billing_city"
                  value={city}
                  onChange={(e) => handleChange("billing_address.city", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    setFocused(false);
                    onCityBlur?.();
                  }}
                  required={showBillingAddress}
                  className={`h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all ${
                    cityError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder={getTranslation("city_placeholder", language)}
                />
                {cityError && (
                  <p className="text-sm text-red-600 mt-1">{cityError}</p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
