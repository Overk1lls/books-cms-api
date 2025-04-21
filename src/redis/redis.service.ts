import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async setCache<T = unknown>(
    key: string,
    value: T,
    ttl: number = 3600,
  ): Promise<T> {
    return await this.cache.set<T>(key, value, ttl);
  }

  async getCache<T = unknown>(key: string): Promise<T | null> {
    return await this.cache.get<T>(key);
  }

  async deleteCache(key: string): Promise<boolean> {
    return await this.cache.del(key);
  }

  async clear(): Promise<boolean> {
    return await this.cache.clear();
  }
}
