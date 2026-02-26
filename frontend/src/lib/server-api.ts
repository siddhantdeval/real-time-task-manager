import { cookies } from 'next/headers';
import { getSessionCookieName } from './utils';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:3001/api/v1';

/**
 * A wrapper around `fetch` for use ONLY in Server Components or Server Actions.
 * Automatically attaches the HttpOnly session cookie to the request.
 */
export async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const sessionCookieName = getSessionCookieName();
  const sessionToken = cookieStore.get(sessionCookieName)?.value;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (sessionToken) {
    headers.set('Cookie', `${sessionCookieName}=${sessionToken}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.errors?.[0] || 'API Request Failed');
  }

  return data;
}
