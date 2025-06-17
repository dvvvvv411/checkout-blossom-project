
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Check } from "lucide-react";

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
    <Card className={`transition-all duration-200 ${focused ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : "bg-gray-100"}`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <FileText className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold">AGB und Widerrufsbelehrung</div>
              <div className="text-sm text-gray-500 font-normal">Bitte bestätigen Sie die Geschäftsbedingungen</div>
            </div>
          </div>
          {isCompleted && (
            <span className="text-sm text-green-600 font-medium">✓ Abgeschlossen</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms_accepted"
            checked={termsAccepted}
            onCheckedChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="border-gray-300 mt-1"
          />
          <Label htmlFor="terms_accepted" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
            Ich stimme den{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Allgemeinen Geschäftsbedingungen
            </a>{" "}
            und der{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Widerrufsbelehrung
            </a>{" "}
            zu. *
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
