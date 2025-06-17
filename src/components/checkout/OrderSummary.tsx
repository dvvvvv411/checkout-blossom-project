
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderData, ShopConfig } from "@/services/api";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Bestellübersicht
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Produktinformationen */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {orderData.product_name}
              </h3>
              <p className="text-sm text-gray-600">
                {formatLiters(orderData.quantity_liters)} Liter
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(orderData.price_per_liter * orderData.quantity_liters)}
              </p>
              <p className="text-sm text-gray-600">
                {formatCurrency(orderData.price_per_liter)} / Liter
              </p>
            </div>
          </div>

          {/* Liefergebühr */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Lieferung</span>
            <span className={isDeliveryFree ? "text-green-600 font-medium" : "text-gray-900"}>
              {isDeliveryFree ? "Kostenloser Versand" : formatCurrency(orderData.delivery_fee)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Preisaufschlüsselung */}
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Netto-Betrag</span>
            <span>{formatCurrency(orderData.total_net)}</span>
          </div>
          
          <div className="flex justify-between text-gray-700">
            <span>MwSt ({Math.round(orderData.tax_rate * 100)}%)</span>
            <span>{formatCurrency(orderData.total_tax)}</span>
          </div>
          
          <Separator />
          
          <div 
            className="flex justify-between text-lg font-semibold"
            style={{ color: accentColor }}
          >
            <span>Gesamtpreis</span>
            <span>{formatCurrency(orderData.total_gross)}</span>
          </div>
        </div>

        {/* Shop-Info */}
        {shopConfig && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              Verkäufer: {shopConfig.company_name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
