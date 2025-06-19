
import { ShopConfig } from "@/services/api";
import { logger } from "@/utils/logger";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    logger.dev(`Cache set: ${key}`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      logger.dev(`Cache expired: ${key}`);
      return null;
    }

    logger.dev(`Cache hit: ${key}`);
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
    logger.dev("Cache cleared");
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const cache = new Cache();

// Specialized cache functions
export const getCachedShopConfig = (shopId: string): ShopConfig | null => {
  return cache.get<ShopConfig>(`shop_config_${shopId}`);
};

export const setCachedShopConfig = (shopId: string, config: ShopConfig): void => {
  cache.set(`shop_config_${shopId}`, config, 10 * 60 * 1000); // 10 minutes TTL
};
