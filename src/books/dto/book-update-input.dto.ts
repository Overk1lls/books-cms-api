import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsString } from 'class-validator';

@InputType()
export class BookUpdateInputDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  publicationDate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  genre?: string;
}
