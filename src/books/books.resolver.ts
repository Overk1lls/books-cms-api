import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Book } from './books.entity';
import { BooksService } from './books.service';
import {
  BookCreationInputDto,
  GetBooksInputDto,
  PaginatedBookDto,
} from './dto';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => PaginatedBookDto)
  async getBooks(
    @Args('input') dto: GetBooksInputDto,
  ): Promise<PaginatedBookDto> {
    return await this.booksService.findAll(dto);
  }

  @Mutation(() => Book)
  async createBook(@Args('bookCreationInput') dto: BookCreationInputDto) {
    return this.booksService.create(dto);
  }
}
