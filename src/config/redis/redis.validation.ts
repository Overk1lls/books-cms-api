import Joi from 'joi';
import { AppEnvConfig } from '../config.types';

export default Joi.object<AppEnvConfig>({
  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().default(6379),
});
