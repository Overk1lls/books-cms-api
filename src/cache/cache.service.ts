import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements OnApplicationShutdown {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.cache.disconnect();
  }

  async set<T = unknown>(
    key: string,
    value: T,
    ttl: number = 3600,
  ): Promise<T> {
    return await this.cache.set<T>(key, value, ttl);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    return await this.cache.get<T>(key);
  }

  async delete(key: string): Promise<boolean> {
    return await this.cache.del(key);
  }

  async clear(): Promise<boolean> {
    return await this.cache.clear();
  }
}
