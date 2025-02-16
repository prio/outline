import {
  IRateLimiterStoreOptions,
  RateLimiterRedis,
} from "rate-limiter-flexible";
import env from "@server/env";
import Redis from "@server/redis";

export default class RateLimiter {
  constructor() {
    throw Error(`Cannot instantiate class!`);
  }

  static readonly RATE_LIMITER_REDIS_KEY_PREFIX = "rl";

  static readonly rateLimiterMap = new Map<string, RateLimiterRedis>();
  static readonly defaultRateLimiter = new RateLimiterRedis({
    storeClient: Redis.defaultClient,
    points: env.RATE_LIMITER_REQUESTS,
    duration: env.RATE_LIMITER_DURATION_WINDOW,
    keyPrefix: this.RATE_LIMITER_REDIS_KEY_PREFIX,
  });

  static getRateLimiter(path: string): RateLimiterRedis {
    return this.rateLimiterMap.get(path) || this.defaultRateLimiter;
  }

  static setRateLimiter(path: string, config: IRateLimiterStoreOptions): void {
    const rateLimiter = new RateLimiterRedis(config);
    this.rateLimiterMap.set(path, rateLimiter);
  }

  static hasRateLimiter(path: string): boolean {
    return this.rateLimiterMap.has(path);
  }
}

/**
 * Re-useable configuration for rate limiter middleware.
 */
export const RateLimiterStrategy = {
  /** Allows five requests per minute, per IP address */
  FivePerMinute: {
    duration: 60,
    requests: 5,
  },
  /** Allows ten requests per minute, per IP address */
  TenPerMinute: {
    duration: 60,
    requests: 10,
  },
  /** Allows ten requests per hour, per IP address */
  TenPerHour: {
    duration: 3600,
    requests: 10,
  },
  /** Allows five requests per hour, per IP address */
  FivePerHour: {
    duration: 3600,
    requests: 5,
  },
};
