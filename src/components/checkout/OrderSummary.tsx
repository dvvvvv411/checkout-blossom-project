
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderData, ShopConfig } from "@/services/api";
import { Package } from "lucide-react";

interface OrderSummaryProps {
  orderData: OrderData;
  shopConfig?: ShopConfig;
  accentColor: string;
}

export const OrderSummary = ({ orderData, shopConfig, accentColor }: OrderSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: orderData.currency || "EUR",
    }).format(amount);
  };

  const formatLiters = (liters: number) => {
    return new Intl.NumberFormat("de-DE").format(liters);
  };

  const isDeliveryFree = orderData.delivery_fee === 0;

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Bestellübersicht</h2>
        </div>

        {/* Product */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {orderData.product_name}
              </h3>
              <p className="text-gray-600 mt-1">
                {formatLiters(orderData.quantity_liters)} Liter
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(orderData.price_per_liter)} pro Liter
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(orderData.price_per_liter * orderData.quantity_liters)}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Cost Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Zwischensumme</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(orderData.price_per_liter * orderData.quantity_liters)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Lieferung</span>
            <span className={`font-medium ${isDeliveryFree ? "text-green-600" : "text-gray-900"}`}>
              {isDeliveryFree ? "Kostenlos" : formatCurrency(orderData.delivery_fee)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Netto-Betrag</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(orderData.total_net)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">MwSt ({Math.round(orderData.tax_rate * 100)}%)</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(orderData.total_tax)}
            </span>
          </div>
          
          <Separator className="bg-gray-200" />
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Gesamtpreis</span>
              <span 
                className="text-2xl font-bold"
                style={{ color: accentColor }}
              >
                {formatCurrency(orderData.total_gross)}
              </span>
            </div>
          </div>
        </div>

        {/* Shop Info */}
        {shopConfig && (
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-500">
              Verkäufer: <span className="font-medium text-gray-700">{shopConfig.company_name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
