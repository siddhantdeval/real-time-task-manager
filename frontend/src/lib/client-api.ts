export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * A wrapper around `fetch` for use ONLY in Client Components (`'use client'`).
 * Uses `credentials: 'include'` so the browser automatically sends the HttpOnly session cookie.
 */
export async function clientFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // <--- Crucial for sending HttpOnly cookie from browser
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.errors?.[0] || 'API Request Failed');
  }

  return data;
}
