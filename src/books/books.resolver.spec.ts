import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AuthorsService } from '../authors/authors.service';
import { randomString } from '../core/core.utils';
import { Book } from './books.entity';
import { BookSortableFields } from './books.enum';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';
import { BookCreationInputDto, GetBooksInputDto } from './dto';
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
            create: jest.fn(),
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
});
