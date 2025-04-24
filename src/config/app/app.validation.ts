import Joi from 'joi';
import { AppEnvConfig } from '../config.types';

export default Joi.object<AppEnvConfig>({
  PORT: Joi.number().default(3000),
  INITIAL_ADMIN_EMAIL: Joi.string().email().default('test@gmail.com'),
  JWT_SECRET: Joi.string().required(),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_AUTHENTICATED: Joi.number().default(10),
  RATE_LIMIT_UNAUTHENTICATED: Joi.number().default(25),
  RATE_LIMIT_ADMIN: Joi.number().default(100),
});
