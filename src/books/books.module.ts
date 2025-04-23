import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { Book } from './books.entity';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BooksService, BooksResolver, RedisService],
})
export class BooksModule {}
