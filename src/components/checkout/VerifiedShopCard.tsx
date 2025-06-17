
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Lock, CheckCircle } from "lucide-react";

interface VerifiedShopCardProps {
  language?: string;
}

export const VerifiedShopCard = ({ language = "DE" }: VerifiedShopCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateStars, setAnimateStars] = useState(false);
  const [animateBadges, setAnimateBadges] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const starTimer = setTimeout(() => {
      setAnimateStars(true);
    }, 1000);

    const badgeTimer = setTimeout(() => {
      setAnimateBadges(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(starTimer);
      clearTimeout(badgeTimer);
    };
  }, []);

  const getTranslation = (key: string) => {
    const translations = {
      DE: {
        title: "Verifizierter Shop",
        subtitle: "Bewertet mit 4.8 von 5 Sternen",
        verified: "Verifiziert",
        securePayment: "100% Sichere Zahlung",
        trustFeatures: ["SSL-verschlüsselt", "Käuferschutz", "Vertrauenswürdig"]
      },
      EN: {
        title: "Verified Shop",
        subtitle: "Rated 4.8 out of 5 stars",
        verified: "Verified",
        securePayment: "100% Secure Payment",
        trustFeatures: ["SSL-encrypted", "Buyer Protection", "Trustworthy"]
      },
      FR: {
        title: "Boutique Vérifiée",
        subtitle: "Noté 4.8 sur 5 étoiles",
        verified: "Vérifié",
        securePayment: "Paiement 100% Sécurisé",
        trustFeatures: ["Crypté SSL", "Protection Acheteur", "Digne de confiance"]
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
                ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                : "text-gray-300"
            } ${animateStars ? "animate-pulse" : ""}`}
            style={{ filter: animateStars ? "drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))" : "" }}
          />
          {isPartial && (
            <div
              className="absolute top-0 left-0 overflow-hidden transition-all duration-700"
              style={{ 
                width: `${(rating % 1) * 100}%`,
                transitionDelay: `${delay + 300}ms`
              }}
            >
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-yellow-300/50 shadow-2xl hover:shadow-yellow-200/50 transition-all duration-500 group">
        {/* Animated golden border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />
        
        {/* Shine animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

        {/* Golden dots pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: "0s" }} />
          <div className="absolute top-6 right-6 w-1 h-1 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-6 right-4 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: "1.5s" }} />
        </div>

        <CardContent className="p-6 relative z-10 text-center">
          {/* Header with shield */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Shield className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              {/* Verification pulse */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse">
                <CheckCircle className="h-3 w-3 text-white absolute top-0.5 left-0.5" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {getTranslation("title")}
              </h3>
              <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs rounded-full font-semibold shadow-lg">
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
          <div className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg mb-4 shadow-lg transition-all duration-700 ${
            animateBadges ? "transform translate-y-0 opacity-100" : "transform translate-y-4 opacity-0"
          }`}>
            <div className="flex items-center justify-center space-x-2">
              <Lock className="h-5 w-5 animate-pulse" />
              <span className="font-bold text-sm">
                {getTranslation("securePayment")}
              </span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-2">
            {getTranslation("trustFeatures").map((feature, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  animateBadges ? "transform translate-y-0 opacity-100" : "transform translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200 + 500}ms` }}
              >
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/80 rounded-lg border border-yellow-200 hover:bg-white transition-all duration-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.3}s` }} />
                  <span className="text-xs text-gray-700 font-medium text-center leading-tight">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
