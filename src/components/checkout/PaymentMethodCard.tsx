
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Check, Shield } from "lucide-react";
import { getTranslation } from "@/utils/translations";
import { processPaymentMethods, PaymentMethodCode } from "@/utils/paymentMethodUtils";

interface PaymentMethodCardProps {
  paymentMethod: "vorkasse" | "rechnung";
  paymentMethods: string[];
  onChange: (method: "vorkasse" | "rechnung") => void;
  onComplete: () => void;
  isCompleted: boolean;
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
}

export const PaymentMethodCard = ({ 
  paymentMethod, 
  paymentMethods, 
  onChange, 
  onComplete,
  isCompleted,
  language
}: PaymentMethodCardProps) => {
  const [focused, setFocused] = useState(false);

  console.log("PaymentMethodCard - Debug Info:", {
    paymentMethod,
    paymentMethods,
    paymentMethodsLength: paymentMethods?.length,
    paymentMethodsTypes: paymentMethods?.map(m => typeof m),
    language,
    isCompleted
  });

  // Process payment methods using the utility function
  const processedPaymentMethods = processPaymentMethods(paymentMethods || []);

  console.log("Processed payment methods:", processedPaymentMethods);

  // Automatically select first available payment method if none is selected
  useEffect(() => {
    if (processedPaymentMethods.length > 0 && !paymentMethod) {
      const firstMethod = processedPaymentMethods[0].code;
      console.log("Auto-selecting first payment method:", firstMethod);
      onChange(firstMethod);
      onComplete();
    }
  }, [processedPaymentMethods, paymentMethod, onChange, onComplete]);

  const handleChange = (value: string) => {
    console.log("Payment method change:", value);
    if (value === "vorkasse" || value === "rechnung") {
      onChange(value);
      onComplete();
    } else {
      console.warn("Invalid payment method selected:", value);
    }
  };

  const getPaymentMethodDetails = (method: PaymentMethodCode) => {
    console.log("Getting details for payment method:", method);
    
    const details = {
      vorkasse: {
        title: getTranslation("vorkasse", language),
        description: getTranslation("vorkasse_description", language),
        badge: getTranslation("recommended", language)
      },
      rechnung: {
        title: getTranslation("rechnung", language),
        description: getTranslation("rechnung_description", language),
        badge: getTranslation("existing_customers_only", language)
      }
    };
    
    return details[method];
  };

  // Show error state if no payment methods available
  if (!paymentMethods || paymentMethods.length === 0) {
    console.log("No payment methods available");
    return (
      <Card className="border-red-300 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Keine Zahlungsmethoden verfügbar</p>
            <p className="text-sm mt-1">Bitte wenden Sie sich an den Support.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show processing state if no valid methods after processing
  if (processedPaymentMethods.length === 0) {
    console.log("No valid payment methods after processing");
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardContent className="p-6">
          <div className="text-center text-yellow-700">
            <p className="font-medium">Zahlungsmethoden werden verarbeitet...</p>
            <p className="text-sm mt-1">Rohdaten: {paymentMethods.join(", ")}</p>
            <p className="text-xs mt-2 text-gray-600">
              Unterstützte Methoden: Vorkasse/Überweisung, Kauf auf Rechnung
            </p>
          </div>
        </CardContent>
      </Card>
    );
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
                {getTranslation("payment_method", language)}
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Shield className="h-3 w-3 text-gray-500" />
                {getTranslation("payment_description", language)}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Debug info for development */}
        <div className="mb-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div>Verfügbare Zahlungsarten: {processedPaymentMethods.length} von {paymentMethods.length}</div>
          <div className="mt-1">Aktuell gewählt: {paymentMethod || "Keine Auswahl"}</div>
        </div>
        
        <RadioGroup
          value={paymentMethod}
          onValueChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="space-y-3"
        >
          {processedPaymentMethods.map((methodInfo, index) => {
            const details = getPaymentMethodDetails(methodInfo.code);
            const isSelected = paymentMethod === methodInfo.code;
            
            console.log("Rendering payment method:", { 
              original: methodInfo.original,
              code: methodInfo.code,
              isSelected,
              displayName: methodInfo.displayName
            });
            
            return (
              <div key={`${methodInfo.code}-${index}`} className={`transition-all duration-200 ${
                isSelected ? "scale-[1.01]" : ""
              }`}>
                <div className={`p-4 border rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? "border-green-300 bg-gradient-to-tl from-green-25 to-white" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={methodInfo.code} 
                      id={`${methodInfo.code}-${index}`}
                      className="border-2 border-gray-300 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={`${methodInfo.code}-${index}`} className="flex items-center text-base font-semibold text-gray-900 cursor-pointer">
                          {details.title}
                        </Label>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          details.badge === getTranslation("recommended", language)
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {details.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{details.description}</p>
                      {/* Debug info */}
                      <p className="text-xs text-gray-400">
                        Original: {String(methodInfo.original)} → Code: {methodInfo.code}
                      </p>
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
