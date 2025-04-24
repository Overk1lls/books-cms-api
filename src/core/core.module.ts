import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { join } from 'path';
import { ExtendedConfigModule } from '../config/config.module';
import { GlobalAppConfig } from '../config/config.types';
import { TypeOrmFactoryService } from '../db/db.factory';
import { DynamoDbModule } from '../dynamo-db/dynamo-db.module';
import { RedisFactoryService } from '../redis/redis.factory';

@Module({
  imports: [
    ExtendedConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmFactoryService,
    }),
    DynamoDbModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisFactoryService,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'test'
          ? true
          : join(process.cwd(), 'src/schema.gql'),
      introspection: process.env.NODE_ENV !== 'production',
      playground: false,
      plugins:
        process.env.NODE_ENV === 'production'
          ? []
          : [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      formatError: (error) => {
        const isProd = process.env.NODE_ENV === 'production';

        return {
          message: error.message,
          extensions: {
            ...error.extensions,
            ...(isProd ? {} : { stacktrace: error.extensions?.stacktrace }),
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService<GlobalAppConfig, true>) => ({
        storage: new ThrottlerStorageRedisService({
          host: configService.get('redis.host', { infer: true }),
          port: configService.get('redis.port', { infer: true }),
        }),
        throttlers: [
          {
            ttl: configService.get('app.rateLimitTtl', { infer: true }),
            limit: configService.get('app.rateLimitUnauth', { infer: true }),
          },
          {
            ttl: configService.get('app.rateLimitTtl', { infer: true }),
            limit: configService.get('app.rateLimitAuth', { infer: true }),
          },
          {
            ttl: configService.get('app.rateLimitTtl', { infer: true }),
            limit: configService.get('app.rateLimitAdmin', { infer: true }),
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
