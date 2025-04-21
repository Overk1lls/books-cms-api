import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Book } from './books.entity';
import { BooksService } from './books.service';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [Book])
  async getBooks() {
    return this.booksService.findAll();
  }

  @Mutation(() => Book)
  async createBook(
    @Args('title') title: string,
    @Args('author') author: string,
    @Args('publicationDate') publicationDate: string,
    @Args('genre', { nullable: true }) genre: string,
  ) {
    return this.booksService.create({ title, author, publicationDate, genre });
  }
}
