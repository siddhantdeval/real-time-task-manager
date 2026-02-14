# Real-Time Features Learning

This document covers the implementation details and learnings for real-time capabilities in the application, specifically Server-Sent Events (SSE) and potential future WebSocket integrations.

## 1. Server-Sent Events (SSE)

**Topic/Concept**: Unidirectional Real-Time Communication.

**Context**: Used to send real-time updates from the server to the client (e.g., long-running task progress, notifications) without the overhead of polling.

**Solution/Implementation**:
- **Headers**: The response must set the following headers:
  ```typescript
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  ```
- **Data Format**: Messages must be formatted as strings starting with `data: ` and ending with `\n\n`.
  ```typescript
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
  ```
- **Nginx Configuration**: If running behind Nginx, you must disable buffering for the SSE endpoint to ensure events are sent immediately.
  ```nginx
  location /api/v1/sse-endpoint {
      proxy_buffering off;
      proxy_cache off;
      # ... other config
  }
  ```

**Key Takeaways/Gotchas**:
- **Connection Limits**: Browsers limit concurrent connections (typically 6 per domain). Use SSE sparingly or multiplex if possible.
- **Reconnection Loop**: The EventSource API in browsers automatically attempts to reconnect if the connection is closed.
  - **Fix**: To stop reconnection after a task is complete, the server should send a specific "end" event, and the client must explicitly call `eventSource.close()` upon receiving it.
- **Client Disconnect**: Always handle the `req.on('close', ...)` event on the server to stop processing/sending data and clean up resources (prevent memory leaks).
