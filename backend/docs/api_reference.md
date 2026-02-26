# API Reference

> *Last updated: 2026-02-27*

All endpoints are prefixed with `/api/v1`. All protected routes require an active session cookie (`sessionId`).

---

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

### List All Projects
Returns all projects with owner info, members, and task count.
- **Endpoint**: `GET /projects`
- **Protected**: Yes

### List My Projects
Returns only the authenticated user's non-archived projects, sorted by most recently updated.
- **Endpoint**: `GET /projects/me`
- **Protected**: Yes

### Get Project Details
Returns full project with tasks, members, last 5 activity entries, and computed progress.
- **Endpoint**: `GET /projects/:id`
- **Protected**: Yes
- **Response includes**: `progress: { total, done, percentage }`

### Create Project
`owner_id` is **always** derived from the authenticated session — never from the request body.
- **Endpoint**: `POST /projects`
- **Protected**: Yes
- **Payload**: `{ "name": "...", "description": "...", "labelColor": "..." }`
- **Response**: `201 Created`

### Update Project
Requires owner or Lead role.
- **Endpoint**: `PUT /projects/:id`
- **Protected**: Yes
- **Payload**: `{ "name": "...", "description": "...", "labelColor": "...", "status": "ACTIVE|ARCHIVED" }`

### Archive Project
Sets project status to `ARCHIVED` and logs activity. Requires owner or Lead role.
- **Endpoint**: `PATCH /projects/:id/archive`
- **Protected**: Yes

### Delete Project
Only the project owner can delete a project.
- **Endpoint**: `DELETE /projects/:id`
- **Protected**: Yes

---

## 👥 Project Members

### List Members
- **Endpoint**: `GET /projects/:id/members`
- **Protected**: Yes

### Add Member
Invite a user by email. Requires owner or Lead role.
- **Endpoint**: `POST /projects/:id/members`
- **Protected**: Yes
- **Payload**: `{ "email": "user@example.com", "role": "LEAD|MEMBER|VIEWER" }`
- **Response**: `201 Created`

### Update Member Role
Requires owner or Lead role.
- **Endpoint**: `PATCH /projects/:id/members/:memberId`
- **Protected**: Yes
- **Payload**: `{ "role": "LEAD|MEMBER|VIEWER" }`

### Remove Member
Requires owner or Lead role.
- **Endpoint**: `DELETE /projects/:id/members/:memberId`
- **Protected**: Yes

---

## 📊 Project Activity & Progress

### Recent Activity
Returns the last 10 activity entries for a project (actor info included).
- **Endpoint**: `GET /projects/:id/activity`
- **Protected**: Yes

### Progress
Returns task completion stats for a project.
- **Endpoint**: `GET /projects/:id/progress`
- **Protected**: Yes
- **Response**: `{ "total": 12, "done": 5, "percentage": 41 }`

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

---

## ⚠️ Error Responses

All errors follow a consistent shape:

```json
{ "success": false, "message": "Human-readable error message" }
```

| HTTP Code | Meaning |
|-----------|---------|
| `400` | Bad request / validation failure |
| `401` | Not authenticated |
| `403` | Forbidden (insufficient role) |
| `404` | Resource not found |
| `500` | Internal server error |
