import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationAndSortingInputDto } from '../../core/dto';
import { BookSortableFields } from '../books.enum';

@InputType()
export class GetBooksInputDto extends PaginationAndSortingInputDto {
  @Field(() => BookSortableFields, {
    nullable: true,
    defaultValue: BookSortableFields.title,
  })
  @IsEnum(BookSortableFields)
  @IsOptional()
  sortBy: BookSortableFields = BookSortableFields.title;

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
