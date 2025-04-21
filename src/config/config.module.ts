import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app/app.config';
import appValidation from './app/app.validation';
import awsConfig from './aws/aws.config';
import awsValidation from './aws/aws.validation';
import dbConfig from './db/db.config';
import dbValidation from './db/db.validation';
import redisConfig from './redis/redis.config';
import redisValidation from './redis/redis.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, awsConfig, dbConfig, redisConfig],
      validationSchema: appValidation
        .concat(awsValidation)
        .concat(dbValidation)
        .concat(redisValidation),
    }),
  ],
})
export class ExtendedConfigModule {}
