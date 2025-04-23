import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '../config.enum';

export interface AppConfig {
  port: number;
  jwtSecret: string;
}

export default registerAs<AppConfig, () => AppConfig>(
  ConfigNamespace.APP,
  () => ({
    port: +process.env.PORT!,
    jwtSecret: process.env.JWT_SECRET!,
  }),
);
