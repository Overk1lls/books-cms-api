import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisFactoryService } from './redis.factory';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisFactoryService,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
