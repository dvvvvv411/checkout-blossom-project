
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star } from "lucide-react";

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
        trustworthy: "Vertrauenswürdig"
      },
      EN: {
        title: "Verified Shop",
        subtitle: "Rated 4.8 out of 5 stars",
        verified: "Verified",
        trustworthy: "Trustworthy"
      },
      FR: {
        title: "Boutique Vérifiée",
        subtitle: "Noté 4.8 sur 5 étoiles",
        verified: "Vérifié",
        trustworthy: "Digne de confiance"
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
            animateStars ? "scale-100 opacity-100" : "scale-75 opacity-60"
          }`}
          style={{ transitionDelay: `${delay}ms` }}
        >
          <Star
            className={`h-4 w-4 transition-all duration-300 ${
              isFilled || isPartial
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            } ${animateStars ? "drop-shadow-sm" : ""}`}
          />
          {isPartial && (
            <div
              className="absolute top-0 left-0 overflow-hidden transition-all duration-500"
              style={{ 
                width: `${(rating % 1) * 100}%`,
                transitionDelay: `${delay + 200}ms`
              }}
            >
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
          )}
          {/* Glint animation */}
          {(isFilled || isPartial) && animateStars && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)",
                animationDelay: `${delay + 500}ms`,
                animationDuration: "2s",
                animationIterationCount: "infinite",
              }}
            />
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
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
        {/* Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
        
        {/* Pulse animation background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

        <CardContent className="p-4 relative z-10">
          <div className="flex items-center space-x-3">
            {/* Animated shield icon */}
            <div className="relative">
              <div className="p-2 bg-green-600 rounded-lg shadow-sm group-hover:bg-green-700 transition-colors duration-300">
                <Shield className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              {/* Verification badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
            </div>

            <div className="flex-1">
              {/* Title */}
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {getTranslation("title")}
                </h3>
                <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {getTranslation("verified")}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex space-x-0.5">
                  {renderStars()}
                </div>
                <span className="text-sm font-medium text-gray-700">4.8</span>
              </div>

              {/* Subtitle */}
              <p className="text-xs text-gray-600">
                {getTranslation("subtitle")}
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>SSL-geschützt</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                <span>Datenschutz</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                <span>{getTranslation("trustworthy")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
