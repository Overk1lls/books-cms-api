import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formCacheKeyByEntity } from '../core/core.utils';
import { RedisService } from '../redis/redis.service';
import { Author, AuthorUpdateAttrs } from './authors.entity';
import { AuthorCreationInputDto, PaginatedAuthorDto } from './dto';
import { GetAuthorsInputDto } from './dto/get-authors-input.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly repository: Repository<Author>,

    private readonly redisService: RedisService,
  ) {}

  async create(input: AuthorCreationInputDto): Promise<Author> {
    const author = this.repository.create(input);
    return await this.repository.save(author);
  }

  async update(id: string, attrs: AuthorUpdateAttrs): Promise<Author> {
    const author = await this.findByIdThrowable(id);
    if (!Object.keys(attrs).length) return author;

    const updated = await this.repository.save({ ...author, ...attrs });

    await this.redisService.clear();

    return updated;
  }

  async findAll(dto: GetAuthorsInputDto): Promise<PaginatedAuthorDto> {
    const { limit = 10, page = 1, name, booksCount, sortBy, sortOrder } = dto;

    const cacheKey = formCacheKeyByEntity('authors', dto);
    const cached =
      await this.redisService.getCache<PaginatedAuthorDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const qb = this.repository
      .createQueryBuilder('a')
      .leftJoin('a.books', 'b')
      .loadRelationCountAndMap('a.booksCount', 'a.books')
      .groupBy('a.id');

    if (name) {
      qb.andWhere('LOWER(a.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (booksCount) {
      qb.having('COUNT(b.id) >= :booksCount', { booksCount });
    }

    qb.orderBy(sortBy!, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    const result: PaginatedAuthorDto = {
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil((total ?? 0) / limit),
      data: data ?? [],
    };

    await this.redisService.setCache(cacheKey, result, 300);

    return result;
  }

  async findByIdThrowable(id: string): Promise<Author> {
    const author = await this.findById(id);
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return author;
  }

  async findById(id: string): Promise<Author | null> {
    return await this.repository.findOneBy({ id });
  }

  async delete(id: string): Promise<boolean> {
    const { affected } = await this.repository.delete(id);

    if (affected) {
      await this.redisService.clear();
    }

    return !!affected;
  }
}
