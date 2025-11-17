import { CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { ExtendedConfigModule } from '../config/config.module';
import { CacheFactoryService } from './cache.factory';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ExtendedConfigModule,
        CacheModule.registerAsync({
          isGlobal: true,
          useClass: CacheFactoryService,
        }),
      ],
      providers: [CacheService],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
