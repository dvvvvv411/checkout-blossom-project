
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CustomerForm } from "@/components/checkout/CustomerForm";
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
      // Setze CSS Custom Properties für dynamische Farben
      document.documentElement.style.setProperty("--checkout-accent", shopConfig.accent_color);
    }
  }, [shopConfig]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Ungültiger Checkout-Link
          </h1>
          <p className="text-gray-600">
            Bitte verwenden Sie einen gültigen Checkout-Link mit Token.
          </p>
        </div>
      </div>
    );
  }

  if (orderLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: accentColor }} />
          <span className="text-lg text-gray-700">Checkout wird geladen...</span>
        </div>
      </div>
    );
  }

  if (orderError || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-2">
            Fehler beim Laden der Bestelldaten
          </h1>
          <p className="text-gray-600">
            Bitte überprüfen Sie Ihren Checkout-Link oder versuchen Sie es später erneut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Bestellübersicht - Links auf Desktop, oben auf Mobile */}
          <div className="order-2 lg:order-1">
            <OrderSummary 
              orderData={orderData} 
              shopConfig={shopConfig}
              accentColor={accentColor}
            />
          </div>
          
          {/* Kundendatenformular - Rechts auf Desktop, unten auf Mobile */}
          <div className="order-1 lg:order-2">
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
