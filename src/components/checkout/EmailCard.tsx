
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Check, Shield } from "lucide-react";

interface EmailCardProps {
  email: string;
  onChange: (email: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export const EmailCard = ({ email, onChange, onComplete, isCompleted }: EmailCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleEmailChange = (value: string) => {
    onChange(value);
    if (value && value.includes("@") && value.includes(".")) {
      onComplete();
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
                : "bg-purple-400 shadow-sm"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <Mail className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                E-Mail-Adresse
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Shield className="h-3 w-3 text-gray-500" />
                Für Bestellbestätigung und Kommunikation
              </div>
            </div>
          </div>
          {isCompleted && (
            <span className="text-sm text-green-700 font-semibold">
              Bestätigt
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
            E-Mail-Adresse *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              className="pl-10 h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-base bg-white"
              placeholder="deine.email@beispiel.de"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
