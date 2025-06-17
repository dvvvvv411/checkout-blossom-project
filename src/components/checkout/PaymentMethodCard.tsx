
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Check, Clock, FileText, Sparkles, ShieldCheck } from "lucide-react";

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
        details: "Du erhältst unsere Bankdaten nach der Bestellung. Nach Zahlungseingang wird deine Bestellung bearbeitet.",
        icon: Clock,
        color: "from-blue-400 to-cyan-500",
        badge: "Sicher & bewährt"
      },
      rechnung: {
        description: "Kauf auf Rechnung",
        details: "Du erhältst eine Rechnung mit 14 Tagen Zahlungsziel. Ideal für Geschäftskunden und regelmäßige Bestellungen.",
        icon: FileText,
        color: "from-green-400 to-emerald-500",
        badge: "Flexibel & bequem"
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
        ? "ring-2 ring-blue-500 ring-opacity-50 shadow-xl scale-[1.01]" 
        : "hover:shadow-lg"
    } ${isCompleted ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-br from-purple-50 via-white to-indigo-50"}`}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full -translate-y-18 translate-x-18 blur-xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full translate-y-14 -translate-x-14 blur-xl"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              isCompleted 
                ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg" 
                : "bg-gradient-to-br from-purple-400 to-indigo-500 shadow-md"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <CreditCard className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {getTranslation("payment_method")}
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-purple-500" />
                Wie möchtest du bezahlen?
              </div>
            </div>
          </div>
          {isCompleted && (
            <span className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold animate-pulse">
              ✨ Gewählt!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <RadioGroup
          value={paymentMethod}
          onValueChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="space-y-4"
        >
          {paymentMethods.map((method) => {
            const details = getPaymentMethodDetails(method);
            const IconComponent = details.icon;
            const isSelected = paymentMethod === method;
            
            return (
              <div key={method} className={`relative group transition-all duration-300 ${
                isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
              }`}>
                <div className={`p-5 border-2 rounded-xl transition-all duration-300 ${
                  isSelected 
                    ? "border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg" 
                    : "border-gray-200 bg-white/80 backdrop-blur-sm hover:border-blue-200 hover:shadow-md"
                }`}>
                  <div className="flex items-start space-x-4">
                    <RadioGroupItem 
                      value={method} 
                      id={method}
                      className="border-2 border-gray-300 mt-1 transition-all duration-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={method} className="flex items-center text-base font-bold text-gray-800 cursor-pointer">
                          <div className={`p-2 rounded-lg mr-3 bg-gradient-to-br ${details.color} shadow-sm`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          {getTranslation(method)}
                        </Label>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          isSelected 
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {details.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-2">{details.description}</p>
                      {isSelected && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-700 font-medium">{details.details}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none animate-pulse"></div>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
