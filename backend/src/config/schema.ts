import Joi from 'joi';

export const environmentSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  SESSION_TTL: Joi.number().default(86400),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:8081,http://127.0.0.1:8081'),
}).unknown();
