import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '../config.enum';

export const DEFAULT_PG_PORT = 5432;

export interface DbConfig {
  host: string;
  writePort: number;
  readPort: number;
  database: string;
  username: string;
  password: string;
}

export default registerAs<DbConfig, () => DbConfig>(ConfigNamespace.DB, () => ({
  host: process.env.DB_HOST!,
  writePort: +(process.env.DB_PORT_WRITE! ?? DEFAULT_PG_PORT),
  readPort: +(process.env.DB_PORT_READ! ?? DEFAULT_PG_PORT),
  database: process.env.DB_DATABASE!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
}));
