import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '../config.enum';

export interface AppConfig {
  port: number;
}

export default registerAs<AppConfig, () => AppConfig>(
  ConfigNamespace.APP,
  () => ({
    port: +process.env.PORT!,
  }),
);
