// Advanced caching system for ultra-fast data access

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  hits: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  strategy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction strategy
}

class AdvancedCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder: string[] = []; // For LRU
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      strategy: options.strategy || 'lru',
    };
  }

  // Set cache entry
  set(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.options.ttl);

    // Evict if cache is full
    if (this.cache.size >= this.options.maxSize) {
      this.evict();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
      hits: 0,
    });

    // Update access order for LRU
    if (this.options.strategy === 'lru') {
      this.accessOrder.push(key);
    }
  }

  // Get cache entry
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    // Update hits for LFU
    entry.hits++;

    // Update access order for LRU
    if (this.options.strategy === 'lru') {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
        this.accessOrder.push(key);
      }
    }

    return entry.data;
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  // Delete cache entry
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    if (this.options.strategy === 'lru') {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    }

    return deleted;
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  // Evict based on strategy
  private evict(): void {
    let keyToEvict: string | undefined;

    switch (this.options.strategy) {
      case 'lru': // Least Recently Used
        keyToEvict = this.accessOrder[0];
        break;

      case 'lfu': // Least Frequently Used
        let minHits = Infinity;
        this.cache.forEach((entry, key) => {
          if (entry.hits < minHits) {
            minHits = entry.hits;
            keyToEvict = key;
          }
        });
        break;

      case 'fifo': // First In First Out
        keyToEvict = this.cache.keys().next().value;
        break;
    }

    if (keyToEvict) {
      this.delete(keyToEvict);
    }
  }

  // Get cache stats
  getStats() {
    let totalHits = 0;
    let expired = 0;
    const now = Date.now();

    this.cache.forEach((entry) => {
      totalHits += entry.hits;
      if (now > entry.expiresAt) expired++;
    });

    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      totalHits,
      expired,
      hitRate: totalHits / this.cache.size || 0,
    };
  }

  // Clean expired entries
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.delete(key);
        cleaned++;
      }
    });

    return cleaned;
  }
}

// Global cache instances
export const apiCache = new AdvancedCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  strategy: 'lru',
});

export const imageCache = new AdvancedCache({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 200,
  strategy: 'lfu',
});

export const routeCache = new AdvancedCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 50,
  strategy: 'lru',
});

// Cached fetch wrapper
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  cacheTTL?: number
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`;

  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] ${url}`);
    return cached as T;
  }

  console.log(`[Cache MISS] ${url}`);

  // Fetch from network
  const response = await fetch(url, options);
  const data = await response.json();

  // Cache the result
  apiCache.set(cacheKey, data, cacheTTL);

  return data as T;
}

// Memoization with cache
export function memoizeWithCache<T extends (...args: any[]) => any>(
  fn: T,
  cache: AdvancedCache = new AdvancedCache()
): T {
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

// Periodic cache cleanup
export function startCacheCleanup(interval: number = 60000) {
  const cleanup = () => {
    const apiCleaned = apiCache.cleanup();
    const imageCleaned = imageCache.cleanup();
    const routeCleaned = routeCache.cleanup();

    if (apiCleaned + imageCleaned + routeCleaned > 0) {
      console.log('[Cache Cleanup]', {
        api: apiCleaned,
        images: imageCleaned,
        routes: routeCleaned,
      });
    }
  };

  const intervalId = setInterval(cleanup, interval);
  
  // Initial cleanup
  cleanup();

  return () => clearInterval(intervalId);
}

// Cache warming - preload data
export async function warmCache(urls: string[]) {
  console.log('[Cache Warming] Preloading', urls.length, 'URLs');

  const promises = urls.map(async (url) => {
    try {
      await cachedFetch(url);
    } catch (error) {
      console.warn(`[Cache Warming] Failed to load ${url}:`, error);
    }
  });

  await Promise.allSettled(promises);
  console.log('[Cache Warming] Complete');
}

// Export cache class for custom instances
export { AdvancedCache };
