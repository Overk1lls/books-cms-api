import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class BookCreationInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  author: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  publicationDate: Date;

  @Field({ nullable: true })
  genre?: string;
}
