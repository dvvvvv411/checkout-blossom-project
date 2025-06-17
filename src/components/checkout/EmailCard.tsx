
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Check, Sparkles } from "lucide-react";

interface EmailCardProps {
  email: string;
  onChange: (email: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export const EmailCard = ({ email, onChange, onComplete, isCompleted }: EmailCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleEmailChange = (value: string) => {
    onChange(value);
    if (value && value.includes("@") && value.includes(".")) {
      onComplete();
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      focused 
        ? "ring-2 ring-blue-500 ring-opacity-50 shadow-lg scale-[1.02]" 
        : "hover:shadow-md"
    } ${isCompleted ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"}`}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              isCompleted 
                ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg" 
                : "bg-gradient-to-br from-blue-400 to-purple-500 shadow-md"
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <Mail className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                E-Mail-Adresse
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-blue-500" />
                Für Bestellbestätigung und Updates
              </div>
            </div>
          </div>
          {isCompleted && (
            <span className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold animate-pulse">
              ✨ Perfekt!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div>
          <Label htmlFor="email" className="text-sm font-semibold text-gray-800 mb-3 block">
            Deine E-Mail-Adresse *
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              className="pl-12 h-14 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-300 text-base font-medium bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
              placeholder="anna.mueller@beispiel.de"
            />
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none transition-opacity duration-300 ${
              focused ? "opacity-100" : "opacity-0"
            }`}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
