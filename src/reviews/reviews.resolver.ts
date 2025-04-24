import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateReviewInputDto,
  DeleteReviewInputDto,
  UpdateReviewInputDto,
} from './dto';
import { Review } from './reviews.entity';
import { ReviewsService } from './reviews.service';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Boolean)
  async addReview(
    @Args('input') input: CreateReviewInputDto,
  ): Promise<boolean> {
    return await this.reviewsService.addReview(input);
  }

  @Mutation(() => Boolean)
  async updateReview(
    @Args('input') input: UpdateReviewInputDto,
  ): Promise<boolean> {
    return this.reviewsService.updateReview(input);
  }

  @Mutation(() => Boolean)
  async deleteReview(
    @Args('input') input: DeleteReviewInputDto,
  ): Promise<boolean> {
    return this.reviewsService.deleteReview(input);
  }

  @Query(() => [Review], { nullable: 'items' })
  async getReviews(@Args('bookId') bookId: string): Promise<Review[]> {
    const { items } = await this.reviewsService.getPaginatedReviews(bookId, 10);
    if (!items?.length) return [];

    return items.map((item) => ({
      reviewId: item.reviewId.S!,
      bookId: item.bookId.S!,
      userId: item.userId.S!,
      reviewText: item.reviewText.S!,
      createdAt: item.createdAt.S!,
    }));
  }
}
