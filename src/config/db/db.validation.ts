import Joi from 'joi';
import { AppEnvConfig } from '../config.types';
import { DEFAULT_PG_PORT } from './db.config';

export default Joi.object<AppEnvConfig>({
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT_WRITE: Joi.number().default(DEFAULT_PG_PORT),
  DB_PORT_READ: Joi.number().default(DEFAULT_PG_PORT),
  DB_DATABASE: Joi.string().default('postgres'),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().required(),
});
