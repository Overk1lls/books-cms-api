import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Author } from './authors.entity';
import { AuthorsService } from './authors.service';
import {
  AuthorCreationInputDto,
  AuthorUpdateInputDto,
  PaginatedAuthorDto,
} from './dto';
import { GetAuthorsInputDto } from './dto/get-authors-input.dto';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Query(() => PaginatedAuthorDto)
  async getAuthors(
    @Args('input') dto: GetAuthorsInputDto,
  ): Promise<PaginatedAuthorDto> {
    return await this.authorsService.findAll(dto);
  }

  @Query(() => Author, { nullable: true })
  async author(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Author | null> {
    return await this.authorsService.findById(id);
  }

  @Mutation(() => Author)
  async createAuthor(
    @Args('input') input: AuthorCreationInputDto,
  ): Promise<Author> {
    return await this.authorsService.create(input);
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Args('id') id: string,
    @Args('input') input: AuthorUpdateInputDto,
  ): Promise<Author> {
    return await this.authorsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteAuthor(@Args('id') id: string): Promise<boolean> {
    return await this.authorsService.delete(id);
  }
}
