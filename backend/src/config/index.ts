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
  frontendUrl: envVars.FRONTEND_URL,
  backendUrl: envVars.BACKEND_URL,
  redis: {
    url: envVars.REDIS_URL,
    taskTTL: envVars.REDIS_TASK_TTL || 300,
  },
  logLevel: envVars.LOG_LEVEL,
  sessionTTL: envVars.SESSION_TTL || 86400, // Idle timeout: Default to 24 hours
  absoluteSessionTTL: envVars.ABSOLUTE_SESSION_TTL || 604800, // Absolute timeout: Default to 7 days
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  },
  cors: {
    allowedOrigins: envVars.ALLOWED_ORIGINS.split(',').map((origin: string) =>
      origin.trim(),
    ),
  },
  email: {
    provider: envVars.EMAIL_PROVIDER,
    fromAddress: envVars.EMAIL_FROM_ADDRESS,
    brevoApiKey: envVars.BREVO_API_KEY,
  },
};
