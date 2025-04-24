import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/roles';
import { AuthorsService } from '../authors/authors.service';
import { UserRole } from '../users/users.enum';
import { Book } from './books.entity';
import { BooksService } from './books.service';
import {
  BookCreationInputDto,
  BookUpdateInputDto,
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

  @Query(() => Book, { nullable: true })
  async book(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Book | null> {
    return await this.booksService.findById(id);
  }

  @Roles(UserRole.admin)
  @Mutation(() => Book)
  async createBook(@Args('input') dto: BookCreationInputDto): Promise<Book> {
    const author = await this.authorsService.findByIdThrowable(dto.authorId);
    return await this.booksService.create({ ...dto, author });
  }

  @Roles(UserRole.admin)
  @Mutation(() => Book)
  async updateBook(
    @Args('id') id: string,
    @Args('input') input: BookUpdateInputDto,
  ): Promise<Book> {
    return await this.booksService.update(id, input);
  }

  @Roles(UserRole.admin)
  @Mutation(() => Boolean)
  async deleteBook(@Args('id') id: string): Promise<boolean> {
    return await this.booksService.delete(id);
  }
}
