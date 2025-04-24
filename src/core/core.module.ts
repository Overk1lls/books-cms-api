import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import { join } from 'path';
import { ExtendedConfigModule } from '../config/config.module';
import { GlobalAppConfig } from '../config/config.types';
import { TypeOrmFactoryService } from '../config/db/db.factory';
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
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService<GlobalAppConfig, true>) => ({
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
