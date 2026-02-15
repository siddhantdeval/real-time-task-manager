# Backend Overview

## 📖 Introduction

The Backend service for the Real-time Task Manager is designed for scalability and performance. It handles task management operations, user authentication, and real-time capabilities.

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Cache/PubSub**: [Redis](https://redis.io/)
- **Validation**: [Joi](https://joi.dev/)
- **Infrastructure**: [Docker](https://www.docker.com/) & Docker Compose

## 📂 Project Structure

```bash
backend/
├── prisma/             # Database Schema & Seed scripts
├── src/
│   ├── config/         # Environment config & validation
│   ├── controllers/    # Route logic & request handling
│   ├── dto/            # Data Transfer Objects & Joi schemas
│   ├── middleware/     # Express logic (Validation, Auth, Errors)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic (DB, Redis, Auth)
│   ├── utils/          # Helper utilities
│   ├── app.ts          # App setup
│   └── server.ts       # Entry point
├── docker-compose.yml  # Container orchestration
└── package.json        # Dependencies & scripts
```

## 🚀 Features

- **Robust API**: Modular Express.js architecture.
- **Type Safety**: Full TypeScript implementation.
- **Database**: PostgreSQL with Prisma ORM for type-safe queries.
- **Caching**: Redis for session storage and high-performance data access.
- **Authentication**: Secure Session-based Auth (see [Authentication System](authentication_system.md)).
- **Data Flow**: Layered architecture ensuring separation of concerns (see [Data Flow](data_flow.md)).
- **Health Checks**: `/health` endpoint for monitoring DB and Redis connectivity.
- **Graceful Shutdown**: Handles SIGINT/SIGTERM for clean connection closing.
- **Automated Workflows**: Agentic workflows for documentation.
