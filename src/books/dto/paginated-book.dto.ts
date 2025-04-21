import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from '../books.entity';

@ObjectType()
export class PaginatedBookDto {
  @Field(() => [Book])
  data: Book[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}
