import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ExtendedConfigModule } from './config/config.module';
import { TypeOrmFactoryService } from './config/db/db.factory';
import { DynamoDbModule } from './dynamo-db/dynamo-db.module';
import { RedisFactoryService } from './redis/redis.factory';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ExtendedConfigModule,
    BooksModule,
    UsersModule,
    DynamoDbModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisFactoryService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmFactoryService,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(__dirname, 'schema.gql'),
      driver: ApolloDriver,
      introspection: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
