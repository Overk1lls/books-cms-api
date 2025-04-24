import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '../config.enum';

export interface AwsConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export default registerAs<AwsConfig, () => AwsConfig>(
  ConfigNamespace.AWS,
  () => ({
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }),
);
