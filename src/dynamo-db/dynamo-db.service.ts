import {
  AttributeValue,
  DynamoDB,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamoDbService {
  constructor(private readonly dynamoDb: DynamoDB) {}

  async logActivity(
    userId: string,
    action: string,
    details?: Record<string, any>,
  ): Promise<boolean> {
    const params: PutItemCommandInput = {
      TableName: 'UserActivityLogs',
      Item: {
        userId: { S: userId },
        timestamp: { S: new Date().toISOString() },
        action: { S: action },
        details: { M: this.marshallMap(details) },
      },
    };
    const { $metadata } = await this.dynamoDb.putItem(params);
    return $metadata.httpStatusCode === 200;
  }

  private marshallMap(
    input?: Record<string, any>,
  ): Record<string, AttributeValue> {
    if (!input) return {};
    return Object.entries(input).reduce<Record<string, AttributeValue>>(
      (acc, [key, value]) => {
        acc[key] =
          typeof value === 'string' || typeof value === 'number'
            ? { S: value.toString() }
            : { S: JSON.stringify(value) };
        return acc;
      },
      {},
    );
  }
}
