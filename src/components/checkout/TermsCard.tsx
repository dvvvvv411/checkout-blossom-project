
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Check } from "lucide-react";
import { getTranslation } from "@/utils/translations";

interface TermsCardProps {
  termsAccepted: boolean;
  onChange: (accepted: boolean) => void;
  isCompleted: boolean;
  isSubmitting: boolean;
  allStepsCompleted: boolean;
  accentColor: string;
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
}

export const TermsCard = ({ 
  termsAccepted, 
  onChange, 
  isCompleted, 
  isSubmitting,
  allStepsCompleted,
  accentColor,
  language
}: TermsCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (checked: boolean | string) => {
    console.log("=== TERMS CARD: Terms checkbox changed ===", checked);
    const isChecked = checked === true;
    onChange(isChecked);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("=== TERMS CARD: Submit button clicked ===");
    console.log("Button event:", e.type);
    console.log("All steps completed:", allStepsCompleted);
    console.log("Terms accepted:", termsAccepted);
    console.log("Is submitting:", isSubmitting);
    
    // The button is type="submit" so it will automatically trigger the parent form's onSubmit
    // No need to call any additional handlers here
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
                {getTranslation("terms_conditions", language)}
              </div>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <Shield className="h-3 w-3 text-gray-500" />
                {getTranslation("terms_description", language)}
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
                {getTranslation("terms_text", language)}
              </Label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleButtonClick}
          className={`w-full h-14 text-white font-semibold text-lg rounded-lg transition-all duration-200 disabled:opacity-50 ${
            allStepsCompleted && termsAccepted
              ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700" 
              : "bg-gray-500"
          }`}
          disabled={isSubmitting || !allStepsCompleted || !termsAccepted}
        >
          {isSubmitting 
            ? getTranslation("processing_order", language) 
            : getTranslation("submit_order", language)
          }
        </button>
      </CardContent>
    </Card>
  );
};
