import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheFactoryService } from './cache.factory';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheFactoryService,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class ExtendedCacheModule {}
