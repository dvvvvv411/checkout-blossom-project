
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Lock, CheckCircle, Award } from "lucide-react";

interface VerifiedShopCardProps {
  language?: string;
}

export const VerifiedShopCard = ({ language = "DE" }: VerifiedShopCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateStars, setAnimateStars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const starTimer = setTimeout(() => {
      setAnimateStars(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(starTimer);
    };
  }, []);

  const getTranslation = (key: string) => {
    const translations = {
      DE: {
        title: "Verifizierter Shop",
        subtitle: "Bewertet mit 4.8 von 5 Sternen",
        verified: "Verifiziert",
        securePayment: "100% Sichere Zahlung"
      },
      EN: {
        title: "Verified Shop",
        subtitle: "Rated 4.8 out of 5 stars",
        verified: "Verified",
        securePayment: "100% Secure Payment"
      },
      FR: {
        title: "Boutique Vérifiée",
        subtitle: "Noté 4.8 sur 5 étoiles",
        verified: "Vérifié",
        securePayment: "Paiement 100% Sécurisé"
      },
    };

    return translations[language][key] || translations.DE[key];
  };

  const renderStars = () => {
    const stars = [];
    const rating = 4.8;
    const fullStars = Math.floor(rating);
    const hasPartialStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      const isFilled = i < fullStars;
      const isPartial = i === fullStars && hasPartialStar;
      const delay = i * 150;

      stars.push(
        <div
          key={i}
          className={`relative transition-all duration-700 ${
            animateStars ? "scale-110 opacity-100" : "scale-75 opacity-60"
          }`}
          style={{ transitionDelay: `${delay}ms` }}
        >
          <Star
            className={`h-5 w-5 transition-all duration-500 ${
              isFilled || isPartial
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
          {isPartial && (
            <div
              className="absolute top-0 left-0 overflow-hidden transition-all duration-700"
              style={{ 
                width: `${(rating % 1) * 100}%`,
                transitionDelay: `${delay + 300}ms`
              }}
            >
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
          )}
        </div>
      );
    }

    return stars;
  };

  return (
    <div
      className={`transition-all duration-1000 transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      }`}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-500">
        <CardContent className="p-6 relative text-center">
          {/* Header with award icon */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-md">
                <Award className="h-6 w-6 text-white" />
              </div>
              {/* Verification badge */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white">
                <CheckCircle className="h-3 w-3 text-white absolute top-0.5 left-0.5" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {getTranslation("title")}
              </h3>
              <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs rounded-full font-semibold shadow-md">
                {getTranslation("verified")}
              </div>
            </div>
          </div>

          {/* Stars rating */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {renderStars()}
            </div>
            <span className="text-lg font-bold text-gray-800 ml-2">4.8</span>
          </div>

          <p className="text-sm text-gray-700 mb-4 font-medium">
            {getTranslation("subtitle")}
          </p>

          {/* Secure payment banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center justify-center space-x-2">
              <Lock className="h-5 w-5" />
              <span className="font-bold text-sm">
                {getTranslation("securePayment")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
