import { createKeyv } from '@keyv/redis';
import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import redisConfig, { RedisConfig } from '../config/redis/redis.config';

@Injectable()
export class RedisFactoryService implements CacheOptionsFactory {
  constructor(
    @Inject(redisConfig.KEY)
    private readonly config: RedisConfig,
  ) {}

  createCacheOptions(): CacheOptions {
    const { host, port } = this.config;

    return {
      stores: createKeyv(`redis://${host}:${port}`),
    };
  }
}
