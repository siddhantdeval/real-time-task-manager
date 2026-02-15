# API Reference

Base URL: `/api/v1`

## Health Check

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Check system status (DB & Redis connection) | No |

## Authentication

See [Authentication System](authentication_system.md) for detailed Auth API documentation.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/google` | Google OAuth Login |
| `POST` | `/auth/logout` | Logout |
| `GET` | `/auth/me` | Get current user |

## Users

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | List all users | Yes |
| `GET` | `/users/:id` | Get user by ID | Yes |

## Projects

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects` | List all projects | Yes |
| `POST` | `/projects` | Create a new project | Yes |
| `GET` | `/projects/:id` | Get project details | Yes |

## Tasks

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | List/Filter tasks | Yes |
| `GET` | `/tasks/:id` | Get task details | Yes |
| `POST` | `/tasks` | Create a new task | Yes |
| `PUT` | `/tasks/:id` | Update task details | Yes |
| `DELETE` | `/tasks/:id` | Delete a task | Yes |

**Query Parameters for `GET /tasks`**:
- `project_id`: Filter by Project UUID
- `assignee_id`: Filter by User UUID
- `status`: Filter by status (`todo`, `in_progress`, `done`)

