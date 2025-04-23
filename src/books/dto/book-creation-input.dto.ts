import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
  @IsDateString()
  @IsNotEmpty()
  publicationDate: Date;

  @Field({ nullable: true })
  genre?: string;
}
