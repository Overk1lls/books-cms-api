import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { QueryFailedError } from 'typeorm';
import { Author, AuthorUpdateAttrs } from '../authors/authors.entity';
import { AuthorsService } from '../authors/authors.service';
import { Book } from '../books/books.entity';
import { CoreModule } from '../core/core.module';
import { randomString } from '../core/core.utils';
import { RedisService } from '../redis/redis.service';
import { AuthorsModule } from './authors.module';
import { PaginatedAuthorDto } from './dto';

describe('AuthorsService', () => {
  let module: TestingModule;
  let service: AuthorsService;
  let redisService: RedisService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CoreModule, AuthorsModule, TypeOrmModule.forFeature([Book])],
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

    service = module.get(AuthorsService);
    redisService = module.get(RedisService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('update', () => {
    it('should return early because of empty obj', async () => {
      const mocked: Author = {
        id: '123',
        name: '1234',
      };
      jest.spyOn(service, 'findByIdThrowable').mockResolvedValueOnce(mocked);

      const result = await service.update('123', {});

      expect(result).toEqual(mocked);
    });

    it('should create and update an author', async () => {
      const randomStr = randomString();
      const author = await service.create({
        name: `Author ${randomStr}`,
        biography: 'Testing the application 3',
      });
      const updateAttrs: AuthorUpdateAttrs = {
        biography: 'Testing the application 4',
      };

      const result = await service.update(author.id, updateAttrs);

      expect(result).toEqual<Author>({
        id: result.id,
        name: author.name,
        biography: updateAttrs.biography,
      });
    });
  });

  describe('findAll', () => {
    it('should create and find an author', async () => {
      jest.spyOn(redisService, 'getCache').mockResolvedValueOnce(null);

      const randomStr = randomString();
      const author = await service.create({
        name: `Author ${randomStr}`,
        biography: 'Testing the application 5',
      });

      const result = await service.findAll({
        name: randomStr,
        booksCount: 0,
      });

      expect(result).toEqual<PaginatedAuthorDto>({
        total: 1,
        totalPages: 1,
        page: 1,
        pageSize: 10,
        data: [{ ...author, booksCount: 0 }],
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
    it('should create and delete an author', async () => {
      const spy = jest.spyOn(redisService, 'clear');

      const randomStr = randomString();
      const author = await service.create({
        name: `Author ${randomStr}`,
        biography: 'Testing the application 6',
      });

      const result = await service.delete(author.id);

      const { data } = await service.findAll({
        name: randomStr,
        booksCount: 0,
      });

      expect(result).toBeTruthy();
      expect(data).toEqual<Author[]>([]);
      expect(spy).toHaveBeenCalled();
    });
  });
});
