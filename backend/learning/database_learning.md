# Database Learning & Implementation Guide (Prisma + PostgreSQL)

This document details the database architecture, ORM usage, and best practices for the Real-Time Task Manager.

## 1. Implementation Approach

The project uses **PostgreSQL** as the relational database and **Prisma** as the Object-Relational Mapper (ORM).

### Core Stack
- **Database**: PostgreSQL (v14+ recommended)
- **ORM**: Prisma
- **Client**: `@prisma/client`
- **Migration Tool**: `prisma migrate`

### Schema Design
The database schema is defined in `prisma/schema.prisma`.
- **Models**: `User`, `Project`, `Task`
- **Relations**:
  - One-to-Many: User -> Projects (Owner)
  - One-to-Many: Project -> Tasks
  - One-to-Many: User -> Tasks (Assignee)

## 2. Key Considerations & Learnings

### Connection Management
**Context**: managing database connections efficiently is crucial for performance and stability.
**Implementation**:
- Prisma manages a connection pool internally.
- **Environment Variable**: `DB_URL` must be configured.
- **Docker**: In `docker-compose.yml`, the service is named `postgres` (or similar). The `DB_URL` must use this hostname (e.g., `postgresql://user:pass@postgres:5432/mydb`).
- **Graceful Shutdown**: Always disconnect the Prisma Client (`await prisma.$disconnect()`) when the application shuts down to release connections.

### Health Checks
- Verify database connectivity using a simple query (e.g., `await prisma.$queryRaw`SELECT 1``) in the `/health` endpoint.
- If the DB is down, the application should report "Unhealthy" so orchestrators can restart/route traffic elsewhere.

### Seeding
**Context**: Populating the database with initial data for development/testing.
**Implementation**:
- Use `prisma/seed.ts`.
- Run via `npx prisma db seed`.
- **Best Practice**: Idempotency. Ensure seed scripts check if data exists before creating it to avoid duplicates/errors on re-runs.

## 3. Usage & Best Practices

### Migrations
- **Development**: Use `npx prisma migrate dev --name <migration_name>` to apply schema changes and generate SQL migration files.
- **Production**: Use `npx prisma migrate deploy` to apply pending migrations without resetting the DB or interactive prompts.
- **Why**: Keeps database schema in sync with codebase version control.

### Type Safety
- **Generated Types**: Prisma generates TypeScript types based on the schema.
- **Usage**: Use these types in services/controllers to ensure data consistency.
  ```typescript
  import { User, Prisma } from '@prisma/client';
  
  const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({ data });
  }
  ```

### Data Access Architectural Decision
**Context**: Initially considered a Repository pattern but pivoted to a **Service-Direct-to-Client** approach.
**Decision**: Interactions with PostgreSQL are handled directly within services using the `db` (Prisma) client.
**Why**: 
- **Boilerplate Reduction**: Prisma's API is type-safe and feature-rich enough that a repository layer often becomes redundant.
- **Maintainability**: Direct access makes the code easier to read and follow for most tasks.
- **Flexibility**: Complex transactions and relationships are easier to manage when not constrained by a generic repository interface.


## 4. Pros/Cons

**Pros**:
- **Type Safety**: End-to-end type safety from DB to API response.
- **Productivity**: Intuitive API for querying (`findMany`, `create`, etc.) compared to raw SQL.
- **Migrations**: Built-in migration system handles schema evolution robustly.

**Cons**:
- **Abstraction**: Complex queries might be harder to optimize or express than raw SQL.
- **Performance**: ORMs add a slight overhead compared to raw drivers (though usually negligible for this use case).

## 5. Scalable Factors
- **Connection Pooling**: Prisma's pool management allows efficient handling of concurrent requests.
- **Indexing**: The schema defines indexes (`@@index([email])`, `@@index([title])`) to optimize search performance as data grows.
- **Statelessness**: The DB is external to the app; adding more app instances doesn't confuse DB state.
