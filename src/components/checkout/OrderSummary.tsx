
import { useState } from "react";
import { OrderData, ShopConfig } from "@/services/api";
import { Package, Truck, Shield, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  orderData: OrderData;
  shopConfig?: ShopConfig;
  accentColor: string;
}

export const OrderSummary = ({ orderData, shopConfig, accentColor }: OrderSummaryProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const [showError, setShowError] = useState(false);

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

  const handleDiscountSubmit = () => {
    if (discountCode.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="space-y-2">
      {/* Product Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <Package className="h-4 w-4 text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Ihre Bestellung</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {orderData.product_name}
              </h3>
              <p className="text-gray-600 mt-0.5 text-sm">
                {formatLiters(orderData.quantity_liters)} Liter
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {formatCurrency(orderData.price_per_liter)} pro Liter
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(orderData.price_per_liter * orderData.quantity_liters)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Code */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex space-x-2 mb-1">
          <Input
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Rabattcode eingeben"
            className="flex-1"
          />
          <Button 
            onClick={handleDiscountSubmit}
            variant="default"
            size="sm"
            disabled={!discountCode.trim()}
            className="bg-black text-white hover:bg-gray-800"
          >
            Anwenden
          </Button>
        </div>
        
        {showError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Der eingegebene Code ist nicht gültig</span>
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <h3 className="font-semibold text-gray-900 mb-2">Kostenaufstellung</h3>
        
        <div className="space-y-0.5">
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-700 text-sm">Zwischensumme</span>
            <span className="font-medium text-gray-900 text-sm">
              {formatCurrency(orderData.price_per_liter * orderData.quantity_liters)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700 text-sm">Lieferung</span>
            </div>
            <span className={`font-medium text-sm ${isDeliveryFree ? "text-green-600" : "text-gray-900"}`}>
              {isDeliveryFree ? "Kostenlos" : formatCurrency(orderData.delivery_fee)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-700 text-sm">Netto-Betrag</span>
            <span className="font-medium text-gray-900 text-sm">
              {formatCurrency(orderData.total_net)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-700 text-sm">MwSt ({Math.round(orderData.tax_rate * 100)}%)</span>
            <span className="font-medium text-gray-900 text-sm">
              {formatCurrency(orderData.total_tax)}
            </span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Gesamtpreis</span>
            <span 
              className="text-xl font-bold"
              style={{ color: accentColor }}
            >
              {formatCurrency(orderData.total_gross)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-4 w-4 text-green-600" />
          <h3 className="font-semibold text-gray-900">Sicher & Zuverlässig</h3>
        </div>
        
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>SSL-verschlüsselte Übertragung</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Sichere Zahlungsabwicklung</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Zuverlässige Lieferung</span>
          </div>
        </div>
      </div>

      {/* Shop Info */}
      {shopConfig && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-sm text-gray-500">
            Verkäufer: <span className="font-medium text-gray-700">{shopConfig.company_name}</span>
          </p>
        </div>
      )}
    </div>
  );
};
