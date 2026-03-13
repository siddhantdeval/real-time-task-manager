# Backend Overview

> *Last updated: 2026-02-27*

## 📖 Introduction
The Backend service for the Real-time Task Manager is a high-performance, scalable Node.js application. It manages tasks, projects, and users — with real-time synchronisation capabilities, role-based access control (RBAC), and project activity logging.

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

1. **Controller-Service Pattern**: Controllers handle HTTP concerns; Services handle business logic and direct database/cache interactions.
2. **DTO-Based Validation**: All incoming request bodies are validated against Joi schemas in `src/dto/` before reaching application logic.
3. **Session-Based Auth (Redis)**: Secure session cookies backed by Redis for sub-millisecond validation.
4. **Resilient Persistence**: Prisma ORM provides type-safe access to PostgreSQL.
5. **Data Caching**: High-read endpoints (like fetching task details) use a cache-aside pattern with Redis for low-latency responses, combined with an invalidate-on-write strategy to ensure data consistency.
6. **Horizontal Scalability**: The application is stateless (sessions and cache in Redis), allowing easy scaling across multiple containers.

## 🔐 Security Highlights

- `owner_id` is **always** sourced from the authenticated session (`req.user.id`) — never from the request body.
- The `assertOwnerOrLead` guard is enforced on all mutating project/member operations (archive, update, add/remove members, change roles).
- All routes under `/api/v1` (except `/health` and `/auth/*`) require a valid session cookie.

## 👥 Role-Based Access Control (RBAC)

| Role | Can read | Can update/archive | Can manage members |
|------|----------|--------------------|-------------------|
| Owner | ✅ | ✅ | ✅ |
| LEAD | ✅ | ✅ | ✅ |
| MEMBER | ✅ | ❌ | ❌ |
| VIEWER | ✅ | ❌ | ❌ |

## 📋 Activity Logging
Every significant mutation (project creation, archiving, adding a member) writes a `ProjectActivity` record via the `logActivity` utility. The last 5 entries are embedded in `GET /projects/:id` and up to 10 are available via `GET /projects/:id/activity`.

## 🔗 Related Documentation
- [API Reference](api_reference.md)
- [Authentication System](authentication_system.md)
- [Data Flow](data_flow.md)
- [OpenAPI Spec](openapi.yaml)
