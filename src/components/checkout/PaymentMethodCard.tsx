
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Check } from "lucide-react";

interface PaymentMethodCardProps {
  paymentMethod: "vorkasse" | "rechnung";
  paymentMethods: string[];
  onChange: (method: "vorkasse" | "rechnung") => void;
  onComplete: () => void;
  isCompleted: boolean;
  getTranslation: (key: string) => string;
}

export const PaymentMethodCard = ({ 
  paymentMethod, 
  paymentMethods, 
  onChange, 
  onComplete,
  isCompleted,
  getTranslation 
}: PaymentMethodCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (value: "vorkasse" | "rechnung") => {
    onChange(value);
    onComplete();
  };

  if (!paymentMethods || paymentMethods.length <= 1) {
    return null;
  }

  return (
    <Card className={`transition-all duration-200 ${focused ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : "bg-gray-100"}`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <CreditCard className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <span>{getTranslation("payment_method")}</span>
          </div>
          {isCompleted && (
            <span className="text-sm text-green-600 font-medium">✓ Abgeschlossen</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={paymentMethod}
          onValueChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="space-y-3"
        >
          {paymentMethods.map((method) => (
            <div key={method} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem 
                value={method} 
                id={method}
                className="border-gray-300"
              />
              <Label htmlFor={method} className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                {getTranslation(method)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
