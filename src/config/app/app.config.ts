import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '../config.enum';

export interface AppConfig {
  port: number;
  jwtSecret: string;
  rateLimitTtl: number;
  rateLimitAuth: number;
  rateLimitUnauth: number;
  rateLimitAdmin: number;
}

export default registerAs<AppConfig, () => AppConfig>(
  ConfigNamespace.APP,
  () => ({
    port: +process.env.PORT!,
    jwtSecret: process.env.JWT_SECRET!,
    rateLimitTtl: +process.env.RATE_LIMIT_TTL!,
    rateLimitAuth: +process.env.RATE_LIMIT_AUTHENTICATED!,
    rateLimitUnauth: +process.env.RATE_LIMIT_UNAUTHENTICATED!,
    rateLimitAdmin: +process.env.RATE_LIMIT_ADMIN!,
  }),
);
