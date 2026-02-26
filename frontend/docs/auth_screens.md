# Authentication Screens

> *Last updated: 2026-02-27*

This document outlines the frontend implementation specifics for the Authentication flows (Login, Sign Up, Forgot Password, Reset Password, and Logout).

## 🗺️ Route Overview

| Route | Component | Server Action |
|-------|-----------|---------------|
| `/login` | `app/(auth)/login/page.tsx` | `loginAction` |
| `/signup` | `app/(auth)/signup/page.tsx` | `signupAction` |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | `forgotPasswordAction` |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | `resetPasswordAction` |
| Logout (Header) | `Header.tsx` → `logoutAction()` | `logoutAction` |

All auth routes live in `src/app/(auth)/` — a Next.js route group that does **not** include the main `<Header>`. The layout uses `AuthSplitLayout` (`components/layout/AuthSplitLayout.tsx`) — a centered card on a branded split-panel background.

---

## 🔐 Cookie Architecture

The backend sets an `HttpOnly`, `SameSite=Strict` session cookie. Because Next.js Server Actions run on the server (not the browser), the cookie from the backend response is **not** automatically available to the Next.js cookie store.

**Solution**: The `addBackEndCookies` helper in `auth.actions.ts` manually:
1. Reads the `Set-Cookie` header from the backend `fetch` response.
2. Parses it using `set-cookie-parser`.
3. Re-sets the parsed cookie onto the Next.js `cookieStore` via `cookies()` from `next/headers`.

```typescript
// auth.actions.ts (simplified)
const setCookieHeader = response.headers.get('set-cookie');
const parsedCookies = setCookie.parse(setCookieHeader);
const sessionCookie = parsedCookies.find(c => c.name === getSessionCookieName());
cookieStore.set(sessionCookie.name, sessionCookie.value, { httpOnly: true, ... });
```

---

## 🎨 Screens & Components

### Layout: `AuthSplitLayout`
- A centered card on a light/dark branded background.
- Renders the application logo and a `children` slot for the form.

### 1. Login Form (`/login`)
- **Fields**: `Email` (type `email`, required), `Password` (type `password`, required, min 6 chars).
- **Server Action**: `loginAction` (Zod-validated). On success, redirects to `/projects`.
- **Error States**:
  - Field errors (e.g., invalid email format) returned as `fieldErrors` via `useActionState` and displayed inline below each field.
  - Server errors (wrong credentials) returned as a top-level `error` string shown in a red alert box.
- **Google Login**: Styled bordered button with a Google SVG icon. Calls `POST /api/v1/auth/google`.

### 2. Sign Up Form (`/signup`)
- **Fields**: `Name` (min 2 chars), `Email`, `Password` (min 6 chars), `Confirm Password`.
- **Server Action**: `signupAction`. On success, automatically logs the user in (calls `POST /auth/login` internally) and redirects to `/projects`.
- **Error States**: Same inline + alert pattern as Login.

### 3. Forgot Password Form (`/forgot-password`)
- **Fields**: `Email` (required).
- **Server Action**: `forgotPasswordAction`. On success, shows a success message ("Check your email").
- No redirect on success — the user stays on the page to see the confirmation.

### 4. Reset Password Form (`/reset-password?token=...`)
- **Fields**: `Password` (min 6 chars), `Confirm Password` (must match).
- **Token**: Passed as a hidden form field from the URL search param.
- **Server Action**: `resetPasswordAction`. On success, redirects to `/login`.

### 5. Logout
- Triggered from `Header.tsx` via the user dropdown menu.
- Calls `logoutAction()` which:
  1. Reads `sessionId` from the Next.js `cookieStore`.
  2. Calls `POST /api/v1/auth/logout` to invalidate the Redis session.
  3. Deletes the `sessionId` cookie from the Next.js `cookieStore`.
  4. Redirects to `/login`.

---

## 🔌 API Integration

All auth fetches use the **raw `fetch`** directly in `auth.actions.ts` (not `serverFetch`), because the session cookie does not yet exist at login time.

| Action | Endpoint | Method |
|--------|----------|--------|
| Login | `/auth/login` | POST |
| Register | `/auth/register` | POST |
| Auto-Login (after register) | `/auth/login` | POST |
| Forgot Password | `/auth/forgot-password` | POST |
| Reset Password | `/auth/reset-password` | POST |
| Logout | `/auth/logout` | POST |
| Get Current User | `/auth/me` | GET |

---

## ⚠️ Protected Route Enforcement

Unauthenticated users hitting `/projects` (or any dashboard route) are redirected to `/login`. This is enforced by Next.js middleware or by `serverFetch` throwing a `401`, which should be caught at the page/layout level and trigger a `redirect('/login')`.
