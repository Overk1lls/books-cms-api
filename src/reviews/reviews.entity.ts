import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => ID)
  reviewId: string;

  @Field(() => ID)
  bookId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  reviewText: string;

  @Field()
  createdAt: string;
}
