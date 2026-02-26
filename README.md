# Real-Time Task Manager

## 📖 Overview

Real-Time Task Manager is a full-stack application for managing projects and tasks with real-time capabilities. It features a high-performance **Express + Prisma backend** and a **Next.js 15 App Router frontend**, connected via a Redis-backed session authentication system.

## 🚀 Key Features

- **Real-time Updates**: Redis Pub/Sub — WebSocket events for live task board synchronisation.
- **Secure Authentication**: Session-based auth with Google OAuth, Forgot Password, and Reset Password flows.
- **Project Management**: Create, archive, and manage projects with label colours and status tracking.
- **Team Collaboration**: Invite members by email with role-based access control (Owner / Lead / Member / Viewer).
- **Activity Logging**: Every significant project action is tracked and viewable per-project.
- **Progress Tracking**: Live task completion stats (`done / total / percentage`) per project.
- **Dark Mode**: Full dark/light theme with `localStorage` persistence and zero FOUC.
- **Type Safety**: End-to-end TypeScript from Prisma ORM to Next.js Server Actions + Zod schemas.

---

## 📂 Documentation

### Backend (`backend/docs/`)
| Document | Contents |
|----------|---------|
| [Backend Overview](backend/docs/backend_overview.md) | Architecture, Tech Stack, RBAC, Project Structure |
| [Authentication System](backend/docs/authentication_system.md) | Redis-backed sessions, frontend cookie bridge, all auth routes |
| [API Reference](backend/docs/api_reference.md) | All REST endpoints with payloads and responses |
| [Data Flow](backend/docs/data_flow.md) | Request lifecycle, RBAC validation flow, real-time sync |
| [OpenAPI Spec](backend/docs/openapi.yaml) | Machine-readable OpenAPI 3.0 spec (v1.1.0) |

### Frontend (`frontend/docs/`)
| Document | Contents |
|----------|---------|
| [Frontend Overview](frontend/docs/frontend_overview.md) | Next.js 15 App Router architecture, real folder structure, key decisions |
| [UI Standards](frontend/docs/ui_standards.md) | Tailwind tokens, dark mode, component conventions, Server Action rules |
| [Authentication Screens](frontend/docs/auth_screens.md) | Login, Sign Up, Forgot/Reset Password, Logout, cookie bridge |
| [Projects Screen](frontend/docs/projects_screen.md) | Dashboard RSC architecture, all project components and Server Actions |
| [Tasks Screen](frontend/docs/tasks_screen.md) | Target design for Phase 6 Kanban board (planned) |

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Running the Backend

```bash
cd backend
cp sample.env .env        # fill in DB_URL, REDIS_URL, GOOGLE_CLIENT_ID, etc.
docker-compose up -d      # start PostgreSQL + Redis
npx prisma migrate dev    # run migrations
npm run dev               # starts on :3001
```

### Running the Frontend

```bash
cd frontend
cp .env.example .env      # set NEXT_PUBLIC_API_URL + INTERNAL_API_URL
npm install
npm run dev               # starts on :3000
```

---

## 🏗️ Tech Stack

| Concern | Backend | Frontend |
|---------|---------|----------|
| Language | TypeScript | TypeScript |
| Framework | Express.js | Next.js 15 (App Router) |
| ORM / DB | Prisma + PostgreSQL | — |
| Cache / Session | Redis | — |
| Validation | Joi (DTOs) | Zod (Server Actions) |
| Styling | — | Tailwind CSS v4 |
| Auth | Session cookies (Redis) | Server Actions + set-cookie-parser |
| Real-time | Socket.IO / Redis Pub/Sub | SocketProvider (planned) |
| Infrastructure | Docker Compose | — |

---

## 🤝 Contributing

Fork the repository and submit a Pull Request. Commit message convention:
- `feat(backend):` / `feat(frontend):` — new features
- `fix(backend):` / `fix(frontend):` — bug fixes
- `docs(backend):` / `docs(frontend):` — documentation updates

## 📄 License

This project is licensed under the MIT License.
