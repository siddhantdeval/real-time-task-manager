import Joi from 'joi';

export const environmentSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
}).unknown();
