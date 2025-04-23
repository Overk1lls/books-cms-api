import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from '../authors/authors.module';
import { RedisModule } from '../redis/redis.module';
import { Book } from './books.entity';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  imports: [AuthorsModule, RedisModule, TypeOrmModule.forFeature([Book])],
  providers: [BooksService, BooksResolver],
})
export class BooksModule {}
