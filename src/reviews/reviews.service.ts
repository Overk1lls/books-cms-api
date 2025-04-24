import {
  AttributeValue,
  DeleteItemCommandInput,
  DynamoDB,
  PutItemCommandInput,
  QueryCommandInput,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateReviewInputDto,
  DeleteReviewInputDto,
  UpdateReviewInputDto,
} from './dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly dynamoDb: DynamoDB) {}

  async addReview(dto: CreateReviewInputDto): Promise<boolean> {
    const params: PutItemCommandInput = {
      TableName: 'UserReviews',
      Item: {
        reviewId: { S: randomUUID() },
        bookId: { S: dto.bookId },
        userId: { S: dto.userId },
        reviewText: { S: dto.reviewText },
        createdAt: { S: new Date().toISOString() },
      },
    };
    const { $metadata } = await this.dynamoDb.putItem(params);
    return $metadata.httpStatusCode === 200;
  }

  async updateReview(dto: UpdateReviewInputDto): Promise<boolean> {
    const params: UpdateItemCommandInput = {
      TableName: 'UserReviews',
      Key: {
        bookId: { S: dto.bookId },
        reviewId: { S: dto.reviewId },
      },
      UpdateExpression: 'SET reviewText = :reviewText',
      ExpressionAttributeValues: {
        ':reviewText': { S: dto.reviewText },
      },
    };
    const { $metadata } = await this.dynamoDb.updateItem(params);
    return $metadata.httpStatusCode === 200;
  }

  async deleteReview(dto: DeleteReviewInputDto): Promise<boolean> {
    const params: DeleteItemCommandInput = {
      TableName: 'UserReviews',
      Key: {
        bookId: { S: dto.bookId },
        reviewId: { S: dto.reviewId },
      },
    };
    const { $metadata } = await this.dynamoDb.deleteItem(params);
    return $metadata.httpStatusCode === 200;
  }

  async getPaginatedReviews(
    bookId: string,
    limit: number,
    lastKey?: string,
  ): Promise<{
    items: Record<string, AttributeValue>[] | undefined;
    lastEvaluatedKey?: string;
  }> {
    const params: QueryCommandInput = {
      TableName: 'UserReviews',
      KeyConditionExpression: 'bookId = :bookId',
      ExpressionAttributeValues: {
        ':bookId': { S: bookId },
      },
      Limit: limit,
      ExclusiveStartKey: lastKey
        ? (JSON.parse(
            Buffer.from(lastKey, 'base64').toString('utf8'),
          ) as Record<string, AttributeValue>)
        : undefined,
    };
    const result = await this.dynamoDb.query(params);
    const encodedKey = result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : undefined;

    return { items: result.Items, lastEvaluatedKey: encodedKey };
  }
}
