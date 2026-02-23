import dotenv from 'dotenv';
import path from 'path';
import { environmentSchema } from './schema';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  // Only warn if .env file is missing, not if it's empty or other issues
  // But strictly speaking, dotenv.config() returns error if file is missing
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
  logLevel: envVars.LOG_LEVEL,
  sessionTTL: envVars.SESSION_TTL || 86400, // Idle timeout: Default to 24 hours
  absoluteSessionTTL: envVars.ABSOLUTE_SESSION_TTL || 604800, // Absolute timeout: Default to 7 days
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  },
};
