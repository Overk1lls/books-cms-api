import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class CreateReviewInputDto {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  reviewText: string;
}
