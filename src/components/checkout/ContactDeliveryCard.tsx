
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin, Check, Sparkles, Home } from "lucide-react";

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
    
    // Check completion based on which field was updated
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
        ? "ring-2 ring-blue-500 ring-opacity-50 shadow-xl scale-[1.01]" 
        : "hover:shadow-lg"
    } ${isCompleted ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-br from-orange-50 via-white to-pink-50"}`}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full -translate-y-20 translate-x-20 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full translate-y-16 -translate-x-16 blur-xl"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              isCompleted 
                ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg" 
                : "bg-gradient-to-br from-orange-400 to-pink-500 shadow-md"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Lieferadresse
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                <Home className="h-3 w-3 text-orange-500" />
                Wohin soll das Heizöl geliefert werden?
              </div>
            </div>
          </div>
          {isCompleted && (
            <span className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold animate-pulse">
              ✨ Komplett!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-8">
          {/* Personal Data Section */}
          <div className="relative">
            <div className="absolute -left-2 -top-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20"></div>
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-500" />
              Persönliche Daten
            </h4>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="first_name" className="text-sm font-semibold text-gray-800 mb-2 block">
                    Dein Vorname *
                  </Label>
                  <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 text-base font-medium bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                    placeholder="Anna"
                  />
                </div>
                
                <div className="group">
                  <Label htmlFor="last_name" className="text-sm font-semibold text-gray-800 mb-2 block">
                    Dein Nachname *
                  </Label>
                  <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 text-base font-medium bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                    placeholder="Müller"
                  />
                </div>
              </div>
              
              <div className="group">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-800 mb-2 block">
                  Deine Telefonnummer *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 text-base font-medium bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                    placeholder="0173 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="relative">
            <div className="absolute -left-2 -top-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-20"></div>
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-orange-500" />
              Lieferadresse
            </h4>
            <div className="space-y-5">
              <div className="group">
                <Label htmlFor="delivery_street" className="text-sm font-semibold text-gray-800 mb-2 block">
                  Straße und Hausnummer *
                </Label>
                <Input
                  id="delivery_street"
                  value={street}
                  onChange={(e) => handleChange("delivery_address.street", e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                  className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 text-base font-medium bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                  placeholder="Bergmannstraße 42"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="delivery_postal_code" className="text-sm font-semibold text-gray-800 mb-2 block">
                    Postleitzahl *
                  </Label>
                  <Input
                    id="delivery_postal_code"
                    value={postalCode}
                    onChange={(e) => handleChange("delivery_address.postal_code", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 text-base font-medium bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                    placeholder="10961"
                  />
                </div>
                
                <div className="group">
                  <Label htmlFor="delivery_city" className="text-sm font-semibold text-gray-800 mb-2 block">
                    Stadt *
                  </Label>
                  <Input
                    id="delivery_city"
                    value={city}
                    onChange={(e) => handleChange("delivery_address.city", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 text-base font-medium bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                    placeholder="Berlin"
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
