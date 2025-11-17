import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from '../authors/authors.module';
import { ExtendedCacheModule } from '../cache/cache.module';
import { Book } from './books.entity';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  imports: [
    AuthorsModule,
    ExtendedCacheModule,
    TypeOrmModule.forFeature([Book]),
  ],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}
