
import { useState } from "react";
import { OrderData, ShopConfig, formatCurrency, formatLiters } from "@/services/api";
import { Package, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/utils/translations";

interface OrderSummaryProps {
  orderData: OrderData;
  shopConfig?: ShopConfig;
  accentColor: string;
}

export const OrderSummary = ({ orderData, shopConfig, accentColor }: OrderSummaryProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const [showError, setShowError] = useState(false);

  const language = shopConfig?.language || "DE";

  const formatPrice = (amount: number) => {
    return formatCurrency(amount, orderData.currency || "EUR", language);
  };

  const formatQuantity = (liters: number) => {
    return formatLiters(liters, language);
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
          <h2 className="text-lg font-semibold text-gray-900">
            {getTranslation("your_order", language)}
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {orderData.product_name}
              </h3>
              <p className="text-gray-600 mt-0.5 text-sm">
                {formatQuantity(orderData.quantity_liters)} Liter
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {formatPrice(orderData.price_per_liter)} {getTranslation("per_liter", language)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(orderData.price_per_liter * orderData.quantity_liters)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Code */}
      <div className="bg-white rounded-xl border border-gray-200 px-2 py-1">
        <div className="flex space-x-2">
          <Input
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder={getTranslation("discount_code", language)}
            className="flex-1 border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400"
          />
          <Button 
            onClick={handleDiscountSubmit}
            variant="default"
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
          >
            {getTranslation("apply", language)}
          </Button>
        </div>
        
        {showError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>{getTranslation("discount_invalid", language)}</span>
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <h3 className="font-semibold text-gray-900 mb-2">
          {getTranslation("cost_breakdown", language)}
        </h3>
        
        <div className="space-y-0.5">
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-700 text-sm">{getTranslation("subtotal", language)}</span>
            <span className="font-medium text-gray-900 text-sm">
              {formatPrice(orderData.price_per_liter * orderData.quantity_liters)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-700 text-sm">{getTranslation("delivery", language)}</span>
            <span className={`font-medium text-sm ${isDeliveryFree ? "text-green-600" : "text-gray-900"}`}>
              {isDeliveryFree ? getTranslation("free", language) : formatPrice(orderData.delivery_fee)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-700 text-sm">{getTranslation("net_amount", language)}</span>
            <span className="font-medium text-gray-900 text-sm">
              {formatPrice(orderData.total_net)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-700 text-sm">
              {getTranslation("vat", language)} ({Math.round(orderData.tax_rate * 100)}%)
            </span>
            <span className="font-medium text-gray-900 text-sm">
              {formatPrice(orderData.total_tax)}
            </span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">{getTranslation("total", language)}</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              {formatPrice(orderData.total_gross)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
