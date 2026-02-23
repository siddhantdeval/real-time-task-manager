# API Reference

> *Last updatedAt: 2026-02-23*

All endpoints are prefixed with `/api/v1`.

## 🏥 Health & System
### Health Check
Check the status of the API and its dependencies (PostgreSQL, Redis).
- **Endpoint**: `GET /health`
- **Protected**: No
- **Response**: `200 OK`

---

## 🔐 Authentication
See [Authentication System](authentication_system.md) for deeper details.

### Register
- **Endpoint**: `POST /auth/register`
- **Payload**: `{ "email": "...", "password": "..." }`
- **Response**: `201 Created`

### Login
- **Endpoint**: `POST /auth/login`
- **Payload**: `{ "email": "...", "password": "..." }`
- **Response**: `200 OK` (Sets `sessionId` cookie)

### Google Login
- **Endpoint**: `POST /auth/google`
- **Payload**: `{ "token": "id_token" }`
- **Response**: `200 OK`

### Logout
- **Endpoint**: `POST /auth/logout`
- **Response**: `200 OK` (Clears `sessionId` cookie)

### Get Current User
- **Endpoint**: `GET /auth/me`
- **Protected**: Yes
- **Response**: `{ "user": { ... } }`

---

## 📁 Projects
### List Projects
- **Endpoint**: `GET /projects`
- **Protected**: Yes

### Create Project
- **Endpoint**: `POST /projects`
- **Protected**: Yes
- **Payload**: `{ "name": "...", "description": "...", "owner_id": "uuid" }`

### Get Project Details
- **Endpoint**: `GET /projects/:id`
- **Protected**: Yes

### Update Project
- **Endpoint**: `PUT /projects/:id`
- **Protected**: Yes
- **Payload**: `{ "name": "...", "description": "..." }`

### Delete Project
- **Endpoint**: `DELETE /projects/:id`
- **Protected**: Yes

---

## ✅ Tasks
### List/Filter Tasks
- **Endpoint**: `GET /tasks`
- **Protected**: Yes
- **Query Params**:
  - `project_id`: Filter by project
  - `assignee_id`: Filter by user
  - `status`: One of `todo`, `in_progress`, `done`

### Get Task
- **Endpoint**: `GET /tasks/:id`
- **Protected**: Yes

### Create Task
- **Endpoint**: `POST /tasks`
- **Protected**: Yes
- **Payload**: `{ "title": "...", "project_id": "uuid", "description": "...", "status": "...", "priority": "..." }`

### Update Task
- **Endpoint**: `PUT /tasks/:id`
- **Protected**: Yes
- **Payload**: `{ "title": "...", "status": "...", "priority": "...", "assignee_id": "uuid" }`

### Delete Task
- **Endpoint**: `DELETE /tasks/:id`
- **Protected**: Yes

---

## 👤 Users
### List Users
- **Endpoint**: `GET /users`
- **Protected**: Yes

### Get User
- **Endpoint**: `GET /users/:id`
- **Protected**: Yes

### Create User (Admin)
- **Endpoint**: `POST /users`
- **Protected**: Yes
- **Payload**: `{ "email": "...", "password": "...", "role": "admin|member" }`

### Update User
- **Endpoint**: `PUT /users/:id`
- **Protected**: Yes

### Delete User
- **Endpoint**: `DELETE /users/:id`
- **Protected**: Yes
