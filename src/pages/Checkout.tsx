import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Phone, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { VerifiedShopCard } from "@/components/checkout/VerifiedShopCard";
import { fetchOrderDataWithShopId, fetchShopConfig } from "@/services/api";
import { getTranslation } from "@/utils/translations";
import { Button } from "@/components/ui/button";
import { getSupportedLanguage } from "@/lib/utils";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [accentColor, setAccentColor] = useState("#000000");
  const [corsError, setCorsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // First query: Get order data and shop ID from token
  const { data: orderDataWithShopId, isLoading: orderLoading, error: orderError, refetch: refetchOrder } = useQuery({
    queryKey: ["orderWithShopId", token],
    queryFn: () => fetchOrderDataWithShopId(token!),
    enabled: !!token,
    retry: (failureCount, error) => {
      // Bei CORS-Fehlern nicht automatisch wiederholen
      if (error instanceof Error && error.message === 'CORS_ERROR') {
        setCorsError(true);
        return false;
      }
      // Bei TOKEN_EXPIRED nicht wiederholen
      if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
        return false;
      }
      // Maximal 2 Wiederholungen für andere Fehler
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Extract order data and shop ID from the first query
  const orderData = orderDataWithShopId?.orderData;
  const shopId = orderDataWithShopId?.shopId;

  // Second query: Get shop config using the shop ID
  const { data: shopConfig, isLoading: configLoading } = useQuery({
    queryKey: ["shopConfig", shopId],
    queryFn: () => fetchShopConfig(shopId!),
    enabled: !!shopId, // Only run when we have a shop ID
    retry: (failureCount, error) => {
      // Bei CORS-Fehlern Shop-Config-Fehler ignorieren und Fallback verwenden
      if (error instanceof Error && error.message === 'CORS_ERROR') {
        return false;
      }
      return failureCount < 1;
    },
  });

  // Get the final language - use utility function for consistency
  const language = getSupportedLanguage(shopConfig?.language);

  // Enhanced logging for payment method debugging
  useEffect(() => {
    if (shopConfig) {
      console.log("=== CHECKOUT PAYMENT METHOD DEBUG ===");
      console.log("Shop Config:", shopConfig);
      console.log("Payment Methods Raw:", shopConfig.payment_methods);
      console.log("Payment Methods Type:", typeof shopConfig.payment_methods);
      console.log("Payment Methods Array:", Array.isArray(shopConfig.payment_methods));
      if (Array.isArray(shopConfig.payment_methods)) {
        shopConfig.payment_methods.forEach((method, index) => {
          console.log(`Payment Method ${index}:`, method, "Type:", typeof method);
        });
      }
      console.log("Language:", shopConfig.language);
      console.log("Resolved Language:", language);
      console.log("=== LOGO DEBUG IN CHECKOUT ===");
      console.log("Logo URL from shopConfig:", shopConfig.logo_url);
      console.log("Company Name:", shopConfig.company_name);
      console.log("=====================================");
    }
  }, [shopConfig, language]);

  useEffect(() => {
    if (shopConfig?.accent_color) {
      setAccentColor(shopConfig.accent_color);
      document.documentElement.style.setProperty("--checkout-accent", shopConfig.accent_color);
    }
  }, [shopConfig]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    setCorsError(false);
    setRetryCount(prev => prev + 1);
    refetchOrder();
  };

  // Token validation
  if (!token) {
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

  // Loading state - wait for both order data AND shop config to be loaded
  // This prevents the flash of wrong language content
  const isLoading = orderLoading || (orderData && configLoading);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          {corsError && (
            <div className="text-center mt-4">
              <WifiOff className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                {getTranslation("verbindungsprobleme", language)}
              </p>
            </div>
          )}
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
  if (orderError && orderError instanceof Error && orderError.message === 'TOKEN_EXPIRED') {
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
  if (orderError && !orderData) {
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
  // At this point we have both orderData and shopConfig (or shopConfig failed but we have fallback)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* CORS Warning Banner */}
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
            {/* Mobile Back Button - positioned absolutely on the left */}
            <button
              onClick={handleBack}
              className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-center">
              {/* Enhanced Logo with better error handling and debugging - made twice as large */}
              {shopConfig?.logo_url && (
                <div className="mb-4">
                  <img 
                    src={shopConfig.logo_url} 
                    alt={shopConfig.company_name || "Shop Logo"}
                    className="h-24 mx-auto object-contain transition-opacity duration-200"
                    onLoad={() => {
                      console.log("Logo loaded successfully:", shopConfig.logo_url);
                    }}
                    onError={(e) => {
                      console.error("Logo failed to load:", shopConfig.logo_url);
                      console.log("Attempting to load fallback logo");
                      // Instead of hiding, try a fallback logo
                      const fallbackLogo = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=80&fit=crop&crop=center";
                      if (e.currentTarget.src !== fallbackLogo) {
                        e.currentTarget.src = fallbackLogo;
                        console.log("Switched to fallback logo:", fallbackLogo);
                      } else {
                        // If even fallback fails, hide the image
                        console.log("Fallback logo also failed, hiding logo");
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                  />
                </div>
              )}
              
              {/* Debug info - only show in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mb-2">
                  Debug: Logo URL = {shopConfig?.logo_url || 'undefined'}
                </div>
              )}
              
              {/* Support-Telefon direkt unter dem Logo */}
              {shopConfig?.support_phone && (
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>Support: {shopConfig.support_phone}</span>
                  </div>
                </div>
              )}
              
              {/* Security indicators */}
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

      {/* Mobile Navigation - Only visible on mobile */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order Summary - Mobile First */}
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
              
              {/* Verified Shop Card - positioned at bottom of right column */}
              <div className="mt-8">
                <VerifiedShopCard 
                  language={language} 
                  shopConfig={shopConfig}
                />
              </div>
            </div>
          </div>
          
          {/* Customer Form - Second on Mobile */}
          <div className="lg:col-span-7 lg:order-1">
            <CustomerForm 
              orderData={orderData!}
              shopConfig={shopConfig}
              accentColor={accentColor}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
