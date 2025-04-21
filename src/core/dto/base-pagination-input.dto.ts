import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

@InputType()
export class BasePaginationInputDto {
  @Field(() => String, { nullable: true, defaultValue: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';

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
}
