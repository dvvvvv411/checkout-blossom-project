
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Check } from "lucide-react";

interface TermsCardProps {
  termsAccepted: boolean;
  onChange: (accepted: boolean) => void;
  isCompleted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  allStepsCompleted: boolean;
  accentColor: string;
  submitButtonText: string;
}

export const TermsCard = ({ 
  termsAccepted, 
  onChange, 
  isCompleted, 
  onSubmit,
  isSubmitting,
  allStepsCompleted,
  accentColor,
  submitButtonText
}: TermsCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      focused 
        ? "ring-2 ring-blue-500 ring-opacity-30 shadow-lg" 
        : "hover:shadow-md"
    } bg-white border-gray-200`}>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg shadow-sm transition-colors duration-300 ${
              isCompleted ? "bg-green-600" : "bg-gray-700"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <FileText className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Geschäftsbedingungen
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Shield className="h-3 w-3 text-gray-500" />
                Rechtliche Bestätigung erforderlich
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg border transition-all duration-300 mb-6 ${
          termsAccepted 
            ? "border-green-200 bg-green-50" 
            : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-start space-x-4">
            <Checkbox
              id="terms_accepted"
              checked={termsAccepted}
              onCheckedChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="border-2 border-gray-300 mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="terms_accepted" className="text-sm text-gray-800 leading-relaxed cursor-pointer">
                Ich stimme den Allgemeinen Geschäftsbedingungen und der Widerrufsbelehrung zu.
              </Label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={onSubmit}
          className={`w-full h-14 text-white font-semibold text-lg rounded-lg transition-all duration-200 disabled:opacity-50 ${
            allStepsCompleted 
              ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 animate-pulse" 
              : "bg-gray-500"
          }`}
          disabled={isSubmitting || !allStepsCompleted}
        >
          {isSubmitting ? "Bestellung wird verarbeitet..." : submitButtonText}
        </button>
      </CardContent>
    </Card>
  );
};
