import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Controller, Get, Inject, OnApplicationShutdown } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import redisConfig, { RedisConfig } from '../config/redis/redis.config';

@Controller('health')
export class HealthController implements OnApplicationShutdown {
  private readonly redis: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    redisConfig: RedisConfig,

    private readonly healthService: HealthCheckService,
    private readonly dbIndicator: TypeOrmHealthIndicator,
    private readonly redisIndication: RedisHealthIndicator,
  ) {
    this.redis = new Redis(redisConfig);
  }

  onApplicationShutdown(): void {
    this.redis.disconnect();
  }

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return await this.healthService.check([
      () => this.dbIndicator.pingCheck('database'),
      () =>
        this.redisIndication.checkHealth('redis', {
          type: 'redis',
          client: this.redis,
          timeout: 500,
        }),
    ]);
  }
}
