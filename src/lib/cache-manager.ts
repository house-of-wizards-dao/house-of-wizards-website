import { Redis } from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  serialize?: boolean; // Whether to JSON serialize/deserialize
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalKeys: number;
}

export class CacheManager {
  private redis: Redis | null = null;
  private fallbackCache: Map<
    string,
    { value: any; expires: number; tags: string[] }
  > = new Map();
  private stats = { hits: 0, misses: 0 };
  private readonly DEFAULT_TTL = 300; // 5 minutes

  constructor() {
    this.initializeRedis();

    // Cleanup fallback cache every 5 minutes
    setInterval(
      () => {
        this.cleanupFallbackCache();
      },
      5 * 60 * 1000,
    );
  }

  private async initializeRedis() {
    if (!env.REDIS_URL) {
      logger.warn("Redis URL not configured, using in-memory fallback cache");
      return;
    }

    try {
      this.redis = new Redis(env.REDIS_URL, {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
      });

      await this.redis.ping();
      logger.info("Redis cache connected successfully");

      this.redis.on("error", (error) => {
        logger.error("Redis cache error", { error });
        // Don't set redis to null, keep trying to reconnect
      });

      this.redis.on("connect", () => {
        logger.info("Redis cache reconnected");
      });
    } catch (error) {
      logger.warn("Failed to connect to Redis, using fallback cache", {
        error,
      });
      this.redis = null;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redis && this.redis.status === "ready") {
        const value = await this.redis.get(this.prefixKey(key));
        if (value !== null) {
          this.stats.hits++;
          return JSON.parse(value);
        }
      } else {
        // Fallback to in-memory cache
        const cached = this.fallbackCache.get(key);
        if (cached && cached.expires > Date.now()) {
          this.stats.hits++;
          return cached.value;
        } else if (cached) {
          this.fallbackCache.delete(key);
        }
      }

      this.stats.misses++;
      return null;
    } catch (error) {
      logger.error("Cache get error", { error, key });
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {},
  ): Promise<boolean> {
    try {
      const ttl = options.ttl || this.DEFAULT_TTL;
      const serialized = JSON.stringify(value);

      if (this.redis && this.redis.status === "ready") {
        await this.redis.setex(this.prefixKey(key), ttl, serialized);

        // Store tags for invalidation
        if (options.tags) {
          for (const tag of options.tags) {
            await this.redis.sadd(this.tagKey(tag), this.prefixKey(key));
            await this.redis.expire(this.tagKey(tag), ttl);
          }
        }
      } else {
        // Fallback to in-memory cache
        this.fallbackCache.set(key, {
          value,
          expires: Date.now() + ttl * 1000,
          tags: options.tags || [],
        });
      }

      return true;
    } catch (error) {
      logger.error("Cache set error", { error, key });
      return false;
    }
  }

  /**
   * Delete specific key from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      if (this.redis && this.redis.status === "ready") {
        const result = await this.redis.del(this.prefixKey(key));
        return result > 0;
      } else {
        return this.fallbackCache.delete(key);
      }
    } catch (error) {
      logger.error("Cache delete error", { error, key });
      return false;
    }
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<number> {
    if (!this.redis || this.redis.status !== "ready") {
      // Fallback cache tag invalidation
      let deleted = 0;
      for (const [key, cached] of this.fallbackCache.entries()) {
        if (cached.tags.some((tag) => tags.includes(tag))) {
          this.fallbackCache.delete(key);
          deleted++;
        }
      }
      return deleted;
    }

    try {
      let totalDeleted = 0;

      for (const tag of tags) {
        const keys = await this.redis.smembers(this.tagKey(tag));
        if (keys.length > 0) {
          const deleted = await this.redis.del(...keys);
          totalDeleted += deleted;
        }
        await this.redis.del(this.tagKey(tag));
      }

      logger.info(`Cache invalidated by tags`, {
        tags,
        keysDeleted: totalDeleted,
      });
      return totalDeleted;
    } catch (error) {
      logger.error("Cache tag invalidation error", { error, tags });
      return 0;
    }
  }

  /**
   * Get or set pattern - fetch from cache or compute and cache
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Compute the value
    const value = await fetcher();

    // Cache the result
    await this.set(key, value, options);

    return value;
  }

  /**
   * Cache frequently accessed profile data
   */
  async cacheProfile(
    userId: string,
    profileData: any,
    ttl: number = 600,
  ): Promise<void> {
    await this.set(`profile:${userId}`, profileData, {
      ttl,
      tags: [`user:${userId}`, "profiles"],
    });
  }

  /**
   * Get cached profile
   */
  async getCachedProfile(userId: string): Promise<any> {
    return this.get(`profile:${userId}`);
  }

  /**
   * Cache user content list
   */
  async cacheUserContent(
    userId: string,
    content: any[],
    ttl: number = 300,
  ): Promise<void> {
    await this.set(`content:${userId}`, content, {
      ttl,
      tags: [`user:${userId}`, "content"],
    });
  }

  /**
   * Get cached content
   */
  async getCachedUserContent(userId: string): Promise<any[] | null> {
    return this.get(`content:${userId}`);
  }

  /**
   * Cache search results
   */
  async cacheSearchResults(
    query: string,
    results: any[],
    ttl: number = 180,
  ): Promise<void> {
    const key = `search:${Buffer.from(query).toString("base64")}`;
    await this.set(key, results, {
      ttl,
      tags: ["search", "content"],
    });
  }

  /**
   * Get cached search results
   */
  async getCachedSearchResults(query: string): Promise<any[] | null> {
    const key = `search:${Buffer.from(query).toString("base64")}`;
    return this.get(key);
  }

  /**
   * Invalidate user-related cache
   */
  async invalidateUserCache(userId: string): Promise<void> {
    await this.invalidateByTags([`user:${userId}`]);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      totalKeys: this.fallbackCache.size,
    };
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      if (this.redis && this.redis.status === "ready") {
        await this.redis.flushdb();
      }
      this.fallbackCache.clear();
      logger.info("Cache cleared");
    } catch (error) {
      logger.error("Cache clear error", { error });
    }
  }

  private prefixKey(key: string): string {
    return `how_dao:${key}`;
  }

  private tagKey(tag: string): string {
    return `how_dao:tag:${tag}`;
  }

  private cleanupFallbackCache(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, cached] of this.fallbackCache.entries()) {
      if (cached.expires <= now) {
        this.fallbackCache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned ${cleaned} expired cache entries`);
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

/**
 * Decorator for caching method results
 */
export function cached(key: string, options: CacheOptions = {}) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = typeof key === "function" ? key(...args) : key;

      return cacheManager.getOrSet(
        cacheKey,
        () => method.apply(this, args),
        options,
      );
    };
  };
}
