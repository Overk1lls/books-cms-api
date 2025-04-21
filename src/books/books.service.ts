import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsOrder, Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { Book, BookCreationAttrs, BookUpdateAttrs } from './books.entity';
import { PaginatedBookDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,

    private readonly redisService: RedisService,
  ) {}

  async findAll(options?: FindManyOptions<Book>): Promise<PaginatedBookDto> {
    const take = options?.take ?? 1;
    const skip = options?.skip ?? 10;
    const order = options?.order ?? {};

    const cacheKey = this.getCacheKey(take, skip, order);
    const cached = await this.redisService.getCache<PaginatedBookDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const [data, total] = await this.repository.findAndCount(options);
    const result: PaginatedBookDto = {
      total,
      data: data ?? [],
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil((total ?? 0) / take),
    };

    await this.redisService.setCache(cacheKey, result, 300);

    return result;
  }

  async create(bookData: BookCreationAttrs): Promise<Book> {
    const book = this.repository.create(bookData);
    const createdBook = await this.repository.save(book);

    await this.redisService.clear();

    return createdBook;
  }

  async update(id: string, bookData: BookUpdateAttrs): Promise<void> {
    await this.repository.update(id, bookData);

    await this.redisService.clear();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);

    await this.redisService.clear();
  }

  private getCacheKey(
    take: number,
    skip: number,
    order: FindOptionsOrder<Book>,
  ): string {
    return `books:take:${take}:skip:${skip}:${JSON.stringify(order)}`;
  }
}
