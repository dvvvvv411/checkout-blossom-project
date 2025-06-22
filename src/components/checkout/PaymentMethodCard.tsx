
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Check, Shield, AlertTriangle, Info } from "lucide-react";
import { getTranslation } from "@/utils/translations";
import { processPaymentMethods, PaymentMethodCode } from "@/utils/paymentMethodUtils";
import { logger } from "@/utils/logger";

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

  logger.dev("=== PaymentMethodCard RENDER DEBUG ===");
  logger.dev("PaymentMethodCard rendered with props:", {
    paymentMethod,
    paymentMethods,
    paymentMethodsType: typeof paymentMethods,
    paymentMethodsIsArray: Array.isArray(paymentMethods),
    paymentMethodsLength: paymentMethods?.length,
    paymentMethodsContent: paymentMethods,
    isCompleted,
    language
  });

  // Process payment methods using the utility function
  const processedPaymentMethods = processPaymentMethods(paymentMethods || []);
  
  // Filter out "rechnung" - only allow "vorkasse"
  const availablePaymentMethods = processedPaymentMethods.filter(method => method.code === "vorkasse");
  
  logger.dev("Filtered payment methods (rechnung deactivated):", {
    originalCount: processedPaymentMethods.length,
    filteredCount: availablePaymentMethods.length,
    availableMethods: availablePaymentMethods.map(p => p.code)
  });

  // Automatically select "vorkasse" if available and nothing is selected
  useEffect(() => {
    if (availablePaymentMethods.length > 0 && (!paymentMethod || paymentMethod !== "vorkasse")) {
      logger.dev("Auto-selecting vorkasse (rechnung deactivated)");
      onChange("vorkasse");
      onComplete();
    }
  }, [availablePaymentMethods, paymentMethod, onChange, onComplete]);

  const handleChange = (value: string) => {
    logger.dev("Payment method changed to", value);
    if (value === "vorkasse") {
      onChange(value);
      onComplete();
    } else {
      logger.warn("Invalid payment method selected (rechnung is deactivated)", value);
    }
  };

  const getPaymentMethodDetails = (method: PaymentMethodCode) => {
    const details = {
      vorkasse: {
        title: getTranslation("vorkasse", language),
        description: getTranslation("vorkasse_description", language),
        badge: getTranslation("recommended", language)
      },
      rechnung: {
        title: getTranslation("rechnung", language),
        description: getTranslation("rechnung_description", language) + " (Derzeit nicht verfügbar)",
        badge: "Deaktiviert"
      }
    };
    
    return details[method];
  };

  // Show error state if no payment methods available
  if (!paymentMethods || paymentMethods.length === 0) {
    logger.warn("No payment methods available - showing error state");
    return (
      <Card className="border-red-300 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3" />
            <p className="font-medium">Keine Zahlungsmethoden verfügbar</p>
            <p className="text-sm mt-1">Bitte wenden Sie sich an den Support.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show info if no valid methods after filtering
  if (availablePaymentMethods.length === 0) {
    logger.warn("No valid payment methods after filtering (rechnung deactivated)", {
      input: paymentMethods,
      processed: processedPaymentMethods.length
    });
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardContent className="p-6">
          <div className="text-center text-yellow-700">
            <Info className="h-8 w-8 mx-auto mb-3" />
            <p className="font-medium">Nur Vorkasse verfügbar</p>
            <div className="mt-3 text-sm space-y-2">
              <p>Kauf auf Rechnung ist derzeit deaktiviert.</p>
              <p><strong>Verfügbare Zahlungsart:</strong> Vorkasse (Überweisung)</p>
            </div>
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
        <RadioGroup
          value={paymentMethod}
          onValueChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="space-y-3"
        >
          {/* Available payment methods (only vorkasse) */}
          {availablePaymentMethods.map((methodInfo, index) => {
            const details = getPaymentMethodDetails(methodInfo.code);
            const isSelected = paymentMethod === methodInfo.code;
            
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
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
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

          {/* Grayed out rechnung option */}
          {processedPaymentMethods.some(method => method.code === "rechnung") && (
            <div className="transition-all duration-200 opacity-50">
              <div className="p-4 border rounded-lg border-gray-200 bg-gray-50">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value="rechnung" 
                    id="rechnung-disabled"
                    disabled
                    className="border-2 border-gray-300 mt-1 opacity-50"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="rechnung-disabled" className="flex items-center text-base font-semibold text-gray-500 cursor-not-allowed">
                        {getPaymentMethodDetails("rechnung").title}
                      </Label>
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                        Deaktiviert
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{getPaymentMethodDetails("rechnung").description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
