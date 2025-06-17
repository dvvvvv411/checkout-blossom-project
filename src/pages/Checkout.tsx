
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CustomerForm } from "@/components/checkout/CustomerForm";
import { VerifiedShopCard } from "@/components/checkout/VerifiedShopCard";
import { fetchOrderData, fetchShopConfig } from "@/services/api";

const Checkout = () => {
  const [searchParams] = useSearchParams();
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              Ungültiger Checkout-Link
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Bitte verwenden Sie einen gültigen Checkout-Link mit Token.
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
          <span className="text-lg text-gray-600 font-medium">Checkout wird geladen...</span>
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
              Fehler beim Laden der Bestelldaten
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Bitte überprüfen Sie Ihren Checkout-Link oder versuchen Sie es später erneut.
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            {shopConfig && (
              <div className="text-sm text-gray-500">
                {shopConfig.company_name}
              </div>
            )}
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
                <VerifiedShopCard language={shopConfig?.language} />
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
    </div>
  );
};

export default Checkout;
