
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Check, Clock, FileText, Shield, AlertCircle, Banknote, Timer } from "lucide-react";

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
        details: "Nach Ihrer Bestellung erhalten Sie von uns eine E-Mail mit unseren Bankdaten. Bitte überweisen Sie den Rechnungsbetrag innerhalb von 5 Werktagen. Ihre Bestellung wird sofort nach Zahlungseingang bearbeitet und verschickt. Diese Zahlungsart ist besonders sicher, da Sie vorab bezahlen und wir die Ware erst nach Geldeingang versenden.",
        icon: Clock,
        badge: "Sicher",
        additionalInfo: "⏱️ Lieferzeit: 2-3 Tage nach Zahlungseingang",
        benefits: ["Keine zusätzlichen Gebühren", "Sehr sicher für beide Seiten", "Bewährte Zahlungsmethode"]
      },
      rechnung: {
        description: "Kauf auf Rechnung - Sie bezahlen nach Erhalt der Ware",
        details: "Sie erhalten die Ware zuerst und bezahlen bequem innerhalb von 14 Tagen nach Erhalt. Die Rechnung liegt der Lieferung bei oder wird per E-Mail verschickt. Diese Zahlungsart bietet Ihnen maximale Flexibilität und Sicherheit, da Sie erst nach Erhalt und Prüfung der Ware bezahlen müssen. Ideal für Geschäfts- und Privatkunden.",
        icon: FileText,
        badge: "Flexibel",
        additionalInfo: "📦 Sofortiger Versand - 💳 Zahlung nach 14 Tagen",
        benefits: ["Kein Risiko - erst prüfen, dann bezahlen", "14 Tage Zahlungsziel", "Sofortiger Versand"]
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
          className="space-y-4"
        >
          {paymentMethods.map((method) => {
            const details = getPaymentMethodDetails(method);
            const IconComponent = details.icon;
            const isSelected = paymentMethod === method;
            
            return (
              <div key={method} className={`transition-all duration-200 ${
                isSelected ? "scale-[1.01]" : ""
              }`}>
                <div className={`p-5 border rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? "border-blue-300 bg-blue-50 shadow-md" 
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}>
                  <div className="flex items-start space-x-4">
                    <RadioGroupItem 
                      value={method} 
                      id={method}
                      className="border-2 border-gray-300 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <Label htmlFor={method} className="flex items-center text-base font-semibold text-gray-900 cursor-pointer">
                          <div className={`p-2 rounded-md mr-3 ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <IconComponent className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>
                          {getTranslation(method)}
                        </Label>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {details.badge}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{details.description}</p>
                      
                      {isSelected && (
                        <div className="mt-4 space-y-4">
                          <div className="p-4 bg-white rounded-md border border-blue-200">
                            <div className="flex items-start space-x-2 mb-3">
                              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-blue-900 mb-2">Wie funktioniert {getTranslation(method)}?</h4>
                                <p className="text-sm text-blue-800 leading-relaxed">{details.details}</p>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 rounded-md p-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <Timer className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">{details.additionalInfo}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                                <Banknote className="h-4 w-4 mr-1" />
                                Vorteile dieser Zahlungsart:
                              </h5>
                              <ul className="space-y-1">
                                {details.benefits.map((benefit, index) => (
                                  <li key={index} className="text-sm text-blue-800 flex items-start">
                                    <span className="text-green-600 mr-2 font-bold">✓</span>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
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
