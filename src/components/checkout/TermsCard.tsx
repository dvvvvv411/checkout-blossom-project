
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Check, Shield, Sparkles } from "lucide-react";

interface TermsCardProps {
  termsAccepted: boolean;
  onChange: (accepted: boolean) => void;
  isCompleted: boolean;
}

export const TermsCard = ({ termsAccepted, onChange, isCompleted }: TermsCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      focused 
        ? "ring-2 ring-blue-500 ring-opacity-50 shadow-xl scale-[1.01]" 
        : "hover:shadow-lg"
    } ${isCompleted ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-br from-yellow-50 via-white to-orange-50"}`}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full -translate-y-16 translate-x-16 blur-xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/20 to-pink-200/20 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              isCompleted 
                ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg" 
                : "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <FileText className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AGB und Widerrufsbelehrung
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                <Shield className="h-3 w-3 text-yellow-500" />
                Bitte bestätigen Sie die Geschäftsbedingungen
              </div>
            </div>
          </div>
          {isCompleted && (
            <span className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold animate-pulse">
              ✨ Bestätigt!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
          termsAccepted 
            ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50" 
            : "border-gray-200 bg-white/80 backdrop-blur-sm hover:border-yellow-200"
        }`}>
          <div className="flex items-start space-x-4">
            <Checkbox
              id="terms_accepted"
              checked={termsAccepted}
              onCheckedChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="border-2 border-gray-300 mt-1 transition-all duration-300 hover:border-yellow-400"
            />
            <div className="flex-1">
              <Label htmlFor="terms_accepted" className="text-sm text-gray-800 leading-relaxed cursor-pointer font-medium">
                Ich stimme den{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline transition-all duration-200">
                  Allgemeinen Geschäftsbedingungen
                </a>{" "}
                und der{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline transition-all duration-200">
                  Widerrufsbelehrung
                </a>{" "}
                zu. *
              </Label>
              {termsAccepted && (
                <div className="mt-3 flex items-center gap-2 text-green-700 animate-fade-in">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Danke für deine Bestätigung!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
