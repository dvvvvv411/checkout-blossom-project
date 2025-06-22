
import { 
  fetchOrderDataWithShopId, 
  fetchShopConfig, 
  fetchBankData,
  OrderData, 
  ShopConfig, 
  BankData,
  OrderDataWithShopId 
} from "@/services/api";
import { getCachedShopConfig, setCachedShopConfig } from "@/utils/cache";
import { logger } from "@/utils/logger";

export interface CheckoutInitData {
  orderData: OrderData;
  shopConfig: ShopConfig | null;
  bankData: BankData | null;
  shopId: string;
}

export interface CheckoutLoadingState {
  orderLoading: boolean;
  configLoading: boolean;
  bankLoading: boolean;
  error: Error | null;
}

export class CheckoutService {
  private static instance: CheckoutService;
  private loadingPromises = new Map<string, Promise<any>>();

  static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService();
    }
    return CheckoutService.instance;
  }

  async initializeCheckout(token: string): Promise<CheckoutInitData> {
    logger.info("Initializing checkout with optimized loading");
    const startTime = performance.now();

    try {
      // Step 1: Get order data first (required for shop ID)
      logger.dev("Fetching order data");
      const orderResult = await this.fetchOrderDataWithCache(token);
      const { orderData, shopId } = orderResult;

      logger.dev("=== CHECKOUT SERVICE DEBUG: Order data received ===", {
        shopId,
        orderDataKeys: Object.keys(orderData),
      });

      // Step 2: Parallelize shop config and bank data fetching
      logger.dev("Starting parallel fetch for shop config and bank data");
      const [shopConfig, bankData] = await Promise.allSettled([
        this.fetchShopConfigWithCache(shopId),
        this.fetchBankDataWithCache(shopId)
      ]);

      const finalShopConfig = shopConfig.status === 'fulfilled' ? shopConfig.value : null;
      const finalBankData = bankData.status === 'fulfilled' ? bankData.value : null;

      // Enhanced logging for shop config
      if (shopConfig.status === 'fulfilled' && finalShopConfig) {
        logger.dev("=== CHECKOUT SERVICE DEBUG: Shop config received successfully ===", {
          shopId,
          shopConfigKeys: Object.keys(finalShopConfig),
          paymentMethods: finalShopConfig.payment_methods,
          paymentMethodsType: typeof finalShopConfig.payment_methods,
          paymentMethodsLength: finalShopConfig.payment_methods?.length,
          rawShopConfig: JSON.stringify(finalShopConfig, null, 2)
        });
      } else {
        logger.error("=== CHECKOUT SERVICE DEBUG: Shop config failed ===", {
          status: shopConfig.status,
          reason: shopConfig.status === 'rejected' ? shopConfig.reason : 'Unknown',
          shopId
        });
      }

      if (shopConfig.status === 'rejected') {
        logger.warn("Shop config fetch failed:", shopConfig.reason);
      }
      if (bankData.status === 'rejected') {
        logger.warn("Bank data fetch failed:", bankData.reason);
      }

      const endTime = performance.now();
      logger.info(`Checkout initialization completed in ${Math.round(endTime - startTime)}ms`);

      const result = {
        orderData,
        shopConfig: finalShopConfig,
        bankData: finalBankData,
        shopId
      };

      logger.dev("=== FINAL CHECKOUT INIT RESULT ===", {
        hasOrderData: !!result.orderData,
        hasShopConfig: !!result.shopConfig,
        hasBankData: !!result.bankData,
        shopId: result.shopId,
        shopConfigPaymentMethods: result.shopConfig?.payment_methods,
      });

      return result;
    } catch (error) {
      logger.error("Checkout initialization failed:", error);
      throw error;
    }
  }

  private async fetchOrderDataWithCache(token: string): Promise<OrderDataWithShopId> {
    const cacheKey = `order_${token}`;
    
    if (this.loadingPromises.has(cacheKey)) {
      logger.dev("Using existing order data promise");
      return this.loadingPromises.get(cacheKey)!;
    }

    const promise = fetchOrderDataWithShopId(token);
    this.loadingPromises.set(cacheKey, promise);

    try {
      const result = await promise;
      logger.dev("Order data fetched successfully", {
        shopId: result.shopId,
        orderDataKeys: Object.keys(result.orderData)
      });
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private async fetchShopConfigWithCache(shopId: string): Promise<ShopConfig> {
    // Check cache first
    const cached = getCachedShopConfig(shopId);
    if (cached) {
      logger.dev("Using cached shop config", {
        shopId,
        cachedPaymentMethods: cached.payment_methods
      });
      return cached;
    }

    const cacheKey = `config_${shopId}`;
    
    if (this.loadingPromises.has(cacheKey)) {
      logger.dev("Using existing shop config promise");
      return this.loadingPromises.get(cacheKey)!;
    }

    logger.dev("Fetching fresh shop config from API", { shopId });
    const promise = fetchShopConfig(shopId);
    this.loadingPromises.set(cacheKey, promise);

    try {
      const result = await promise;
      logger.dev("Fresh shop config fetched successfully", {
        shopId,
        paymentMethods: result.payment_methods,
        resultKeys: Object.keys(result)
      });
      setCachedShopConfig(shopId, result);
      return result;
    } catch (error) {
      logger.error("Failed to fetch shop config", { shopId, error });
      throw error;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private async fetchBankDataWithCache(shopId: string): Promise<BankData | null> {
    const cacheKey = `bank_${shopId}`;
    
    if (this.loadingPromises.has(cacheKey)) {
      logger.dev("Using existing bank data promise");
      return this.loadingPromises.get(cacheKey)!;
    }

    const promise = fetchBankData(shopId);
    this.loadingPromises.set(cacheKey, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  clearCache(): void {
    this.loadingPromises.clear();
    logger.dev("Checkout service cache cleared");
  }
}

export const checkoutService = CheckoutService.getInstance();
