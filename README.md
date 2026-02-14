# Real-time Task Manager

## 📖 Overview

Real-time Task Manager is a robust, scalable backend application designed to handle task management operations with real-time capabilities. Built with **Node.js**, **Express**, and **TypeScript**, it leverages **PostgreSQL** for reliable data persistence (managed via **Prisma ORM**) and **Redis** for high-performance caching and messaging (Pub/Sub).

The project is containerized using **Docker** to ensure consistent development and deployment environments.

---

## 🚀 Features

- **Robust API Architecture**: Built on Express.js with a modular structure.
- **Type Safety**: Fully written in TypeScript for better maintainability and developer experience.
- **ORM & Database Management**: **Prisma** for type-safe database queries, schema management, and seeding.
- **Centralized Configuration**: Environment variables are managed and validated using `Joi` to prevent runtime errors due to missing configs.
- **Database & Caching**: 
  - **PostgreSQL** for structured data storage.
  - **Redis** for caching and real-time features.
- **Dockerized Workflow**: Seamless setup with `docker-compose` for the app, database, and Redis.
- **Developer Tooling**: Integrated with ESLint, Prettier, and Nodemon for a smooth development workflow.
- **Health Checks**: Monitor system status via the `/health` endpoint (DB & Redis connectivity).
- **Graceful Shutdown**: Handles `SIGINT` and `SIGTERM` signals to cleanly close Database and Redis connections.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Cache/Message Broker**: [Redis](https://redis.io/)
- **Validation**: [Joi](https://joi.dev/)
- **Infrastructure**: [Docker](https://www.docker.com/) & Docker Compose

---

## 📂 Project Structure

```bash
real-time-task-manager/
├── backend/                # Backend Application
│   ├── prisma/             # Database Schema & Seed scripts
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/         # Environment config & validation
│   │   ├── controllers/    # Route logic & request handling
│   │   ├── middleware/     # Express logic (Validation, Error Handling)
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic (DB, Redis)
│   │   ├── utils/          # Helper utilities
│   │   ├── app.ts          # App setup
│   │   └── server.ts       # Entry point
│   ├── docker-compose.yml  # Container orchestration
│   ├── Dockerfile          # App container definition
│   └── package.json        # Dependencies & scripts
└── frontend/               # Frontend Application (Upcoming)
```

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (or yarn/pnpm)
- **Docker** & **Docker Compose** installed and running.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd real-time-task-manager
    ```

2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Environment Variables:**
    Copy the sample environment file to create your local `.env` file.
    ```bash
    cp sample.env .env
    ```
    *Modify the `.env` file if you need to change ports or database credentials.*

5.  **Start Infrastructure:**
    Spin up the PostgreSQL and Redis containers (and the Redis Insight GUI) without starting the app container, allowing for local development.
    ```bash
    docker-compose up -d postgres redis redis-insight
    ```

6.  **Initialize Database (Prisma):**
    Run the following commands to generate the Prisma client and seed the database.
    ```bash
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    ```

### Running the Application

*   **Development Mode** (with hot-reload):
    Runs the app locally, connected to the Dockerized services.
    ```bash
    npm run dev
    ```

*   **Full Docker Environment**:
    Run the entire stack (App + DB + Redis) inside Docker:
    ```bash
    docker-compose up -d --build
    ```

*   **Production Build**:
    ```bash
    npm run build
    npm start
    ```

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check endpoint (Returns 200/503) |
| `GET` | `/api/v1/users` | List all users |
| `POST` | `/api/v1/users` | Create a new user |
| `GET` | `/api/v1/users/:id` | Get user by ID |
| `GET` | `/api/v1/projects` | List all projects |
| `POST` | `/api/v1/projects` | Create a new project |
| `GET` | `/api/v1/projects/:id` | Get project details (with tasks) |
| `GET` | `/api/v1/tasks` | List/Filter tasks |
| `POST` | `/api/v1/tasks` | Create a new task |
| `PUT` | `/api/v1/tasks/:id` | Update task status/assignee |

---

## 🐳 Docker Services

The `docker-compose.yml` file orchestrates the following services:

| Service | Internal Port | Host Port | Description |
| :--- | :--- | :--- | :--- |
| `app` | `8080` | `8080` | The Node.js Backend API |
| `postgres` | `5432` | `5433` | Primary Database (Mapped to 5433 to avoid conflicts) |
| `redis` | `6379` | `6379` | Caching & Pub/Sub Layer |
| `redis-insight` | `5540` | `5540` | GUI for managing Redis |

Access **Redis Insight** at `http://localhost:5540` to visualize Redis data.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 🔮 Future Roadmap

- [x] Create core Task CRUD endpoints.
- [ ] Implement robust User Authentication (JWT).
- [ ] Integrate Real-time updates using Socket.io or SSE (via Redis).
- [ ] Develop the Frontend (React/Next.js/Vue).
- [ ] Add Comprehensive Unit & Integration Tests.
