import {
  Field,
  InputType,
  Int,
  ObjectType,
  ReturnTypeFuncValue,
} from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { BasePaginationInputDto } from './dto';

export const randomString = () => (Math.random() + 1).toString(36).substring(2);

export function PaginatedResponse<T>(classRef: ReturnTypeFuncValue) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => Int)
    total: number;

    @Field(() => [classRef])
    data: T[];

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    pageSize: number;

    @Field(() => Int)
    totalPages: number;
  }

  return PaginatedResponseClass;
}

export function PaginatedFilterInput<SortEnumType>(
  sortEnum: Record<string, SortEnumType>,
  defaultSortField: SortEnumType,
) {
  @InputType({ isAbstract: true })
  abstract class BasePaginatedFilterInput extends BasePaginationInputDto {
    @Field(() => sortEnum, {
      nullable: true,
      defaultValue: defaultSortField as string,
    })
    @IsEnum(sortEnum)
    @IsOptional()
    sortBy?: SortEnumType = defaultSortField;
  }

  return BasePaginatedFilterInput;
}
