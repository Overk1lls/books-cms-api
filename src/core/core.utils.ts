import {
  Field,
  InputType,
  Int,
  ObjectType,
  ReturnTypeFuncValue,
} from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { QueryFailedError } from 'typeorm';
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

export function formCacheKeyByEntity(
  entityName: string,
  inputDto: Record<string, any>,
): string {
  const key = Object.keys(inputDto)
    .map((key) => `${key}:${inputDto[key]}`)
    .join(':');

  return `${entityName}:${key}`;
}

export const isPgQueryConflictError = (error: Error): boolean =>
  isPgErrorWithCode(error) &&
  ['23505', 'ER_DUP_ENTRY', '1062'].includes(error.driverError.code);

export const isPgErrorWithCode = (
  error: unknown,
): error is QueryFailedError<Error & { code: string }> =>
  error instanceof QueryFailedError &&
  typeof (error.driverError as { code?: string })?.code === 'string';
