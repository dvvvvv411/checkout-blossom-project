import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Phone, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { VerifiedShopCard } from "@/components/checkout/VerifiedShopCard";
import { CheckoutSkeleton, OrderSummarySkeleton } from "@/components/checkout/CheckoutSkeleton";
import { checkoutService, CheckoutInitData } from "@/services/checkoutService";
import { getTranslation } from "@/utils/translations";
import { getPageTranslation } from "@/utils/pageTranslations";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { getSupportedLanguage } from "@/lib/utils";
import { logger } from "@/utils/logger";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [accentColor, setAccentColor] = useState("#000000");
  const [corsError, setCorsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [capturedShopUrl, setCapturedShopUrl] = useState<string | null>(null);

  // Capture shop URL from referrer when component mounts
  useEffect(() => {
    const referrer = document.referrer;
    if (referrer && !referrer.includes(window.location.hostname)) {
      logger.dev("Captured shop URL from referrer:", referrer);
      setCapturedShopUrl(referrer);
    }
  }, []);

  // Optimized single query for all checkout data
  const { data: checkoutData, isLoading, error, refetch } = useQuery({
    queryKey: ["checkoutInit", token],
    queryFn: () => checkoutService.initializeCheckout(token!),
    enabled: !!token,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === 'CORS_ERROR') {
        setCorsError(true);
        logger.warn("CORS error detected, disabling retries");
        return false;
      }
      if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
        logger.error("Token expired during checkout init");
        return false;
      }
      return failureCount < 1;
    },
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract data from optimized response
  const orderData = checkoutData?.orderData;
  const shopConfig = checkoutData?.shopConfig;
  const shopId = checkoutData?.shopId;

  // Get the final language
  const language = getSupportedLanguage(shopConfig?.language);

  // Dynamic page title based on shop data
  const pageTitle = shopConfig?.company_name 
    ? getPageTranslation("checkout_shop_title", language, { shopName: shopConfig.company_name })
    : getPageTranslation("checkout_title", language);

  usePageTitle(pageTitle);

  // Update meta description dynamically
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', getPageTranslation("checkout_meta_description", language));
    }
  }, [language]);

  // Set accent color when shop config loads
  useEffect(() => {
    if (shopConfig?.accent_color) {
      setAccentColor(shopConfig.accent_color);
      document.documentElement.style.setProperty("--checkout-accent", shopConfig.accent_color);
    }
  }, [shopConfig?.accent_color]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    setCorsError(false);
    setRetryCount(prev => prev + 1);
    logger.info(`Retrying checkout initialization, attempt ${retryCount + 2}`);
    refetch();
  };

  // Token validation
  if (!token) {
    logger.error("Checkout accessed without valid token");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              {getTranslation("invalid_checkout_link", language)}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {getTranslation("invalid_checkout_message", language)}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              {getTranslation("home_button", language)}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Optimized loading header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center relative">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
                {corsError && (
                  <div className="text-center">
                    <WifiOff className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">
                      {getTranslation("verbindungsprobleme", language)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 lg:order-2">
              <div className="lg:sticky lg:top-8 space-y-6">
                <OrderSummarySkeleton />
              </div>
            </div>
            <div className="lg:col-span-7 lg:order-1">
              <CheckoutSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CORS Error handling
  if (corsError && !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <WifiOff className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              {getTranslation("cors_error_title", language)}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {getTranslation("cors_error_message", language)}
            </p>
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                <Wifi className="h-4 w-4 mr-2" />
                {getTranslation("retry_button", language)} ({retryCount + 1})
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                {getTranslation("home_button", language)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Token expired error
  if (error && error instanceof Error && error.message === 'TOKEN_EXPIRED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-red-600 mb-3">
              {getTranslation("error_loading_order", language)}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {getTranslation("error_loading_message", language)}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              {getTranslation("home_button", language)}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Other errors
  if (error && !orderData) {
    logger.error("Order loading failed", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-red-600 mb-3">
              {getTranslation("error_loading_order", language)}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {getTranslation("error_loading_message", language)}
            </p>
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                {getTranslation("retry_button", language)}
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                {getTranslation("home_button", language)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show checkout form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster />
      {corsError && (
        <div className="bg-orange-50 border-b border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <span className="text-orange-800">
                {getTranslation("demo_mode_banner", language)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center relative">
            <button
              onClick={handleBack}
              className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-center">
              {shopConfig?.logo_url && (
                <div className="mb-4">
                  <img 
                    src={shopConfig.logo_url} 
                    alt={shopConfig.company_name || "Shop Logo"}
                    className="h-24 mx-auto object-contain transition-opacity duration-200"
                    loading="lazy"
                    onError={(e) => {
                      const fallbackLogo = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=80&fit=crop&crop=center";
                      if (e.currentTarget.src !== fallbackLogo) {
                        e.currentTarget.src = fallbackLogo;
                      } else {
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                  />
                </div>
              )}
              
              {shopConfig?.support_phone && (
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>Support: {shopConfig.support_phone}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{getTranslation("secure_payment", language)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{getTranslation("ssl_encrypted", language)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
          <div className="flex items-center text-sm">
            <span className="text-gray-500">{getTranslation("cart", language)}</span>
            <span className="mx-2 text-gray-400">{'>'}</span>
            <span className="font-semibold text-gray-900">{getTranslation("information", language)}</span>
            <span className="mx-2 text-gray-400">{'>'}</span>
            <span className="text-gray-500">{getTranslation("shipping", language)}</span>
            <span className="mx-2 text-gray-400">{'>'}</span>
            <span className="text-gray-500">{getTranslation("payment", language)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 lg:order-2">
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="[&_.bg-white]:bg-transparent [&_.border]:border-transparent [&_.shadow-sm]:shadow-none">
                <OrderSummary 
                  orderData={orderData!} 
                  shopConfig={shopConfig}
                  accentColor={accentColor}
                  language={language}
                />
              </div>
              
              <div className="mt-8">
                <VerifiedShopCard 
                  language={language} 
                  shopConfig={shopConfig}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 lg:order-1">
            <CustomerForm 
              orderData={orderData!}
              shopConfig={shopConfig}
              accentColor={accentColor}
              language={language}
              capturedShopUrl={capturedShopUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
