
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Check, Shield } from "lucide-react";
import { getTranslation } from "@/utils/translations";

interface PaymentMethodCardProps {
  paymentMethod: "vorkasse" | "rechnung";
  paymentMethods: string[];
  onChange: (method: "vorkasse" | "rechnung") => void;
  onComplete: () => void;
  isCompleted: boolean;
  language?: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
}

export const PaymentMethodCard = ({ 
  paymentMethod, 
  paymentMethods, 
  onChange, 
  onComplete,
  isCompleted,
  language = "DE"
}: PaymentMethodCardProps) => {
  const [focused, setFocused] = useState(false);

  console.log("PaymentMethodCard props:", { paymentMethod, paymentMethods, language });

  // Ensure we have a valid language for getTranslation
  const validLanguage = (language && typeof language === 'string' && 
    ["DE", "EN", "FR", "IT", "ES", "PL", "NL"].includes(language.toUpperCase())) 
    ? language.toUpperCase() as "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL"
    : "DE";

  console.log("PaymentMethodCard using language:", validLanguage);

  // Automatically select first available payment method
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !paymentMethod) {
      // Extract payment method code if it's an object, otherwise use as string
      const firstMethodCode = extractPaymentMethodCode(paymentMethods[0]);
      console.log("Auto-selecting first payment method:", firstMethodCode);
      
      if (isValidPaymentMethod(firstMethodCode)) {
        onChange(firstMethodCode);
        onComplete();
      }
    }
  }, [paymentMethods, paymentMethod, onChange, onComplete]);

  // Helper function to extract payment method code from various formats
  const extractPaymentMethodCode = (method: any): string => {
    if (typeof method === 'string') {
      return method;
    }
    if (typeof method === 'object' && method !== null) {
      // Handle various object structures
      return method.code || method.id || method.type || method.name || String(method);
    }
    return String(method);
  };

  // Type guard to ensure payment method is valid
  const isValidPaymentMethod = (method: string): method is "vorkasse" | "rechnung" => {
    return method === "vorkasse" || method === "rechnung";
  };

  const handleChange = (value: string) => {
    console.log("Payment method change:", value);
    if (isValidPaymentMethod(value)) {
      onChange(value);
      onComplete();
    } else {
      console.warn("Invalid payment method selected:", value);
    }
  };

  const getPaymentMethodDetails = (method: string) => {
    const methodCode = extractPaymentMethodCode(method);
    console.log("Getting details for payment method:", methodCode);
    
    const details = {
      vorkasse: {
        description: getTranslation("vorkasse_description", validLanguage),
        badge: getTranslation("recommended", validLanguage)
      },
      rechnung: {
        description: getTranslation("rechnung_description", validLanguage),
        badge: getTranslation("existing_customers_only", validLanguage)
      }
    };
    
    return details[methodCode as keyof typeof details] || details.rechnung;
  };

  // Don't render if no payment methods or only one method
  if (!paymentMethods || paymentMethods.length <= 1) {
    console.log("Not rendering PaymentMethodCard - insufficient methods:", paymentMethods);
    return null;
  }

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
                <CreditCard className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {getTranslation("payment_method", validLanguage)}
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Shield className="h-3 w-3 text-gray-500" />
                {getTranslation("payment_description", validLanguage)}
              </div>
            </div>
          </div>
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
          {paymentMethods.map((method, index) => {
            const methodCode = extractPaymentMethodCode(method);
            const details = getPaymentMethodDetails(methodCode);
            const isSelected = paymentMethod === methodCode;
            
            console.log("Rendering payment method:", { method, methodCode, isSelected });
            
            return (
              <div key={`${methodCode}-${index}`} className={`transition-all duration-200 ${
                isSelected ? "scale-[1.01]" : ""
              }`}>
                <div className={`p-4 border rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? "border-green-300 bg-gradient-to-tl from-green-25 to-white" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={methodCode} 
                      id={`${methodCode}-${index}`}
                      className="border-2 border-gray-300 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={`${methodCode}-${index}`} className="flex items-center text-base font-semibold text-gray-900 cursor-pointer">
                          {getTranslation(methodCode, validLanguage)}
                        </Label>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          details.badge === getTranslation("recommended", validLanguage)
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {details.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{details.description}</p>
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
