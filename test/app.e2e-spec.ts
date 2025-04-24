import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import appConfig, { AppConfig } from '../src/config/app/app.config';

describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let config: AppConfig;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    config = module.get<AppConfig>(appConfig.KEY);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Rate Limiting', () => {
    it('should throttle requests after exceeding the limit', async () => {
      const client = request(app.getHttpServer());

      for (let i = 0; i < config.rateLimitUnauth; i++) {
        await client
          .post('/graphql')
          .send({ query: '{ __typename }' })
          .expect(HttpStatus.OK);
      }

      const result = await client
        .post('/graphql')
        .send({ query: '{ __typename }' })
        .expect(HttpStatus.TOO_MANY_REQUESTS);

      expect((result.body as { message: string }).message).toContain(
        'Too many requests',
      );
    });
  });
});
