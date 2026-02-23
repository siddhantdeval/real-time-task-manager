# Backend Overview

> *Last updatedAt: 2026-02-23*

## 📖 Introduction
The Backend service for the Real-time Task Manager is a high-performance, scalable Node.js application. It manages tasks, projects, and users, while providing real-time synchronization capabilities.

## 🛠 Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Cache/Session**: [Redis](https://redis.io/)
- **Validation**: [Joi](https://joi.dev/)
- **Logging**: Winston & Morgan
- **Infrastructure**: Docker & Docker Compose

## 📂 Project Structure
```text
backend/
├── prisma/             # Database Schema & Migrations
├── src/
│   ├── config/         # App configuration & env validation
│   ├── controllers/    # Request handlers (HTTP layer)
│   ├── dto/            # Data Transfer Objects & Joi schemas
│   ├── middleware/     # Auth, Validation, & Error handlers
│   ├── routes/         # API endpoint definitions
│   ├── services/       # Business logic & Persistence interaction
│   ├── utils/          # Helpers & Shared utilities
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
└── docker-compose.yml  # Local services orchestration
```

## 🚀 Key Architectural Decisions
1. **Controller-Service Pattern**: We use a two-tier architecture where Controllers handle HTTP concerns and Services handle business logic and direct database/cache interactions.
2. **DTO-Based Validation**: All incoming request bodies are validated against Joi schemas defined in the `src/dto/` directory before reaching the application logic.
3. **Session-Based Auth (Redis)**: State-of-the-art authentication using secure session cookies backed by Redis for sub-millisecond validation.
4. **Resilient Persistence**: Prisma ORM provides type-safe access to PostgreSQL, ensuring data integrity and developer productivity.
5. **Horizontal Scalability**: The application is stateless (sessions in Redis), allowing for easy scaling across multiple containers.

## 🔗 Related Documentation
- [API Reference](api_reference.md)
- [Authentication System](authentication_system.md)
- [Data Flow](data_flow.md)
- [OpenAPI Spec](openapi.yaml)
