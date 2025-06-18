import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, CreditCard, MapPin, Mail, Phone, ArrowLeft, Truck, Copy } from "lucide-react";
import { formatCurrency, fetchShopConfig, fetchBankData, ShopConfig, BankData } from "@/services/api";
import { getTranslation, getProductNameTranslation } from "@/utils/translations";
import { formatIBAN } from "@/utils/formatters";
import { logger } from "@/utils/logger";

interface OrderConfirmationData {
  orderResponse: {
    order_id: string;
    order_number?: string; // Added 7-digit order number
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
  shopConfig?: ShopConfig;
  bankData?: BankData;
  submittedAt: string;
}

const Confirmation = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<OrderConfirmationData | null>(null);
  const [shopConfig, setShopConfig] = useState<ShopConfig | null>(null);
  const [loadedBankData, setLoadedBankData] = useState<BankData | null>(null);
  const [language, setLanguage] = useState<"DE" | "EN" | "FR">("DE");

  useEffect(() => {
    logger.dev("Confirmation page loading");
    
    const storedData = sessionStorage.getItem('orderConfirmation');
    
    if (!storedData) {
      logger.error("No order confirmation data found in sessionStorage");
      navigate('/');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      logger.dev("Order confirmation data loaded", {
        hasOrderResponse: !!data.orderResponse,
        hasCustomerData: !!data.customerData,
        hasOrderData: !!data.orderData,
        hasShopConfig: !!data.shopConfig,
        hasBankData: !!data.bankData
      });
      
      setConfirmationData(data);
      
      // Set language from order data if available
      if (data.orderData?.language) {
        logger.dev("Setting language from orderData", data.orderData.language);
        setLanguage(data.orderData.language);
      }

      // Use shop configuration - first from sessionStorage, then API
      if (data.shopConfig) {
        logger.dev("Using shop config from sessionStorage", {
          checkoutMode: data.shopConfig.checkout_mode
        });
        setShopConfig(data.shopConfig);
        if (data.shopConfig.language) {
          setLanguage(data.shopConfig.language);
        }
      } else if (data.orderData?.shop_id) {
        logger.dev("Fetching shop config from API", data.orderData.shop_id);
        fetchShopConfig(data.orderData.shop_id).then(config => {
          logger.dev("Shop config loaded from API", {
            checkoutMode: config.checkout_mode
          });
          setShopConfig(config);
          if (config.language) {
            setLanguage(config.language);
          }
        });
      }
    } catch (error) {
      logger.error("Error parsing confirmation data", error);
      navigate('/');
    }
  }, [navigate]);

  // Enhanced Express Mode detection with comprehensive debugging
  useEffect(() => {
    if (confirmationData && shopConfig) {
      const checkoutMode = shopConfig.checkout_mode;
      const isInstantMode = checkoutMode === "instant";
      
      logger.dev("Instant mode detection", {
        checkoutMode,
        isInstantMode
      });
      
      const bankDetailsFromResponse = confirmationData.orderResponse.payment_instructions?.bank_details;
      const bankDataFromStorage = confirmationData.bankData;
      const bankDetailsAvailable = bankDetailsFromResponse || bankDataFromStorage;
      
      logger.dev("Bank details availability", {
        fromResponse: !!bankDetailsFromResponse,
        fromStorage: !!bankDataFromStorage,
        available: !!bankDetailsAvailable
      });
      
      if (isInstantMode && !bankDetailsAvailable) {
        logger.warn("Instant mode enabled but no bank details found", {
          checkoutMode: shopConfig.checkout_mode,
          hasBankDetailsInResponse: !!bankDetailsFromResponse,
          hasBankDataInStorage: !!bankDataFromStorage
        });
      }
    }
  }, [confirmationData, shopConfig]);

  // Fetch bank data when in instant mode and no bank data is available
  useEffect(() => {
    if (confirmationData && shopConfig) {
      const isInstantMode = shopConfig.checkout_mode === "instant";
      const bankDetailsFromResponse = confirmationData.orderResponse.payment_instructions?.bank_details;
      const bankDataFromStorage = confirmationData.bankData;
      const hasBankDetails = !!(bankDetailsFromResponse || bankDataFromStorage || loadedBankData);
      
      if (isInstantMode && !hasBankDetails && confirmationData.orderData?.shop_id) {
        logger.info("Fetching bank data for instant mode", confirmationData.orderData.shop_id);
        
        fetchBankData(confirmationData.orderData.shop_id)
          .then(bankData => {
            if (bankData) {
              setLoadedBankData(bankData);
              logger.info("Bank data successfully loaded");
            } else {
              logger.warn("No bank data returned from API");
            }
          })
          .catch(error => {
            logger.error("Error fetching bank data", error);
          });
      }
    }
  }, [confirmationData, shopConfig, loadedBankData]);

  const handleBackToShop = () => {
    // Get shop URL from various sources
    const shopUrl = shopConfig?.shop_url || 
                   confirmationData?.shopConfig?.shop_url;
    
    if (shopUrl) {
      logger.dev("Redirecting to shop URL:", shopUrl);
      window.location.href = shopUrl;
    } else {
      logger.dev("No shop URL found, navigating to home");
      navigate('/');
    }
  };

  const handleNewOrder = () => {
    // Clear confirmation data and go to home
    sessionStorage.removeItem('orderConfirmation');
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = async (text: string, label: string) => {
    try {
      // For IBAN, copy the clean version without spaces
      const cleanText = label === "IBAN" ? text.replace(/\s/g, '') : text;
      await navigator.clipboard.writeText(cleanText);
      logger.dev("Copied to clipboard", { label, text: cleanText });
    } catch (err) {
      logger.error("Failed to copy to clipboard", err);
    }
  };

  if (!confirmationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { orderResponse, customerData, orderData } = confirmationData;
  
  // Enhanced Instant Mode detection - check for "instant" mode only
  const checkoutMode = shopConfig?.checkout_mode;
  const isInstantMode = checkoutMode === "instant";
  const accentColor = shopConfig?.accent_color || "#2563eb";

  // Enhanced bank details detection - check all sources including loaded bank data
  const bankDetailsFromResponse = orderResponse.payment_instructions?.bank_details;
  const bankDataFromStorage = confirmationData.bankData;
  const hasBankDetails = !!(bankDetailsFromResponse || bankDataFromStorage || loadedBankData);

  // Get bank details from the best available source, with loaded data taking priority
  // Use order_number as payment reference, fallback to order_id, then confirmation_number
  const paymentReference = orderResponse.order_number || orderResponse.order_id || orderResponse.confirmation_number;
  const bankDetails = bankDetailsFromResponse || 
    (loadedBankData ? {
      account_holder: loadedBankData.account_holder,
      iban: loadedBankData.iban,
      bic: loadedBankData.bic,
      reference: paymentReference
    } : null) ||
    (bankDataFromStorage ? {
      account_holder: bankDataFromStorage.account_holder,
      iban: bankDataFromStorage.iban,
      bic: bankDataFromStorage.bic,
      reference: paymentReference
    } : null);

  // Get display order number - prefer order_number, fallback to order_id
  const displayOrderNumber = orderResponse.order_number || orderResponse.order_id;

  // Get translated product name
  const translatedProductName = getProductNameTranslation(orderData.product_name, language);

  logger.dev("Confirmation page render", {
    isInstantMode,
    hasBankDetails,
    displayOrderNumber,
    translatedProductName
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToShop}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getTranslation("order_confirmation", language)}
                </h1>
                <p className="text-gray-600">
                  {getTranslation("order_number", language)}: {displayOrderNumber}
                </p>
              </div>
            </div>
            {shopConfig?.logo_url && (
              <img 
                src={shopConfig.logo_url} 
                alt={shopConfig.company_name}
                className="h-24 object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Success Message - Centered at top */}
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              {isInstantMode ? (
                <CheckCircle className="h-24 w-24 text-green-600" />
              ) : (
                <Info className="h-24 w-24 text-blue-600" />
              )}
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${isInstantMode ? 'text-green-900' : 'text-blue-900'}`}>
              {getTranslation(isInstantMode ? "order_confirmed" : "order_received", language)}
            </h2>
            <p className={`text-xl mb-6 ${isInstantMode ? 'text-green-700' : 'text-blue-700'}`}>
              {getTranslation(isInstantMode ? "order_confirmed_message" : "order_received_message", language)}
            </p>
            <p className={`text-lg font-medium ${isInstantMode ? 'text-green-600' : 'text-blue-600'}`}>
              {getTranslation(isInstantMode ? "invoice_sent_email" : "confirmation_sent_email", language)}
            </p>
          </div>

          {/* Two Column Layout - Adjusted widths */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Payment Instructions and Delivery Information (wider - 2/3) */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
              {/* Payment Instructions */}
              <Card className="flex-1">
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
                        {getTranslation("next_steps", language)}
                      </h4>
                      
                      {isInstantMode ? (
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              1
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-1">{getTranslation("bank_transfer", language)}</h5>
                              <p className="text-gray-700">
                                {getTranslation("bank_transfer_description", language)}{' '}
                                <span className="font-bold">
                                  {formatCurrency(orderResponse.total_amount, orderResponse.currency, language)}
                                </span>{' '}
                                {getTranslation("bank_transfer_to_account", language)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              2
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-1">{getTranslation("delivery", language)}</h5>
                              <p className="text-gray-700">
                                {getTranslation("delivery_after_payment", language)}
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
                              <h5 className="font-semibold text-gray-900 mb-1">{getTranslation("order_review", language)}</h5>
                              <p className="text-gray-700">
                                {getTranslation("order_review_description", language)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              2
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-1">{getTranslation("phone_contact", language)}</h5>
                              <p className="text-gray-700">
                                {getTranslation("phone_contact_description", language)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              3
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-1">{getTranslation("delivery", language)}</h5>
                              <p className="text-gray-700">
                                {getTranslation("delivery_timeframe", language)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bank Details - Show in Instant Mode when available */}
                    {isInstantMode && bankDetails && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-6">
                        <h4 className="font-bold text-blue-900 mb-4 text-lg">
                          {getTranslation("bank_transfer_details", language)}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <span className="text-blue-700 font-semibold text-sm block mb-1">
                              {getTranslation("account_holder", language)}:
                            </span>
                            <div className="flex items-center justify-between">
                              <p className="text-blue-900 font-medium text-lg">
                                {bankDetails.account_holder}
                              </p>
                              <button
                                onClick={() => handleCopyToClipboard(
                                  bankDetails.account_holder,
                                  getTranslation("account_holder", language)
                                )}
                                className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                title={getTranslation("copy_tooltip", language)}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700 font-semibold text-sm block mb-1">IBAN:</span>
                            <div className="flex items-center justify-between">
                              <p className="text-blue-900 font-mono text-lg font-medium">
                                {formatIBAN(bankDetails.iban)}
                              </p>
                              <button
                                onClick={() => handleCopyToClipboard(formatIBAN(bankDetails.iban), "IBAN")}
                                className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                title={getTranslation("copy_tooltip", language)}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700 font-semibold text-sm block mb-1">BIC:</span>
                            <div className="flex items-center justify-between">
                              <p className="text-blue-900 font-mono text-lg font-medium">
                                {bankDetails.bic}
                              </p>
                              <button
                                onClick={() => handleCopyToClipboard(bankDetails.bic, "BIC")}
                                className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                title={getTranslation("copy_tooltip", language)}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700 font-semibold text-sm block mb-1">
                              {getTranslation("reference", language)}:
                            </span>
                            <div className="flex items-center justify-between">
                              <p className="text-blue-900 font-mono text-lg font-bold bg-yellow-100 px-2 py-1 rounded">
                                {bankDetails.reference}
                              </p>
                              <button
                                onClick={() => handleCopyToClipboard(
                                  bankDetails.reference,
                                  getTranslation("reference", language)
                                )}
                                className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                title={getTranslation("copy_tooltip", language)}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Standard/Manual Mode Message - Only show when NOT in Instant Mode */}
                    {!isInstantMode && (
                      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mt-6">
                        <h4 className="font-bold text-amber-900 mb-3 text-lg">
                          {getTranslation("important_notice", language)}
                        </h4>
                        <p className="text-amber-800">
                          {getTranslation("manual_mode_notice", language)}
                        </p>
                        <p className="text-amber-800 mt-2">
                          {getTranslation("manual_mode_phone_notice", language)} <span className="font-bold">{customerData.phone}</span> {getTranslation("delivery_notice_reachable", language)}
                        </p>
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
                    <span>{getTranslation("delivery_info", language)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                    <h4 className="font-bold text-amber-900 mb-3 text-lg">
                      {getTranslation("delivery_notice_title", language)}
                    </h4>
                    <p className="text-amber-800">
                      {getTranslation("delivery_notice_description", language)}{' '}
                      <span className="font-bold">{customerData.phone}</span> {getTranslation("delivery_notice_reachable", language)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Details and Customer Information (narrower - 1/3) */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
              {/* Order Details */}
              <Card className="flex-1">
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
                          {translatedProductName}
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
          </div>

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
