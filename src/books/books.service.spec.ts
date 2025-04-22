import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  let bookRepo: Repository<Book>;
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
    bookRepo = module.get<Repository<Book>>(getRepositoryToken(Book));
    redisService = module.get(RedisService);
  });

  afterAll(async () => {
    await module.close();
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

  describe('update', () => {
    it('should return early because of empty obj', async () => {
      const spy = jest.spyOn(bookRepo, 'update');

      await service.update('123', {});

      expect(spy).not.toHaveBeenCalledWith<[string, BookUpdateAttrs]>(
        '123',
        {},
      );
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
