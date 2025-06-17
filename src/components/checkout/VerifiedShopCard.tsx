
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Lock, CheckCircle } from "lucide-react";

interface VerifiedShopCardProps {
  language?: string;
}

export const VerifiedShopCard = ({ language = "DE" }: VerifiedShopCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getTranslation = (key: string) => {
    const translations = {
      DE: {
        title: "Verifizierter Shop",
        subtitle: "Bewertet mit 4.8 von 5 Sternen",
        verified: "Verifiziert",
        securePayment: "SSL-verschlüsselt & sicher",
        trustFeatures: ["Käuferschutz", "Datenschutz", "Geprüft"]
      },
      EN: {
        title: "Verified Shop",
        subtitle: "Rated 4.8 out of 5 stars",
        verified: "Verified",
        securePayment: "SSL-encrypted & secure",
        trustFeatures: ["Buyer Protection", "Data Privacy", "Verified"]
      },
      FR: {
        title: "Boutique Vérifiée",
        subtitle: "Noté 4.8 sur 5 étoiles",
        verified: "Vérifié",
        securePayment: "Crypté SSL et sécurisé",
        trustFeatures: ["Protection Acheteur", "Confidentialité", "Vérifié"]
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

      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            isFilled || isPartial
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300"
          }`}
        />
      );
    }

    return stars;
  };

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                  <CheckCircle className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {getTranslation("title")}
              </h3>
              <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                {getTranslation("verified")}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex space-x-0.5">
                {renderStars()}
              </div>
              <span className="text-sm font-medium text-gray-700">4.8</span>
            </div>
            <p className="text-xs text-gray-600">
              {getTranslation("subtitle")}
            </p>
          </div>

          {/* Security info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {getTranslation("securePayment")}
              </span>
            </div>
          </div>

          {/* Trust features */}
          <div className="grid grid-cols-3 gap-2">
            {getTranslation("trustFeatures").map((feature, index) => (
              <div
                key={index}
                className="text-center p-2 bg-gray-50 rounded border"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1" />
                <span className="text-xs text-gray-600 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
