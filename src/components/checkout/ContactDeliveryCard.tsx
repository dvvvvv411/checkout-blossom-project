
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin, Check, Building } from "lucide-react";

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
  isCompleted 
}: ContactDeliveryCardProps) => {
  const [focused, setFocused] = useState(false);

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
    } ${isCompleted ? "bg-gradient-to-br from-green-50 to-white border-green-300" : "bg-white border-gray-200"}`}>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg transition-all duration-300 ${
              isCompleted 
                ? "bg-green-600 shadow-sm" 
                : "bg-blue-400 shadow-sm"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <MapPin className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Lieferadresse
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Building className="h-3 w-3 text-gray-500" />
                Wohin soll das Heizöl geliefert werden?
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
                    Vorname *
                  </Label>
                  <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white"
                    placeholder="Vorname"
                  />
                </div>
                
                <div>
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nachname *
                  </Label>
                  <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white"
                    placeholder="Nachname"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                  Telefonnummer *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="pl-10 h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white"
                    placeholder="Telefonnummer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div>
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
                  className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white"
                  placeholder="Straße und Hausnummer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delivery_postal_code" className="text-sm font-medium text-gray-700 mb-2 block">
                    PLZ *
                  </Label>
                  <Input
                    id="delivery_postal_code"
                    value={postalCode}
                    onChange={(e) => handleChange("delivery_address.postal_code", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white"
                    placeholder="PLZ"
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
                    className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white"
                    placeholder="Stadt"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
