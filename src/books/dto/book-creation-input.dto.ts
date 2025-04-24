import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class BookCreationInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  publicationDate: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  genre?: string;
}
