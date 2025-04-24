import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewInputDto,
  DeleteReviewInputDto,
  UpdateReviewInputDto,
} from './dto';

describe('ReviewsService', () => {
  let module: TestingModule;
  let service: ReviewsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: DynamoDB,
          useValue: {
            putItem: jest.fn().mockResolvedValue({
              $metadata: { httpStatusCode: 200 },
            }),
            updateItem: jest.fn().mockResolvedValue({
              $metadata: { httpStatusCode: 200 },
            }),
            deleteItem: jest.fn().mockResolvedValue({
              $metadata: { httpStatusCode: 200 },
            }),
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ReviewsService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('addReview', () => {
    it('should add', async () => {
      const dto: CreateReviewInputDto = {
        bookId: '123',
        userId: '456',
        reviewText: 'test review',
      };

      const result = await service.addReview(dto);

      expect(result).toBeTruthy();
    });
  });

  describe('updateReview', () => {
    it('should update', async () => {
      const dto: UpdateReviewInputDto = {
        bookId: '123',
        reviewId: '456',
        reviewText: 'test review edited',
      };

      const result = await service.updateReview(dto);

      expect(result).toBeTruthy();
    });
  });

  describe('deleteReview', () => {
    it('should delete', async () => {
      const dto: DeleteReviewInputDto = {
        bookId: '123',
        reviewId: '456',
      };

      const result = await service.deleteReview(dto);

      expect(result).toBeTruthy();
    });
  });
});
