
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, CreditCard, MapPin, Mail, Phone, ArrowLeft, Truck } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { orderResponse, customerData, orderData } = confirmationData;
  const isExpressMode = shopConfig?.checkout_mode === "express";
  const accentColor = shopConfig?.accent_color || "#2563eb";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getTranslation("order_confirmation", language)}
                </h1>
                <p className="text-gray-600">
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
          {/* Success Message - Modernized */}
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              {isExpressMode ? (
                <CheckCircle className="h-24 w-24 text-green-600" />
              ) : (
                <Info className="h-24 w-24 text-blue-600" />
              )}
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${isExpressMode ? 'text-green-900' : 'text-blue-900'}`}>
              {getTranslation(isExpressMode ? "order_confirmed" : "order_received", language)}
            </h2>
            <p className={`text-xl mb-6 ${isExpressMode ? 'text-green-700' : 'text-blue-700'}`}>
              {getTranslation(isExpressMode ? "order_confirmed_message" : "order_received_message", language)}
            </p>
            <p className={`text-lg font-medium ${isExpressMode ? 'text-green-600' : 'text-blue-600'}`}>
              {getTranslation(isExpressMode ? "invoice_sent_email" : "confirmation_sent_email", language)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" style={{ color: accentColor }} />
                  <span>{getTranslation("order_details", language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {orderData.product_name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {orderData.quantity_liters} L × {formatCurrency(orderData.price_per_liter, orderData.currency, language)}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(orderData.price_per_liter * orderData.quantity_liters, orderData.currency, language)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">{getTranslation("net_amount", language)}:</span>
                    <span className="font-medium">
                      {formatCurrency(orderData.total_net, orderData.currency, language)}
                    </span>
                  </div>
                  {orderData.delivery_cost && orderData.delivery_cost > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">{getTranslation("delivery", language)}:</span>
                      <span className="font-medium">
                        {formatCurrency(orderData.delivery_cost, orderData.currency, language)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">
                      {getTranslation("vat", language)} ({Math.round(orderData.tax_rate * 100)}%):
                    </span>
                    <span className="font-medium">
                      {formatCurrency(orderData.total_tax, orderData.currency, language)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-200 text-lg font-bold">
                    <span>{getTranslation("total", language)}:</span>
                    <span style={{ color: accentColor }}>
                      {formatCurrency(orderResponse.total_amount, orderResponse.currency, language)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" style={{ color: accentColor }} />
                  <span>{getTranslation("customer_information", language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{customerData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{customerData.phone}</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    {getTranslation("delivery_address", language)}:
                  </p>
                  <div className="text-gray-900 leading-relaxed">
                    <p className="font-medium">{customerData.first_name} {customerData.last_name}</p>
                    <p>{customerData.delivery_address.street}</p>
                    <p>{customerData.delivery_address.postal_code} {customerData.delivery_address.city}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-1 font-medium">
                    {getTranslation("payment_method", language)}:
                  </p>
                  <p className="text-gray-900">
                    {getTranslation(customerData.payment_method, language)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: accentColor }}>
                {getTranslation("payment_instructions", language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Next Steps */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">
                    Nächste Schritte
                  </h4>
                  
                  {isExpressMode ? (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Überweisung</h5>
                          <p className="text-gray-700">
                            Nach unserem Anruf überweisen Sie den Betrag von{' '}
                            <span className="font-bold">
                              {formatCurrency(orderResponse.total_amount, orderResponse.currency, language)}
                            </span>{' '}
                            auf unser Konto.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Lieferung</h5>
                          <p className="text-gray-700">
                            Nach Zahlungseingang erfolgt die Lieferung innerhalb weniger Werktage.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Telefonischer Kontakt</h5>
                          <p className="text-gray-700">
                            Wir rufen Sie in den nächsten 24 Stunden an, um Ihre Bestellung zu bestätigen.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Überweisung</h5>
                          <p className="text-gray-700">
                            Nach unserem Anruf überweisen Sie den Betrag von{' '}
                            <span className="font-bold">
                              {formatCurrency(orderResponse.total_amount, orderResponse.currency, language)}
                            </span>{' '}
                            auf unser Konto.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Lieferung</h5>
                          <p className="text-gray-700">
                            Nach Zahlungseingang erfolgt die Lieferung in 4-7 Werktagen.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bank Details */}
                {orderResponse.payment_instructions?.bank_details && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-6">
                    <h4 className="font-bold text-blue-900 mb-4 text-lg">
                      {getTranslation("bank_transfer_details", language)}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-blue-700 font-semibold text-sm block mb-1">
                          {getTranslation("account_holder", language)}:
                        </span>
                        <p className="text-blue-900 font-medium text-lg">
                          {orderResponse.payment_instructions.bank_details.account_holder}
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-semibold text-sm block mb-1">IBAN:</span>
                        <p className="text-blue-900 font-mono text-lg font-medium">
                          {orderResponse.payment_instructions.bank_details.iban}
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-semibold text-sm block mb-1">BIC:</span>
                        <p className="text-blue-900 font-mono text-lg font-medium">
                          {orderResponse.payment_instructions.bank_details.bic}
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-semibold text-sm block mb-1">
                          {getTranslation("reference", language)}:
                        </span>
                        <p className="text-blue-900 font-mono text-lg font-bold bg-yellow-100 px-2 py-1 rounded">
                          {orderResponse.payment_instructions.bank_details.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" style={{ color: accentColor }} />
                <span>Lieferinformationen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                <h4 className="font-bold text-amber-900 mb-3 text-lg">
                  Wichtiger Hinweis zur Lieferung
                </h4>
                <p className="text-amber-800">
                  Unser Fahrer wird Sie am Liefertag telefonisch kontaktieren. Bitte stellen Sie sicher, dass Sie unter{' '}
                  <span className="font-bold">{customerData.phone}</span> erreichbar sind.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button onClick={handlePrint} variant="outline" className="flex-1 h-12 text-lg">
              {getTranslation("print_confirmation", language)}
            </Button>
            <Button 
              onClick={handleNewOrder} 
              className="flex-1 h-12 text-lg font-semibold text-white"
              style={{ backgroundColor: accentColor }}
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
