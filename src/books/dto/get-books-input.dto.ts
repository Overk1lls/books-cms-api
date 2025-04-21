import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm';
import { BookSortableFields } from '../books.enum';

@InputType()
export class GetBooksInputDto {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit: number = 10;

  @Field(() => BookSortableFields, {
    nullable: true,
    defaultValue: BookSortableFields.title,
  })
  @IsEnum(BookSortableFields)
  @IsOptional()
  sortBy: BookSortableFields = BookSortableFields.title;

  @Field(() => String, { nullable: true, defaultValue: 'ASC' })
  @IsString()
  @IsOptional()
  sortOrder: FindOptionsOrderValue = 'ASC';
}
