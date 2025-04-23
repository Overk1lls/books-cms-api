import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginatedFilterInput } from '../../core/core.utils';
import { AuthorSortableFields } from '../authors.enum';

@InputType()
export class GetAuthorsInputDto extends PaginatedFilterInput(
  AuthorSortableFields,
  AuthorSortableFields.name,
) {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  booksCount?: number;
}
