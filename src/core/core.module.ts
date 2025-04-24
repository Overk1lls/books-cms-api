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
      autoSchemaFile:
        process.env.NODE_ENV === 'test'
          ? true
          : join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      introspection: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
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
