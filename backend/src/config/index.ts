import dotenv from 'dotenv';
import path from 'path';
import { environmentSchema } from './schema';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`Warning: .env file not found at ${envPath}`);
}


const { error, value: envVars } = environmentSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  console.error('\nEnvironment validation error:');
  error.details.forEach((detail) => {
    console.error(`  - ${detail.message}`);
  });
  process.exit(1);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    url: envVars.DB_URL,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  logLevel: envVars.LOG_LEVEL,
};
