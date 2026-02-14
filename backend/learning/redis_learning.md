# Redis Learning & Implementation Guide

This document outlines the Redis implementation strategy, configuration best practices, and resilience patterns adopted in the Real-Time Task Manager backend.

## 1. Implementation Approach

The backend uses **Redis** for caching, session management, and potentially Pub/Sub messaging. The connection is managed via the **ioredis** library, which offers robust features for clustering and sentinel support if needed in the future.

### Core Stack
- **Service**: Redis (v7+ recommended)
- **Client Library**: `ioredis`
- **Environment**: Docker (Service name: `redis`)

## 2. Key Considerations & Learnings

### Configuration & Validation
**Context**: Connecting to Redis requires precise configuration of host, port, and password.
**Implementation**:
- **Environment Variables**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (optional).
- **Validation**: Use **Joi** in the config module to enforce that `REDIS_HOST` and `REDIS_PORT` are defined.
- **Docker Networking**: When running in Docker, `REDIS_HOST` should be set to the service name (e.g., `redis`), not `localhost`.

### Connection Resilience (Retry Strategy)
**Context**: Redis might be temporarily unavailable during startup or network blips.
**Implementation**:
- Configure `ioredis` with a custom `retryStrategy` function.
- **Example Pattern**: Exponential backoff or a fixed delay with a max retry count.
  ```typescript
  const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });
  ```
- **Why**: Prevents the application from crashing immediately if Redis is slow to start, but eventually gives up if it's permanently down.

### Health Checks
- Implement a ping check in the `/health` endpoint: `await redis.ping()`.
- If the ping fails or times out, report the service as unhealthy.

Graceful Shutdown
- Ensure `redis.quit()` or `redis.disconnect()` is called when the application receives a shutdown signal (`SIGTERM`/`SIGINT`).

## 3. Usage & Best Practices

### Caching
- **Pattern**: Cache-aside. Check Redis for data before querying the database.
- **TTL**: Always set a Time-To-Live (TTL) for cached keys to prevent stale data accumulation.

### Pub/Sub
- Redis Pub/Sub can be used for real-time features (e.g., notifying WebSocket servers of updates).
- **Note**: Pub/Sub messages are fire-and-forget. If a subscriber is down, the message is lost.

## 4. Pros/Cons

**Pros**:
- **Performance**: Extremely low latency for read-heavy operations.
- **Simplicity**: Simple key-value data structures are easy to reason about.
- **Ecosystem**: `ioredis` is a mature, feature-rich client.

**Cons**:
- **Volatility**: Data is lost on restart unless persistence (RDB/AOF) is configured.
- **Memory Bound**: Dataset size is limited by available RAM.

## 5. Scalable Factors
- **Clustering**: Redis Cluster allows horizontal scaling by sharding data across multiple nodes.
- **Replication**: Master-Replica setup allows for high availability and distributing read traffic.
- **Pipelines**: Use pipelining to batch multiple commands into a single network request for higher throughput.
