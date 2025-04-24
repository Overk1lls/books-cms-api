import { AppConfig } from './app/app.config';
import { AwsConfig } from './aws/aws.config';
import { ConfigNamespace } from './config.enum';
import { DbConfig } from './db/db.config';
import { RedisConfig } from './redis/redis.config';

export interface GlobalAppConfig {
  [ConfigNamespace.APP]: AppConfig;
  [ConfigNamespace.AWS]: AwsConfig;
  [ConfigNamespace.DB]: DbConfig;
  [ConfigNamespace.REDIS]: RedisConfig;
}

export interface AppEnvConfig {
  PORT: number;

  JWT_SECRET: string;
  INITIAL_ADMIN_EMAIL: string;

  RATE_LIMIT_TTL: number;
  RATE_LIMIT_AUTHENTICATED: number;
  RATE_LIMIT_UNAUTHENTICATED: number;
  RATE_LIMIT_ADMIN: number;

  DB_HOST: string;
  DB_PORT_WRITE: string;
  DB_PORT_READ: string;
  DB_DATABASE: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;

  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
}
