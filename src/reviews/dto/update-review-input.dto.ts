import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateReviewInputDto {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  reviewId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  reviewText: string;
}
