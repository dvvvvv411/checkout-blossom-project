
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin, Check, Building, AlertCircle } from "lucide-react";
import { getTranslation } from "@/utils/translations";

interface ContactDeliveryCardProps {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  onChange: (field: string, value: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
  language?: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
  // Error props
  firstNameError?: string;
  lastNameError?: string;
  phoneError?: string;
  streetError?: string;
  postalCodeError?: string;
  cityError?: string;
  // Blur handlers
  onFirstNameBlur?: () => void;
  onLastNameBlur?: () => void;
  onPhoneBlur?: () => void;
  onStreetBlur?: () => void;
  onPostalCodeBlur?: () => void;
  onCityBlur?: () => void;
}

export const ContactDeliveryCard = ({ 
  firstName, 
  lastName, 
  phone, 
  street, 
  postalCode, 
  city, 
  onChange, 
  onComplete, 
  isCompleted,
  language = "DE",
  firstNameError,
  lastNameError,
  phoneError,
  streetError,
  postalCodeError,
  cityError,
  onFirstNameBlur,
  onLastNameBlur,
  onPhoneBlur,
  onStreetBlur,
  onPostalCodeBlur,
  onCityBlur
}: ContactDeliveryCardProps) => {
  const [focused, setFocused] = useState(false);

  // Check if any field has an error
  const hasErrors = !!(firstNameError || lastNameError || phoneError || streetError || postalCodeError || cityError);

  const checkCompletion = (
    updatedFirstName?: string, 
    updatedLastName?: string, 
    updatedPhone?: string,
    updatedStreet?: string,
    updatedPostalCode?: string,
    updatedCity?: string
  ) => {
    const fName = updatedFirstName ?? firstName;
    const lName = updatedLastName ?? lastName;
    const phoneNumber = updatedPhone ?? phone;
    const streetValue = updatedStreet ?? street;
    const postalCodeValue = updatedPostalCode ?? postalCode;
    const cityValue = updatedCity ?? city;
    
    if (fName && lName && phoneNumber && streetValue && postalCodeValue && cityValue) {
      onComplete();
    }
  };

  const handleChange = (field: string, value: string) => {
    onChange(field, value);
    
    if (field === "first_name") {
      checkCompletion(value, lastName, phone, street, postalCode, city);
    } else if (field === "last_name") {
      checkCompletion(firstName, value, phone, street, postalCode, city);
    } else if (field === "phone") {
      checkCompletion(firstName, lastName, value, street, postalCode, city);
    } else if (field === "delivery_address.street") {
      checkCompletion(firstName, lastName, phone, value, postalCode, city);
    } else if (field === "delivery_address.postal_code") {
      checkCompletion(firstName, lastName, phone, street, value, city);
    } else if (field === "delivery_address.city") {
      checkCompletion(firstName, lastName, phone, street, postalCode, value);
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      focused 
        ? "ring-2 ring-blue-500 ring-opacity-30 shadow-lg" 
        : "hover:shadow-md"
    } ${
      hasErrors
        ? "bg-gradient-to-br from-red-50 to-white border-red-300"
        : isCompleted 
          ? "bg-gradient-to-br from-green-50 to-white border-green-300" 
          : "bg-white border-gray-200"
    }`}>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg transition-all duration-300 ${
              hasErrors
                ? "bg-red-600 shadow-sm"
                : isCompleted 
                  ? "bg-green-600 shadow-sm" 
                  : "bg-blue-400 shadow-sm"
            }`}>
              {hasErrors ? (
                <AlertCircle className="h-5 w-5 text-white" />
              ) : isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <MapPin className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {getTranslation("delivery_address", language)}
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Building className="h-3 w-3 text-gray-500" />
                {getTranslation("delivery_description", language)}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Personal Data Section */}
          <div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-2 block">
                    {getTranslation("first_name", language)} *
                  </Label>
                  <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false);
                      onFirstNameBlur?.();
                    }}
                    required
                    className={`h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white ${
                      firstNameError 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-300"
                    }`}
                    placeholder={getTranslation("first_name_placeholder", language)}
                  />
                  {firstNameError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {firstNameError}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">
                    {getTranslation("last_name", language)} *
                  </Label>
                  <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false);
                      onLastNameBlur?.();
                    }}
                    required
                    className={`h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white ${
                      lastNameError 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-300"
                    }`}
                    placeholder={getTranslation("last_name_placeholder", language)}
                  />
                  {lastNameError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {lastNameError}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("phone_number", language)} *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false);
                      onPhoneBlur?.();
                    }}
                    required
                    className={`pl-10 h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white ${
                      phoneError 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-300"
                    }`}
                    placeholder={getTranslation("phone_placeholder", language)}
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {phoneError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="delivery_street" className="text-sm font-medium text-gray-700 mb-2 block">
                  {getTranslation("street_house_number", language)} *
                </Label>
                <Input
                  id="delivery_street"
                  value={street}
                  onChange={(e) => handleChange("delivery_address.street", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    setFocused(false);
                    onStreetBlur?.();
                  }}
                  required
                  className={`h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white ${
                    streetError 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300"
                  }`}
                  placeholder={getTranslation("street_placeholder", language)}
                />
                {streetError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {streetError}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delivery_postal_code" className="text-sm font-medium text-gray-700 mb-2 block">
                    {getTranslation("postal_code", language)} *
                  </Label>
                  <Input
                    id="delivery_postal_code"
                    value={postalCode}
                    onChange={(e) => handleChange("delivery_address.postal_code", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false);
                      onPostalCodeBlur?.();
                    }}
                    required
                    className={`h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white ${
                      postalCodeError 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-300"
                    }`}
                    placeholder={getTranslation("postal_code_placeholder", language)}
                  />
                  {postalCodeError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {postalCodeError}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="delivery_city" className="text-sm font-medium text-gray-700 mb-2 block">
                    {getTranslation("city", language)} *
                  </Label>
                  <Input
                    id="delivery_city"
                    value={city}
                    onChange={(e) => handleChange("delivery_address.city", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false);
                      onCityBlur?.();
                    }}
                    required
                    className={`h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white ${
                      cityError 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-300"
                    }`}
                    placeholder={getTranslation("city_placeholder", language)}
                  />
                  {cityError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {cityError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
