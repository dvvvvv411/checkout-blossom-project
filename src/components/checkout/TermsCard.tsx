
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Shield } from "lucide-react";

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
        ? "ring-2 ring-blue-500 ring-opacity-30 shadow-lg" 
        : "hover:shadow-md"
    } bg-white border-gray-200`}>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-gray-700 shadow-sm">
              <FileText className="h-5 w-5 text-white" />
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
        <div className={`p-4 rounded-lg border transition-all duration-300 ${
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
                Ich stimme den{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Allgemeinen Geschäftsbedingungen
                </a>{" "}
                und der{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Widerrufsbelehrung
                </a>{" "}
                zu. *
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
