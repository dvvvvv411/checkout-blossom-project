
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Lock } from "lucide-react";
import { getTranslation } from "@/utils/translations";

interface VerifiedShopCardProps {
  language: "DE" | "EN" | "FR" | "IT" | "ES" | "PL" | "NL";
  shopConfig?: {
    company_name?: string;
  };
}

export const VerifiedShopCard = ({ language, shopConfig }: VerifiedShopCardProps) => {
  const [showLoading, setShowLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [animateStars, setAnimateStars] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [greenOutline, setGreenOutline] = useState(false);

  console.log("VerifiedShopCard language:", language);

  useEffect(() => {
    // Loading animation with 5 stars over 2 seconds
    const loadingSteps = [0, 1, 2, 3, 4];
    let currentStep = 0;

    const loadingInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingStep(currentStep);
        
        // Trigger green outline animation
        setGreenOutline(true);
        setTimeout(() => setGreenOutline(false), 200);
        
        currentStep++;
      } else {
        clearInterval(loadingInterval);
        setShowLoading(false);
        
        // Start content animation after loading is done
        setTimeout(() => {
          setShowContent(true);
          // Start star animation after content is shown
          setTimeout(() => {
            setAnimateStars(true);
          }, 100);
        }, 100);
      }
    }, 400); // 400ms * 5 = 2000ms (2 seconds)

    return () => {
      clearInterval(loadingInterval);
    };
  }, []);

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

  if (showLoading) {
    return (
      <Card className={`relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 shadow-lg transition-all duration-200 ${
        greenOutline ? "border-green-500" : "border-yellow-300/50"
      }`}>
        <CardContent className="p-6 relative text-center">
          <div className="flex items-center justify-center space-x-3 min-h-[150px] flex-col">
            <div className="flex space-x-3 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`transition-all duration-300 ${
                    i <= loadingStep 
                      ? "opacity-100 scale-110" 
                      : "opacity-30 scale-90"
                  }`}
                >
                  <img 
                    src="https://i.imgur.com/34S8L0P.png" 
                    alt="Loading Star"
                    className="h-8 w-8 object-contain"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {getTranslation("loading", language)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <CardContent className={`p-6 relative text-center transition-all duration-500 ${
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        {/* Header with custom image */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img 
            src="https://i.imgur.com/Nw7FDia.png" 
            alt="Verified Shop Badge"
            className="h-12 w-12 object-contain"
          />

          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {getTranslation("title", language)}
            </h3>
            <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs rounded-full font-semibold shadow-md">
              {getTranslation("reviews", language)}
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
          {getTranslation("subtitle", language)}
        </p>

        {/* Secure payment banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center justify-center space-x-2">
            <Lock className="h-5 w-5" />
            <span className="font-bold text-sm">
              {getTranslation("securePayment", language)}
            </span>
          </div>
        </div>

        {/* Shop Info */}
        {shopConfig?.company_name && (
          <div className="mt-4 pt-3 border-t border-amber-200/60">
            <p className="text-xs text-gray-600">
              {getTranslation("seller", language)} <span className="font-medium text-gray-700">{shopConfig.company_name}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
