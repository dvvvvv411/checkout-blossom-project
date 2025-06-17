
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Check } from "lucide-react";

interface ContactCardProps {
  firstName: string;
  lastName: string;
  phone: string;
  onChange: (field: string, value: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export const ContactCard = ({ firstName, lastName, phone, onChange, onComplete, isCompleted }: ContactCardProps) => {
  const [focused, setFocused] = useState(false);

  const checkCompletion = (updatedFirstName?: string, updatedLastName?: string, updatedPhone?: string) => {
    const fName = updatedFirstName ?? firstName;
    const lName = updatedLastName ?? lastName;
    const phoneNumber = updatedPhone ?? phone;
    
    if (fName && lName && phoneNumber) {
      onComplete();
    }
  };

  const handleChange = (field: string, value: string) => {
    onChange(field, value);
    if (field === "first_name") {
      checkCompletion(value, lastName, phone);
    } else if (field === "last_name") {
      checkCompletion(firstName, value, phone);
    } else if (field === "phone") {
      checkCompletion(firstName, lastName, value);
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
                <User className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <span>Persönliche Daten</span>
          </div>
          {isCompleted && (
            <span className="text-sm text-green-600 font-medium">✓ Abgeschlossen</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                placeholder="Max"
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
                className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                placeholder="Mustermann"
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
                className="pl-10 h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                placeholder="+49 123 456789"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
