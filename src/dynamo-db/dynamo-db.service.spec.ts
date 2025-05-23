import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from './dynamo-db.service';

describe('DynamoDbService', () => {
  let service: DynamoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        {
          provide: DynamoDB,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DynamoDbService>(DynamoDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
