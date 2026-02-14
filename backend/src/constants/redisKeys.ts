export const sessionKey = (sessionId: string): string => `session:${sessionId}`;

export const projectTasksKey = (projectId: string): string => `project:tasks:${projectId}`;

export const rateLimitKey = (userId: string, window: string): string => `ratelimit:${userId}:${window}`;
