import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorsService } from '../authors/authors.service';
import { Book } from './books.entity';
import { BooksService } from './books.service';
import {
  BookCreationInputDto,
  GetBooksInputDto,
  PaginatedBookDto,
} from './dto';

@Resolver(() => Book)
export class BooksResolver {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly booksService: BooksService,
  ) {}

  @Query(() => PaginatedBookDto)
  async getBooks(
    @Args('input') dto: GetBooksInputDto,
  ): Promise<PaginatedBookDto> {
    return await this.booksService.findAll(dto);
  }

  @Mutation(() => Book)
  async createBook(@Args('bookCreationInput') dto: BookCreationInputDto): Promise<Book> {
    const author = await this.authorsService.findByIdThrowable(dto.authorId);
    return await this.booksService.create({ ...dto, author });
  }
}
