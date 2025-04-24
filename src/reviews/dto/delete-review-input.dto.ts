import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class DeleteReviewInputDto {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  reviewId: string;
}
