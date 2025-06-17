
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Check } from "lucide-react";

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
    <Card className={`transition-all duration-200 ${focused ? "ring-2 ring-blue-500 ring-opacity-50" : ""} ${isCompleted ? "border-green-500" : ""}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : "bg-gray-100"}`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Mail className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <span>Kontakt</span>
          </div>
          {isCompleted && (
            <span className="text-sm text-green-600 font-medium">✓ Abgeschlossen</span>
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
              className="pl-10 h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
              placeholder="ihre@email.de"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
