import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AuthorsService } from '../authors/authors.service';
import { randomString } from '../core/core.utils';
import { Book } from './books.entity';
import { BookSortableFields } from './books.enum';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';
import {
  BookCreationInputDto,
  BookUpdateInputDto,
  GetBooksInputDto,
} from './dto';
import { PaginatedBookDto } from './dto/paginated-book.dto';

describe('BooksResolver', () => {
  let module: TestingModule;
  let resolver: BooksResolver;
  let service: BooksService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        BooksResolver,
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AuthorsService,
          useValue: {
            findByIdThrowable: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(BooksResolver);
    service = module.get(BooksService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getBooks', () => {
    it('should call booksService.findAll with correct arguments', async () => {
      const dto: GetBooksInputDto = {
        page: 2,
        limit: 11,
        sortBy: BookSortableFields.publicationDate,
        sortOrder: 'DESC',
        author: '123',
        publicationYear: 123,
        title: 't',
      };
      const result: PaginatedBookDto = {
        data: [],
        total: 0,
        totalPages: 0,
        page: dto.page!,
        pageSize: dto.limit!,
      };

      const spy = jest.spyOn(service, 'findAll').mockResolvedValueOnce(result);

      const response = await resolver.getBooks(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('book', () => {
    it('should can booksService.findById with correct arguments', async () => {
      const spy = jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      const response = await resolver.book('123');

      expect(spy).toHaveBeenCalledWith('123');
      expect(response).toBeNull();
    });
  });

  describe('createBook', () => {
    it('should call booksService.create with correct arguments', async () => {
      const dto: BookCreationInputDto = {
        title: 'Test Book',
        authorId: 'Author',
        publicationDate: new Date(),
      };
      const result: Book = {
        ...dto,
        id: randomUUID(),
        author: {
          id: randomUUID(),
          name: randomString(),
        },
      };

      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(result);

      const response = await resolver.createBook(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('updateBook', () => {
    it('should call booksService.update with correct arguments', async () => {
      const dto: BookUpdateInputDto = {
        title: 'test title',
        genre: 'test',
        publicationDate: new Date(),
      };
      const result: Book = {
        id: randomUUID(),
        title: dto.title!,
        publicationDate: dto.publicationDate!,
        genre: dto.genre,
        author: {
          id: randomUUID(),
          name: `Author ${randomString()}`,
        },
      };

      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(result);

      const response = await resolver.updateBook(result.id, dto);

      expect(spy).toHaveBeenCalledWith<[string, BookUpdateInputDto]>(
        result.id,
        dto,
      );
      expect(response).toEqual(result);
    });
  });

  describe('deleteBook', () => {
    it('should call booksService.delete with correct arguments', async () => {
      const spy = jest.spyOn(service, 'delete').mockResolvedValueOnce(true);

      const response = await resolver.deleteBook('1234');

      expect(spy).toHaveBeenCalledWith<[string]>('1234');
      expect(response).toBeTruthy();
    });
  });
});
