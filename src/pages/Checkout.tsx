
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Phone } from "lucide-react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { VerifiedShopCard } from "@/components/checkout/VerifiedShopCard";
import { fetchOrderData, fetchShopConfig } from "@/services/api";
import { getTranslation } from "@/utils/translations";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [accentColor, setAccentColor] = useState("#000000");

  const { data: orderData, isLoading: orderLoading, error: orderError } = useQuery({
    queryKey: ["order", token],
    queryFn: () => fetchOrderData(token!),
    enabled: !!token,
  });

  const { data: shopConfig, isLoading: configLoading } = useQuery({
    queryKey: ["shopConfig", orderData?.shop_id],
    queryFn: () => fetchShopConfig(orderData!.shop_id),
    enabled: !!orderData?.shop_id,
  });

  useEffect(() => {
    if (shopConfig?.accent_color) {
      setAccentColor(shopConfig.accent_color);
      document.documentElement.style.setProperty("--checkout-accent", shopConfig.accent_color);
    }
  }, [shopConfig]);

  const handleBack = () => {
    navigate(-1);
  };

  const language = shopConfig?.language || "DE";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              {getTranslation("invalid_checkout_link", language)}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {getTranslation("invalid_checkout_message", language)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (orderLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="text-lg text-gray-600 font-medium">
            {getTranslation("loading_checkout", language)}
          </span>
        </div>
      </div>
    );
  }

  if (orderError || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-semibold text-red-600 mb-3">
              {getTranslation("error_loading_order", language)}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {getTranslation("error_loading_message", language)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              {/* Logo */}
              {shopConfig?.logo_url && (
                <div className="mb-4">
                  <img 
                    src={shopConfig.logo_url} 
                    alt={shopConfig.company_name}
                    className="h-12 mx-auto object-contain"
                    onError={(e) => {
                      // Verstecke Logo bei Fehler
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {getTranslation("checkout", language)}
              </h1>
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
                  orderData={orderData} 
                  shopConfig={shopConfig}
                  accentColor={accentColor}
                />
              </div>
              
              {/* Verified Shop Card - positioned at bottom of right column */}
              <div className="mt-8">
                <VerifiedShopCard 
                  language={shopConfig?.language} 
                  shopConfig={shopConfig}
                />
              </div>
            </div>
          </div>
          
          {/* Customer Form - Second on Mobile */}
          <div className="lg:col-span-7 lg:order-1">
            <CustomerForm 
              orderData={orderData}
              shopConfig={shopConfig}
              accentColor={accentColor}
            />
          </div>
        </div>
      </div>

      {/* Footer mit Support-Telefon */}
      {shopConfig?.support_phone && (
        <div className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>Support: {shopConfig.support_phone}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
