
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Shield, CheckCircle } from "lucide-react";

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
        securePayment: "100% Sichere Zahlung",
        reviews: "Basierend auf 2.847 Bewertungen"
      },
      EN: {
        title: "Verified Shop",
        subtitle: "Rated 4.8 out of 5 stars",
        verified: "Verified",
        securePayment: "100% Secure Payment",
        reviews: "Based on 2,847 reviews"
      },
      FR: {
        title: "Boutique Vérifiée",
        subtitle: "Noté 4.8 sur 5 étoiles",
        verified: "Vérifié",
        securePayment: "Paiement 100% Sécurisé",
        reviews: "Basé sur 2.847 avis"
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
      const delay = i * 100;

      stars.push(
        <div
          key={i}
          className={`relative transition-all duration-500 ${
            animateStars ? "scale-100 opacity-100" : "scale-90 opacity-70"
          }`}
          style={{ transitionDelay: `${delay}ms` }}
        >
          <Star
            className={`h-4 w-4 transition-all duration-300 ${
              isFilled || isPartial
                ? "text-green-500 fill-green-500"
                : "text-gray-300 fill-gray-300"
            }`}
          />
          {isPartial && (
            <div
              className="absolute top-0 left-0 overflow-hidden transition-all duration-500"
              style={{ 
                width: `${(rating % 1) * 100}%`,
                transitionDelay: `${delay + 200}ms`
              }}
            >
              <Star className="h-4 w-4 text-green-500 fill-green-500" />
            </div>
          )}
        </div>
      );
    }

    return stars;
  };

  return (
    <div
      className={`transition-all duration-700 transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-98"
      }`}
    >
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {getTranslation("title")}
              </h3>
              <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                {getTranslation("verified")}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-0.5">
                {renderStars()}
              </div>
              <span className="text-sm font-semibold text-gray-900">4.8</span>
            </div>
            <p className="text-xs text-gray-600">
              {getTranslation("reviews")}
            </p>
          </div>

          {/* Security */}
          <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">
              {getTranslation("securePayment")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
