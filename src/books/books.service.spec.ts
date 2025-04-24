import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { QueryFailedError } from 'typeorm';
import { Author } from '../authors/authors.entity';
import { AuthorsService } from '../authors/authors.service';
import { CoreModule } from '../core/core.module';
import { randomString } from '../core/core.utils';
import { RedisService } from '../redis/redis.service';
import { Book, BookUpdateAttrs } from './books.entity';
import { BooksModule } from './books.module';
import { BooksService } from './books.service';
import { PaginatedBookDto } from './dto';

describe('BooksService', () => {
  let module: TestingModule;
  let service: BooksService;
  let authorsService: AuthorsService;
  let redisService: RedisService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CoreModule, BooksModule],
      providers: [
        {
          provide: RedisService,
          useValue: {
            getCache: jest.fn(),
            setCache: jest.fn(),
            clear: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(BooksService);
    authorsService = module.get(AuthorsService);
    redisService = module.get(RedisService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('update', () => {
    it('should return early because of empty obj', async () => {
      const mocked = { id: '123' } as Book;

      jest.spyOn(service, 'findByIdThrowable').mockResolvedValueOnce(mocked);

      const result = await service.update('123', {});

      expect(result).toEqual(mocked);
    });

    it('should create and update a book', async () => {
      const randomStr = randomString();
      const author = await authorsService.create({
        name: `Author ${randomStr}`,
      });
      const book = await service.create({
        author,
        title: `Title ${randomStr}`,
        publicationDate: new Date(),
        genre: 'Horror',
      });
      const updateAttrs: BookUpdateAttrs = { genre: 'Thriller' };

      await service.update(book.id, updateAttrs);

      const { data } = await service.findAll({
        author: randomStr,
        title: randomStr,
      });

      expect(data).toEqual<Book[]>([
        expect.objectContaining<Partial<Book>>({
          id: book.id,
          genre: updateAttrs.genre,
        }) as Book,
      ]);
    });
  });

  describe('findAll', () => {
    it('should create and find a book', async () => {
      jest.spyOn(redisService, 'getCache').mockResolvedValueOnce(null);

      const randomStr = randomString();
      const author = await authorsService.create({
        name: `Author ${randomStr}`,
      });
      const book = await service.create({
        author,
        title: `Title ${randomStr}`,
        publicationDate: new Date(),
        genre: 'Horror',
      });

      const result = await service.findAll({
        author: randomStr,
        title: randomStr,
        publicationYear: book.publicationDate.getFullYear(),
      });

      expect(result).toEqual<PaginatedBookDto>({
        total: 1,
        totalPages: 1,
        page: 1,
        pageSize: 10,
        data: [
          expect.objectContaining<Partial<Book>>({
            id: book.id,
            author: expect.objectContaining<Partial<Author>>({
              id: author.id,
            }) as Author,
          }) as Book,
        ],
      });
    });

    it('should return cached', async () => {
      jest.spyOn(redisService, 'getCache').mockResolvedValueOnce({});

      const result = await service.findAll({});

      expect(result).toEqual({});
    });
  });

  describe('findByIdThrowable', () => {
    it('should throw because of invalid UUID', async () => {
      const invokeFn = () => service.findByIdThrowable('123');

      await expect(invokeFn).rejects.toThrow(QueryFailedError);
    });

    it('should throw because of not found', async () => {
      const invokeFn = () => service.findByIdThrowable(randomUUID());

      await expect(invokeFn).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should create and delete a book', async () => {
      const spy = jest.spyOn(redisService, 'clear');

      const randomStr = randomString();
      const author = await authorsService.create({
        name: `Author ${randomStr}`,
      });
      const book = await service.create({
        author,
        title: `Title ${randomStr}`,
        publicationDate: new Date(),
        genre: 'Horror',
      });

      await service.delete(book.id);

      const { data } = await service.findAll({
        author: randomStr,
        title: randomStr,
      });

      expect(data).toEqual<Book[]>([]);
      expect(spy).toHaveBeenCalled();
    });
  });
});
