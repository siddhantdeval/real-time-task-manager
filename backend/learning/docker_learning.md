# Docker Learning & Implementation Guide

This document details the containerization strategy, orchestration, and best practices for the Real-Time Task Manager.

## 1. Implementation Approach

The application is fully containerized using **Docker**, with orchestration managed by **Docker Compose**. This ensures environment consistency across development, testing, and production.

### Core Stack
- **Engine**: Docker
- **Orchestration**: Docker Compose
- **Base Image**: `node:20-alpine` (Lightweight, secure)

### Container Architecture
The `Dockerfile` defines the application image:
- **Base**: Uses the Alpine variant of Node.js to minimize image size.
- **Dependencies**: Installs `npm` packages and runs `npx prisma generate` to create the Prisma Client.
- **Build**: Compiles TypeScript to JavaScript (`dist/`).
- **Runtime**: Exposes port `8080` and runs the compiled code.

## 2. Key Considerations & Learnings

### Service Discovery
**Context**: How containers communicate with each other.
**Implementation**:
- Docker Compose creates a default network (e.g., `app-network`).
- Services address each other by their service name defined in `docker-compose.yml`.
- **Example**: The backend connects to Postgres at `postgres:5432` and Redis at `redis:6379`.
- **Learning**: never use `localhost` inside a container to reach another container using bridge networking. `localhost` refers to the container itself.

### Persistence -> Volumes
**Context**: Containers are ephemeral; data is lost when they stop.
**Implementation**:
- **Postgres**: Uses a named volume `pgdata` mapped to `/var/lib/postgresql/data`.
- **Redis**: Uses a named volume `redisdata` mapped to `/data` and runs with `--appendonly yes` for durability.
- **Why**: Ensures database and cache data survive container restarts.

### Health Checks & Dependency Management
**Context**: The application should not start processing requests until its dependencies are ready.
**Implementation**:
- **Postgres**: Configured with a `healthcheck` (using `pg_isready`).
- **App**: Uses `depends_on` with `condition: service_healthy` for Postgres.
- **Why**: Prevents "connection refused" errors during startup race conditions.

## 3. Usage & Best Practices

### Development Workflow
- **Start**: `docker compose up -d` spins up the entire stack (App, DB, Redis, RedisInsight).
- **Logs**: `docker compose logs -f app` to tail backend logs.
- **Teardown**: `docker compose down` stops and removes containers.

### Integration Testing using Docker
The project uses specific Docker configurations for testing:
- **File**: `docker-compose.test.yml`
- **Workflow**:
  1. Spin up a test-specific Redis instance (`redis-test` on port 6380).
  2. Run Jest tests which connect to this ephemeral instance.
  3. Tear down the container.
- **Command**: `npm run test:integration`

### Debugging
- **RedisInsight**: Included as a service on port `5540` to visually inspect Redis data.
- **Exec**: Access a running container shell via `docker exec -it task_manager_app sh` to debug internals.

## 4. Pros/Cons

**Pros**:
- **Consistency**: "Works on my machine" is solved; everyone runs the exact same environment.
- **Isolation**: Dependencies (DB versions, Node versions) are isolated from the host OS.
- **Onboarding**: New developers only need Docker installed to get the full stack running.

**Cons**:
- **Resource Usage**: Running multiple containers consumes more RAM/CPU than native processes.
- **Complexity**: Debugging network issues or volume permissions can be tricky initially.

## 5. Scalable Factors
- **Microservices Ready**: The architecture isolates services (App, DB, Redis), identifying clear boundaries for splitting into microservices if needed.
- **Replication**: Docker Compose can scale services (e.g., `docker compose up --scale app=3`), though this requires a load balancer (like Nginx) in front.
