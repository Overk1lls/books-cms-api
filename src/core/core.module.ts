import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import { join } from 'path';
import { ExtendedConfigModule } from '../config/config.module';
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
      autoSchemaFile: join(__dirname, 'schema.gql'),
      driver: ApolloDriver,
      introspection: true,
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req }: { req: Request }) => ({ req }),
    }),
  ],
})
export class CoreModule {}
