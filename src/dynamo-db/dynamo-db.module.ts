import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalAppConfig } from '../config/config.types';

@Global()
@Module({})
export class DynamoDbModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: DynamoDbModule,
      providers: [
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
      exports: [DynamoDB],
    };
  }
}
