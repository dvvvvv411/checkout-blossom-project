
import { OrderData, ShopConfig } from "@/services/api";
import { Package, Truck, Shield } from "lucide-react";

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
    <div className="space-y-6">
      {/* Product Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Ihre Bestellung</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {orderData.product_name}
              </h3>
              <p className="text-gray-600 mt-1 text-lg">
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
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kostenaufstellung</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">Zwischensumme</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(orderData.price_per_liter * orderData.quantity_liters)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">Lieferung</span>
            </div>
            <span className={`font-medium ${isDeliveryFree ? "text-green-600" : "text-gray-900"}`}>
              {isDeliveryFree ? "Kostenlos" : formatCurrency(orderData.delivery_fee)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">Netto-Betrag</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(orderData.total_net)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">MwSt ({Math.round(orderData.tax_rate * 100)}%)</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(orderData.total_tax)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-900">Gesamtpreis</span>
            <span 
              className="text-2xl font-bold"
              style={{ color: accentColor }}
            >
              {formatCurrency(orderData.total_gross)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sicher & Zuverlässig</h3>
        </div>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>SSL-verschlüsselte Übertragung</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Sichere Zahlungsabwicklung</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Zuverlässige Lieferung</span>
          </div>
        </div>
      </div>

      {/* Shop Info */}
      {shopConfig && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">
            Verkäufer: <span className="font-medium text-gray-700">{shopConfig.company_name}</span>
          </p>
        </div>
      )}
    </div>
  );
};
