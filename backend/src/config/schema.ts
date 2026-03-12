import Joi from 'joi';

export const environmentSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  ALLOWED_ORIGINS: Joi.string().default(
    'http://localhost:8081,http://127.0.0.1:8081',
  ),
  PORT: Joi.number().default(3000),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:8081'),
  BACKEND_URL: Joi.string().uri().default('http://localhost:3000'),
  // Database configuration
  DB_URL: Joi.string().uri().required(),
  // Redis configuration
  REDIS_URL: Joi.string().uri().required(),
  REDIS_TASK_TTL: Joi.number().default(300), // in seconds
  // Logging configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  // Session configuration
  SESSION_TTL: Joi.number().default(86400),
  // Google OAuth configuration
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  // Email configuration
  EMAIL_PROVIDER: Joi.string().valid('mock', 'brevo').default('mock'),
  EMAIL_FROM_ADDRESS: Joi.string().email().default('noreply@taskflow.com'),
  BREVO_API_KEY: Joi.string().optional(),
}).unknown();
