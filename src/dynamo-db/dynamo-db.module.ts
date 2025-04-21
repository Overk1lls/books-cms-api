import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalAppConfig } from '../config/config.types';
import { DynamoDbService } from './dynamo-db.service';

@Module({
  providers: [DynamoDbService],
})
export class DynamoDbModule {
  static forRoot(): DynamicModule {
    return {
      module: DynamoDbModule,
      providers: [
        DynamoDbService,
        {
          provide: DynamoDB,
          useFactory: (configService: ConfigService<GlobalAppConfig, true>) => {
            return new DynamoDB({
              region: configService.get('aws.region', { infer: true }),
              credentials: {
                accessKeyId: configService.get('aws.accessKeyId', {
                  infer: true,
                }),
                secretAccessKey: configService.get('aws.secretAccessKey', {
                  infer: true,
                }),
              },
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: [DynamoDbService],
    };
  }
}
