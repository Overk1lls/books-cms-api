import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { Book, BookCreationAttrs, BookUpdateAttrs } from './books.entity';
import { BookSortableFields } from './books.enum';
import { GetBooksInputDto, PaginatedBookDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,

    private readonly redisService: RedisService,
  ) {}

  async findAll(dto: GetBooksInputDto): Promise<PaginatedBookDto> {
    const {
      limit = 10,
      page = 1,
      sortBy = BookSortableFields.title,
      sortOrder = 'ASC',
      title,
      author,
      publicationYear,
    } = dto;

    const cacheKey = this.getCacheKey(dto);
    const cached = await this.redisService.getCache<PaginatedBookDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const qb = this.repository.createQueryBuilder('b');

    if (title) {
      qb.andWhere('LOWER(b.title) LIKE LOWER(:title)', { title: `%${title}%` });
    }

    if (author) {
      qb.andWhere('LOWER(b.author) LIKE LOWER(:author)', {
        author: `%${author}%`,
      });
    }

    if (publicationYear) {
      qb.andWhere('EXTRACT(YEAR FROM b.publicationDate) = :year', {
        year: publicationYear,
      });
    }

    qb.orderBy(sortBy, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    const result: PaginatedBookDto = {
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil((total ?? 0) / limit),
      data: data ?? [],
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
    if (!Object.keys(bookData).length) return;

    const { affected } = await this.repository.update(id, bookData);

    if (affected) {
      await this.redisService.clear();
    }
  }

  async delete(id: string): Promise<void> {
    const { affected } = await this.repository.delete(id);

    if (affected) {
      await this.redisService.clear();
    }
  }

  private getCacheKey(dto: GetBooksInputDto): string {
    const key = Object.keys(dto)
      .map((key) => `${key}:${dto[key]}`)
      .join(':');

    return `books:${key}`;
  }
}
