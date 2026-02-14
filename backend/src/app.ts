import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './utils/logger';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const [method, url, status, contentLength, responseTime] = message.split(' ');
        logger.http(message.trim(), { method, url, status, contentLength, responseTime });
      },
    },
  })
);

import healthRoutes from './routes/health.routes';

app.use('/health', healthRoutes);

import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.use(errorHandler);

export default app;
