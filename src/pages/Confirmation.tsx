
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, MapPin, Mail, Phone, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/services/api";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-900">
                    {getTranslation("order_confirmed", language)}
                  </h2>
                  <p className="text-green-700 mt-1">
                    {getTranslation("order_confirmed_message", language)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>{getTranslation("order_details", language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{getTranslation("product", language)}:</span>
                  <span className="font-medium">{orderData.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{getTranslation("quantity", language)}:</span>
                  <span className="font-medium">{orderData.quantity_liters} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{getTranslation("price_per_liter", language)}:</span>
                  <span className="font-medium">
                    {formatCurrency(orderData.price_per_liter, orderData.currency, language)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{getTranslation("total", language)}:</span>
                    <span>
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
                  <MapPin className="h-5 w-5" />
                  <span>{getTranslation("customer_information", language)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{customerData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{customerData.phone}</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-1">{getTranslation("delivery_address", language)}:</p>
                  <div className="text-sm">
                    <p>{customerData.first_name} {customerData.last_name}</p>
                    <p>{customerData.delivery_address.street}</p>
                    <p>{customerData.delivery_address.postal_code} {customerData.delivery_address.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Instructions */}
          {orderResponse.payment_instructions?.bank_details && (
            <Card>
              <CardHeader>
                <CardTitle>{getTranslation("payment_instructions", language)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">
                    {getTranslation("bank_transfer_details", language)}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">{getTranslation("account_holder", language)}:</span>
                      <p className="text-blue-900">{orderResponse.payment_instructions.bank_details.account_holder}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">IBAN:</span>
                      <p className="text-blue-900 font-mono">{orderResponse.payment_instructions.bank_details.iban}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">BIC:</span>
                      <p className="text-blue-900 font-mono">{orderResponse.payment_instructions.bank_details.bic}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">{getTranslation("reference", language)}:</span>
                      <p className="text-blue-900 font-mono">{orderResponse.payment_instructions.bank_details.reference}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              {getTranslation("print_confirmation", language)}
            </Button>
            <Button onClick={handleNewOrder} className="flex-1 bg-green-600 hover:bg-green-700">
              {getTranslation("new_order", language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
