# Node.js Learning & Implementation Guide

This document captures the key architectural decisions, implementation patterns, and learnings from the development of the Real-Time Task Manager backend.

## 1. Implementation Approach

The backend is built using **Node.js** with **Express** and **TypeScript**. It follows a modular architecture focusing on type safety, centralized configuration, and robust error handling.

### Core Stack
- **Runtime**: Node.js (Latest LTS recommended)
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Joi
- **Logging**: Winston & Morgan
- **Linting**: ESLint & Prettier

### Project Structure
The project follows a standard layered architecture:
- `src/config`: Centralized configuration and environment variable validation.
- `src/controllers`: Request handlers (HTTP interface).
- `src/services`: Business logic and database interactions.
- `src/dto`: Data Transfer Objects and Joi validation schemas.
- `src/routes`: API route definitions.
- `src/middleware`: Request processing (Auth, Validation).

### Design Pattern: Controller-Service
**Approach**: We use a two-tier architecture of Controllers and Services.
- **Controllers** are responsible for parsing requests, extracting data, and returning responses. They do **not** contain business logic or direct database queries.
- **Services** are where the "heavy lifting" happens. They handle validation rules, security checks (e.g., project ownership), and directly interact with the Prisma client.
- **DTOs (Data Transfer Objects)**: We use DTOs to define the expected structure of incoming data. These are validated using **Joi** schemas before reaching the service layer.

**Why no Repository?**: For 90% of CRUD operations, Prisma's client already acts as a robust data access layer. Adding a separate Repository often results in "pass-through" code that adds boilerplate without significant benefit.


## 2. Key Considerations & Learnings

### Centralized Configuration
**Context**: Avoid using `process.env` directly throughout the codebase.
**Implementation**:
- Use a dedicated `config` module (e.g., `src/config/index.ts`).
- Validate all environment variables at startup using **Joi**.
- **Why**: Ensures the application "fails fast" if required configuration (like DB URL or Redis Host) is missing/invalid.
- **Example**:
  ```typescript
  // src/config/index.ts
  const envSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
    // ...
  }).unknown();
  ```

### Graceful Shutdown
**Context**: Ensure database connections and server listeners close correctly on implementation updates or crashes.
**Implementation**:
- Listen for `SIGTERM` and `SIGINT` signals.
- Close the HTTP server first to stop accepting new requests.
- Close Database and Redis connections subsequently.
- **Why**: Prevents data corruption and hanging connections during deployments.
- **Learning**: Implement robust shutdown logic that cleans up resources before process exit.

### Health Checks
**Context**: Load balancers and orchestrators (like K8s or Docker Swarm) need to know if the app is alive.
**Implementation**:
- Implement a `/health` endpoint.
- Check connectivity to critical dependencies (Postgres, Redis) within this endpoint.
- Return 200 OK only if all services are reachable.

## 3. Usage & Best Practices

### Validation
- **Input Validation**: Use **Joi** in middleware to validate request bodies/params before they reach controllers.
- **Environment Validation**: Validate `process.env` at bootstrap.

### Error Handling
- Use a centralized error handling middleware.
- Distinguish between Operational Errors (e.g., 400 Bad Request) and Programmer Errors (bugs).
- Log errors using **Winston** for structured logging.

### Docker Integration
- The application is containerized.
- **Key Learning**: When running in Docker, services must address each other by their service name (e.g., `redis` not `localhost`).

## 4. Pros/Cons

**Pros**:
- **Type Safety**: TypeScript prevents a class of runtime errors.
- **Scalability**: Stateless architecture allows horizontal scaling (spinning up more containers).
- **Maintainability**: Modular structure and centralized config make it easier to onboard new developers.

**Cons**:
- **Setup Complexity**: TypeScript requires compilation step (`tsc`) and type definitions.
- **Boilerplate**: Layered architecture requires more files for simple features.

## 5. Scalable Factors
- **Statelessness**: The API is designed to be stateless (session data in Redis), allowing for easy horizontal scaling behind a load balancer.
- **Async I/O**: Node.js non-blocking I/O handles high concurrency for I/O bound tasks (DB queries).
