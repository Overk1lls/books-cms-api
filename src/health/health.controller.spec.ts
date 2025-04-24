import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import {
  HealthCheckResult,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtendedConfigModule } from '../config/config.module';
import { TypeOrmFactoryService } from '../db/db.factory';
import { HealthController } from './health.controller';
import { HealthModule } from './health.module';

describe('HealthController', () => {
  let module: TestingModule;
  let controller: HealthController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ExtendedConfigModule,
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmFactoryService,
        }),
        HealthModule,
      ],
      providers: [
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockResolvedValue(<HealthIndicatorResult>{
              database: {
                status: 'up',
              },
            }),
          },
        },
        {
          provide: RedisHealthIndicator,
          useValue: {
            checkHealth: jest.fn().mockResolvedValue(<HealthIndicatorResult>{
              redis: {
                status: 'up',
              },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('health', () => {
    it('should give health status', async () => {
      const result = await controller.check();

      expect(result).toEqual<HealthCheckResult>({
        status: 'ok',
        error: {},
        info: {
          database: {
            status: 'up',
          },
          redis: {
            status: 'up',
          },
        },
        details: {
          database: {
            status: 'up',
          },
          redis: {
            status: 'up',
          },
        },
      });
    });
  });
});
