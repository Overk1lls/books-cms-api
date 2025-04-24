import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { formCacheKeyByEntity } from '../core/core.utils';
import { RedisService } from '../redis/redis.service';
import { Book, BookCreationAttrs, BookUpdateAttrs } from './books.entity';
import { GetBooksInputDto, PaginatedBookDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,

    private readonly redisService: RedisService,
  ) {}

  async findAll(dto: GetBooksInputDto): Promise<PaginatedBookDto> {
    const { limit = 10, page = 1 } = dto;

    const cacheKey = formCacheKeyByEntity('books', dto);
    const cached = await this.redisService.getCache<PaginatedBookDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const qb = this.buildFindBooksQuery(dto);
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

  async findByIdThrowable(id: string): Promise<Book> {
    const book = await this.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found!');
    }
    return book;
  }

  async findById(id: string): Promise<Book | null> {
    return await this.repository.findOneBy({ id });
  }

  async create(bookData: BookCreationAttrs): Promise<Book> {
    const book = this.repository.create(bookData);
    const createdBook = await this.repository.save(book);

    await this.redisService.clear();

    return createdBook;
  }

  async update(id: string, attrs: BookUpdateAttrs): Promise<Book> {
    const book = await this.findByIdThrowable(id);
    if (!Object.keys(attrs).length) return book;

    const merged = this.repository.merge(book, attrs);
    const updated = await this.repository.save(merged);

    await this.redisService.clear();

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const { affected } = await this.repository.delete(id);

    if (affected) {
      await this.redisService.clear();
    }

    return !!affected;
  }

  private buildFindBooksQuery(dto: GetBooksInputDto): SelectQueryBuilder<Book> {
    const {
      page = 1,
      limit = 10,
      title,
      author,
      publicationYear,
      sortBy,
      sortOrder,
    } = dto;

    const qb = this.repository
      .createQueryBuilder('b')
      .innerJoinAndSelect('b.author', 'a');

    if (title) {
      qb.andWhere('LOWER(b.title) LIKE LOWER(:title)', { title: `%${title}%` });
    }

    if (author) {
      qb.andWhere('LOWER(a.name) LIKE LOWER(:author)', {
        author: `%${author}%`,
      });
    }

    if (publicationYear) {
      qb.andWhere('EXTRACT(YEAR FROM b.publicationDate) = :year', {
        year: publicationYear,
      });
    }

    qb.orderBy(sortBy!, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    return qb;
  }
}
