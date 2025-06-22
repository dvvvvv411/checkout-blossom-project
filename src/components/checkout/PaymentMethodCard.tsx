
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
  const [debugInfo, setDebugInfo] = useState<any>(null);

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

  // Enhanced debugging with detailed analysis
  useEffect(() => {
    const debugData = {
      receivedPaymentMethods: {
        raw: paymentMethods,
        type: typeof paymentMethods,
        isArray: Array.isArray(paymentMethods),
        length: paymentMethods?.length,
        stringified: JSON.stringify(paymentMethods),
      },
      individualItems: Array.isArray(paymentMethods) ? paymentMethods.map((method, index) => ({
        index,
        value: method,
        type: typeof method,
        stringValue: String(method),
        isObject: typeof method === 'object' && method !== null,
        objectKeys: typeof method === 'object' && method !== null ? Object.keys(method) : null,
        objectStringified: typeof method === 'object' && method !== null ? JSON.stringify(method) : null,
      })) : [],
      processingAttempt: null as any,
      currentSelection: paymentMethod,
      completionStatus: isCompleted,
    };

    // Attempt to process payment methods
    try {
      const processed = processPaymentMethods(paymentMethods || []);
      debugData.processingAttempt = {
        success: true,
        input: paymentMethods,
        output: processed,
        outputCount: processed.length,
        mappedCodes: processed.map(p => p.code),
      };
      logger.dev("Payment method processing successful:", debugData.processingAttempt);
    } catch (error) {
      debugData.processingAttempt = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        input: paymentMethods,
      };
      logger.error("Payment method processing failed:", debugData.processingAttempt);
    }

    setDebugInfo(debugData);
    logger.dev("Complete PaymentMethodCard debug info:", debugData);
  }, [paymentMethods, paymentMethod, isCompleted]);

  // Process payment methods using the utility function
  const processedPaymentMethods = processPaymentMethods(paymentMethods || []);
  
  logger.dev("Processed payment methods result:", {
    inputLength: paymentMethods?.length || 0,
    outputLength: processedPaymentMethods.length,
    processedMethods: processedPaymentMethods.map(p => ({
      original: p.original,
      code: p.code,
      displayName: p.displayName
    }))
  });

  // Automatically select first available payment method if none is selected
  useEffect(() => {
    if (processedPaymentMethods.length > 0 && !paymentMethod) {
      const firstMethod = processedPaymentMethods[0].code;
      logger.dev("Auto-selecting first payment method", firstMethod);
      onChange(firstMethod);
      onComplete();
    }
  }, [processedPaymentMethods, paymentMethod, onChange, onComplete]);

  const handleChange = (value: string) => {
    logger.dev("Payment method changed to", value);
    if (value === "vorkasse" || value === "rechnung") {
      onChange(value);
      onComplete();
    } else {
      logger.warn("Invalid payment method selected", value);
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
        description: getTranslation("rechnung_description", language),
        badge: getTranslation("existing_customers_only", language)
      }
    };
    
    return details[method];
  };

  // Show comprehensive error state if no payment methods available
  if (!paymentMethods || paymentMethods.length === 0) {
    logger.warn("No payment methods available - showing error state");
    return (
      <Card className="border-red-300 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3" />
            <p className="font-medium">Keine Zahlungsmethoden verfügbar</p>
            <p className="text-sm mt-1">Bitte wenden Sie sich an den Support.</p>
            {debugInfo && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs font-mono">Debug Info (Click to expand)</summary>
                <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-auto max-h-32">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show detailed processing state if no valid methods after processing
  if (processedPaymentMethods.length === 0) {
    logger.warn("No valid payment methods after processing", {
      input: paymentMethods,
      debugInfo
    });
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardContent className="p-6">
          <div className="text-center text-yellow-700">
            <Info className="h-8 w-8 mx-auto mb-3" />
            <p className="font-medium">Zahlungsmethoden werden verarbeitet...</p>
            <div className="mt-3 text-sm space-y-2">
              <p><strong>Empfangene Daten:</strong> {JSON.stringify(paymentMethods)}</p>
              <p><strong>Datentyp:</strong> {typeof paymentMethods} {Array.isArray(paymentMethods) ? '(Array)' : ''}</p>
              <p><strong>Anzahl Elemente:</strong> {paymentMethods?.length || 0}</p>
            </div>
            <p className="text-xs mt-3 text-gray-600">
              Unterstützte Methoden: Vorkasse/Überweisung, Kauf auf Rechnung
            </p>
            {debugInfo && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs font-mono">Vollständige Debug-Info</summary>
                <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-auto max-h-48">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
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
          {processedPaymentMethods.map((methodInfo, index) => {
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
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          details.badge === getTranslation("recommended", language)
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
        
        {/* Debug panel for development */}
        {import.meta.env.DEV && debugInfo && (
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
              🔧 Debug Info (Development Only)
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40 font-mono">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
};
