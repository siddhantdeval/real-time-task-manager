# Authentication Screens

> *Last updatedAt: 2026-02-23*

This document outlines the frontend implementation specifics for the Authentication flows (Registration, Login, Google OAuth, and Logout).

## 🗺️ Flow Overview

1. Unauthenticated users hitting any protected route (`/projects` or `/tasks`) must be redirected to `/auth/login`.
2. Users can choose to log in via Email/Password OR Google OAuth.
3. Upon successful login (`200 OK`), the backend sets an `HttpOnly`, `SameSite=Strict` session cookie.
4. The frontend routes the user to the default protected view (e.g., `/projects`) and fetches the current user profile from `/auth/me`.

## 🎨 Screens & Components

### 1. Unified Auth Layout
- **Purpose**: A centered card layout on a light gray background (`bg-gray-50`) that houses either the Login or Registration forms.
- **Header**: Includes the Real-Time Task Manager logo and a descriptive title ("Sign in to your account" or "Create a new account").
- **Footer**: A subtle link toggling between Login and Registration views ("Don't have an account? Sign up").

### 2. Login Form (`/auth/login`)
- **Fields**:
  - `Email`: `type="email"`, required, standard validation.
  - `Password`: `type="password"`, required.
- **Actions**:
  - **Submit Button**: Primary Indigo. Displays loading spinner while `POST /api/v1/auth/login` is pending.
  - **Google Login Button**: Styled bordered button (`bg-white border-gray-300 text-slate-700`) with a Google SVG icon. Calls `POST /api/v1/auth/google`.
- **Error States**:
  - Invalid credentials should display a red alert box above the form.
  - Field-level errors (e.g., invalid email format) show inline below the input.

### 3. Registration Form (`/auth/register`)
- **Fields**:
  - `Email`: `type="email"`, required.
  - `Password`: `type="password"`, required, minimum 6 characters.
  - `Confirm Password`: `type="password"`, frontend-only validation to match Password.
- **Actions**:
  - **Submit Button**: Primary Indigo. Calls `POST /api/v1/auth/register`. On success (201), automatically log the user in or redirect to `/auth/login` with a success toast.
- **Error States**:
  - "Email already exists" backend error returns inside an alert box.

## 🔌 API Integration Constraints
*Note: Refer to backend `api_reference.md` for exact payload schemas.*

```typescript
// Important: Include credentials for secure cookie transport!
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true // Crucial for session cookies
});
```

- **Fetching Current User**: On app load (or route change), call `GET /api/v1/auth/me`. 
  - If it succeeds, populate global state (`user`).
  - If it returns `401 Unauthorized`, clear local state and redirect to `/auth/login`.
- **Logout**: Call `POST /api/v1/auth/logout`. Clear global user state, and redirect to login. The backend will naturally clear the cookie.
