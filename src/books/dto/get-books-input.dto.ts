import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginatedFilterInput } from '../../core/core.utils';
import { BookSortableFields } from '../books.enum';

@InputType()
export class GetBooksInputDto extends PaginatedFilterInput(
  BookSortableFields,
  BookSortableFields.title,
) {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  author?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  publicationYear?: number;
}
