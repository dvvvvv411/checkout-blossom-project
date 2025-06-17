
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Check, Clock, FileText, Shield } from "lucide-react";

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

  const getPaymentMethodDetails = (method: string) => {
    const details = {
      vorkasse: {
        description: "Zahlung im Voraus per Überweisung",
        details: "Sie erhalten unsere Bankdaten nach der Bestellung. Nach Zahlungseingang wird Ihre Bestellung bearbeitet.",
        icon: Clock,
        badge: "Sicher"
      },
      rechnung: {
        description: "Kauf auf Rechnung",
        details: "Sie erhalten eine Rechnung mit 14 Tagen Zahlungsziel. Ideal für Geschäftskunden.",
        icon: FileText,
        badge: "Flexibel"
      }
    };
    return details[method] || details.rechnung;
  };

  if (!paymentMethods || paymentMethods.length <= 1) {
    return null;
  }

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
                : "bg-blue-600 shadow-sm"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <CreditCard className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {getTranslation("payment_method")}
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Shield className="h-3 w-3 text-gray-500" />
                Wählen Sie Ihre bevorzugte Zahlungsart
              </div>
            </div>
          </div>
          {isCompleted && (
            <span className="text-sm text-green-700 font-semibold">
              Ausgewählt
            </span>
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
          {paymentMethods.map((method) => {
            const details = getPaymentMethodDetails(method);
            const IconComponent = details.icon;
            const isSelected = paymentMethod === method;
            
            return (
              <div key={method} className={`transition-all duration-200 ${
                isSelected ? "scale-[1.01]" : ""
              }`}>
                <div className={`p-4 border rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? "border-blue-300 bg-blue-50" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={method} 
                      id={method}
                      className="border-2 border-gray-300 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={method} className="flex items-center text-base font-semibold text-gray-900 cursor-pointer">
                          <div className="p-2 rounded-md mr-3 bg-gray-100">
                            <IconComponent className="h-4 w-4 text-gray-600" />
                          </div>
                          {getTranslation(method)}
                        </Label>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 font-medium">
                          {details.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{details.description}</p>
                      {isSelected && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                          <p className="text-sm text-blue-800">{details.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
