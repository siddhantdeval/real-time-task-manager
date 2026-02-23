# Frontend Overview

> *Last updatedAt: 2026-02-23*

## 📖 Introduction
The Frontend service for the Real-time Task Manager is designed to be a highly responsive, modern single-page application (SPA). It provides a seamless interface for managing projects and tasks, deeply integrated with our highly scalable Node.js backend architecture.

## 🛠 Target Tech Stack Recommendations
To ensure high performance, maintainability, and alignment with the backend, the following technologies are recommended for the frontend implementation:
- **Framework**: [React](https://react.dev/) (via Next.js App Router or Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for complete end-to-end type safety matching the backend DTOs.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid UI development and consistent design tokens.
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/) (client state) + [React Query / SWR](https://tanstack.com/query/latest) (server caching).
- **Routing**: Next.js App Router (recommended) or React Router v6.
- **Real-Time Data**: Standard WebSockets (`socket.io-client`) or Server-Sent Events (SSE).

## 📂 Proposed Frontend Structure
```text
frontend/
├── public/             # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js Pages / Routes
│   ├── components/
│   │   ├── common/     # Reusable UI components (Buttons, Inputs, Modals)
│   │   ├── layout/     # Structural components (Navbar, Sidebar, Footer)
│   │   └── modules/    # Feature-specific components (Auth, Projects, Tasks)
│   ├── hooks/          # Custom React Hooks
│   ├── lib/            # Utility functions & API clients
│   ├── store/          # Zustand global state (if needed)
│   └── types/          # TypeScript interfaces (Mirroring Backend DTOs)
```

## 🚀 Key Architectural Principles
1. **API First Integration**: The frontend acts purely as a consumer of the `api/v1` REST layer. Wait for successful DB persistence before optimistically updating the UI where appropriate.
2. **Session-Based Authentication**: The backend utilizes secure `HttpOnly`, `SameSite=Strict` cookies. The frontend **must not** attempt to manually manage or store JWTs/tokens in `localStorage`. API calls naturally send the session cookie automatically.
3. **Optimistic UI**: For rapid perceived performance (especially task dragging in Kanbans), update the local state immediately upon user action, then silently revert if the backend request fails.
4. **Real-time Synchronization**: A persistent WebSocket/SSE connection should be established upon successful login to listen to specific Redis-backed Pub/Sub channels (e.g., `project:<id>:tasks`) and automatically invalidate React Query caches to trigger a refetch.

## 🔗 Related Documentation
- [UI Standards & Design System](ui_standards.md)
- [Authentication Screens](auth_screens.md)
- [Projects Screen](projects_screen.md)
- [Task Management Screen](tasks_screen.md)
