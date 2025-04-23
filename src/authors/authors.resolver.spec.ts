import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AuthorsService } from '../authors/authors.service';
import { randomString } from '../core/core.utils';
import { Author } from './authors.entity';
import { AuthorSortableFields } from './authors.enum';
import { AuthorsResolver } from './authors.resolver';
import {
  AuthorCreationInputDto,
  AuthorUpdateInputDto,
  PaginatedAuthorDto,
} from './dto';
import { GetAuthorsInputDto } from './dto/get-authors-input.dto';

describe('AuthorsResolver', () => {
  let module: TestingModule;
  let resolver: AuthorsResolver;
  let service: AuthorsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthorsResolver,
        {
          provide: AuthorsService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(AuthorsResolver);
    service = module.get(AuthorsService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getAuthors', () => {
    it('should call authorsService.findAll with correct arguments', async () => {
      const dto: GetAuthorsInputDto = {
        page: 2,
        limit: 11,
        sortBy: AuthorSortableFields.name,
        sortOrder: 'DESC',
        name: '123',
        booksCount: 123,
      };
      const result: PaginatedAuthorDto = {
        data: [],
        total: 0,
        totalPages: 0,
        page: dto.page!,
        pageSize: dto.limit!,
      };

      const spy = jest.spyOn(service, 'findAll').mockResolvedValueOnce(result);

      const response = await resolver.getAuthors(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('author', () => {
    it('should can authorsService.findById with correct arguments', async () => {
      const spy = jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      const response = await resolver.author('123');

      expect(spy).toHaveBeenCalledWith('123');
      expect(response).toBeNull();
    });
  });

  describe('createAuthor', () => {
    it('should call authorsService.create with correct arguments', async () => {
      const dto: AuthorCreationInputDto = {
        name: `Author ${randomString()}`,
        biography: 'Testing the application',
      };
      const result: Author = {
        ...dto,
        id: randomUUID(),
        booksCount: 0,
      };

      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(result);

      const response = await resolver.createAuthor(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('updateAuthor', () => {
    it('should call authorsService.update with correct arguments', async () => {
      const dto: AuthorUpdateInputDto = {
        name: `Author ${randomString()} 2`,
        biography: 'Testing the application 2',
      };
      const result: Author = {
        id: randomUUID(),
        name: dto.name!,
        biography: dto.biography,
        booksCount: 1,
      };

      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(result);

      const response = await resolver.updateAuthor(result.id, dto);

      expect(spy).toHaveBeenCalledWith<[string, AuthorUpdateInputDto]>(
        result.id,
        dto,
      );
      expect(response).toEqual(result);
    });
  });

  describe('deleteAuthor', () => {
    it('should call authorsService.delete with correct arguments', async () => {
      const spy = jest.spyOn(service, 'delete').mockResolvedValueOnce(true);

      const response = await resolver.deleteAuthor('1234');

      expect(spy).toHaveBeenCalledWith<[string]>('1234');
      expect(response).toBeTruthy();
    });
  });
});
