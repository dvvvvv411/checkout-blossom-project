
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, CreditCard, MapPin, Mail, Phone, ArrowLeft, AlertTriangle } from "lucide-react";
import { formatCurrency, fetchShopConfig, ShopConfig } from "@/services/api";
import { getTranslation } from "@/utils/translations";

interface OrderConfirmationData {
  orderResponse: {
    order_id: string;
    status: string;
    confirmation_number: string;
    payment_instructions?: {
      bank_details?: {
        account_holder: string;
        iban: string;
        bic: string;
        reference: string;
      };
    };
    total_amount: number;
    currency: string;
  };
  customerData: any;
  orderData: any;
  submittedAt: string;
}

const Confirmation = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<OrderConfirmationData | null>(null);
  const [shopConfig, setShopConfig] = useState<ShopConfig | null>(null);
  const [language, setLanguage] = useState<"DE" | "EN" | "FR">("DE");

  useEffect(() => {
    const storedData = sessionStorage.getItem('orderConfirmation');
    if (!storedData) {
      // Keine Bestelldaten gefunden, zurück zur Startseite
      navigate('/');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setConfirmationData(data);
      
      // Sprache aus den Daten setzen falls verfügbar
      if (data.orderData?.language) {
        setLanguage(data.orderData.language);
      }

      // Shop-Konfiguration laden
      if (data.orderData?.shop_id) {
        fetchShopConfig(data.orderData.shop_id).then(config => {
          setShopConfig(config);
          if (config.language) {
            setLanguage(config.language);
          }
        });
      }
    } catch (error) {
      console.error("Error parsing confirmation data:", error);
      navigate('/');
    }
  }, [navigate]);

  const handleNewOrder = () => {
    // Bestätigungsdaten löschen und zur Startseite
    sessionStorage.removeItem('orderConfirmation');
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!confirmationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const { orderResponse, customerData, orderData } = confirmationData;
  const isExpressMode = shopConfig?.checkout_mode === "express";
  const accentColor = shopConfig?.accent_color || "#16a34a";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-green-600 hover:text-green-800 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-green-900">
                  {getTranslation("order_confirmation", language)}
                </h1>
                <p className="text-green-700">
                  {getTranslation("order_number", language)}: {orderResponse.confirmation_number}
                </p>
              </div>
            </div>
            {shopConfig?.logo_url && (
              <img 
                src={shopConfig.logo_url} 
                alt={shopConfig.company_name}
                className="h-12 object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-green-900">
                    {getTranslation(isExpressMode ? "order_confirmed" : "order_received", language)}
                  </h2>
                  <p className="text-green-700 mt-2 text-lg">
                    {getTranslation(isExpressMode ? "order_confirmed_message" : "order_received_message", language)}
                  </p>
                  <p className="text-green-600 mt-3 text-sm font-medium">
                    {getTranslation(isExpressMode ? "invoice_sent_email" : "confirmation_sent_email", language)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card className="border border-green-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <span className="text-green-900">{getTranslation("order_details", language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-green-900 text-lg">
                        {orderData.product_name}
                      </h3>
                      <p className="text-green-700 mt-1">
                        {orderData.quantity_liters} L × {formatCurrency(orderData.price_per_liter, orderData.currency, language)}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-green-900">
                      {formatCurrency(orderData.price_per_liter * orderData.quantity_liters, orderData.currency, language)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-green-100">
                    <span className="text-green-700">{getTranslation("net_amount", language)}:</span>
                    <span className="font-medium text-green-900">
                      {formatCurrency(orderData.total_net, orderData.currency, language)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-green-100">
                    <span className="text-green-700">
                      {getTranslation("vat", language)} ({Math.round(orderData.tax_rate * 100)}%):
                    </span>
                    <span className="font-medium text-green-900">
                      {formatCurrency(orderData.total_tax, orderData.currency, language)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-green-200 text-lg font-bold">
                    <span className="text-green-900">{getTranslation("total", language)}:</span>
                    <span className="text-green-600">
                      {formatCurrency(orderResponse.total_amount, orderResponse.currency, language)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border border-green-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="text-green-900">{getTranslation("customer_information", language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-green-500" />
                  <span className="text-green-900">{customerData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-green-900">{customerData.phone}</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-green-700 mb-2 font-medium">
                    {getTranslation("delivery_address", language)}:
                  </p>
                  <div className="text-green-900 leading-relaxed">
                    <p className="font-medium">{customerData.first_name} {customerData.last_name}</p>
                    <p>{customerData.delivery_address.street}</p>
                    <p>{customerData.delivery_address.postal_code} {customerData.delivery_address.city}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-green-100">
                  <p className="text-sm text-green-700 mb-1 font-medium">
                    {getTranslation("payment_method", language)}:
                  </p>
                  <p className="text-green-900">
                    {getTranslation(customerData.payment_method, language)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Instructions - Only show for express mode or when bank details are available */}
          {(isExpressMode || orderResponse.payment_instructions?.bank_details) && (
            <Card className="border border-green-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-green-900">
                  {getTranslation("payment_instructions", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Important Notice */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Wichtiger Hinweis zur Zahlung</h4>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        Bitte verwenden Sie den exakten Kontoinhaber und Verwendungszweck wie unten angegeben. 
                        Nur so können wir Ihre Zahlung korrekt Ihrer Bestellung zuordnen und eine schnelle 
                        Bearbeitung gewährleisten.
                      </p>
                    </div>
                  </div>
                </div>

                {orderResponse.payment_instructions?.bank_details ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-900 mb-4 text-lg">
                      {getTranslation("bank_transfer_details", language)}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-green-700 font-semibold text-sm block mb-1">
                          {getTranslation("account_holder", language)}:
                        </span>
                        <p className="text-green-900 font-medium text-lg">
                          {orderResponse.payment_instructions.bank_details.account_holder}
                        </p>
                      </div>
                      <div>
                        <span className="text-green-700 font-semibold text-sm block mb-1">IBAN:</span>
                        <p className="text-green-900 font-mono text-lg font-medium">
                          {orderResponse.payment_instructions.bank_details.iban}
                        </p>
                      </div>
                      <div>
                        <span className="text-green-700 font-semibold text-sm block mb-1">BIC:</span>
                        <p className="text-green-900 font-mono text-lg font-medium">
                          {orderResponse.payment_instructions.bank_details.bic}
                        </p>
                      </div>
                      <div>
                        <span className="text-green-700 font-semibold text-sm block mb-1">
                          {getTranslation("reference", language)}:
                        </span>
                        <p className="text-green-900 font-mono text-lg font-bold bg-yellow-100 px-2 py-1 rounded">
                          {orderResponse.payment_instructions.bank_details.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700">
                      {getTranslation("confirmation_sent_email", language)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              onClick={handlePrint} 
              variant="outline" 
              className="flex-1 h-12 text-lg border-green-200 text-green-700 hover:bg-green-50"
            >
              {getTranslation("print_confirmation", language)}
            </Button>
            <Button 
              onClick={handleNewOrder} 
              className="flex-1 h-12 text-lg font-semibold text-white bg-green-600 hover:bg-green-700"
            >
              {getTranslation("new_order", language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
