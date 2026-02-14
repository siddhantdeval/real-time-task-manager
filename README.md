# Real-Time Task Manager

## 📖 Overview

Real-time Task Manager is a robust, scalable application designed to handle task management operations with real-time capabilities. It features a high-performance **Backend** service built with Node.js, Express, TypeScript, and Redis.

## 🚀 Key Features

- **Real-time Updates**: Powered by Redis Pub/Sub.
- **Secure Authentication**: Session-based auth with Google OAuth support.
- **Scalable Architecture**: Dockerized services for consistent deployment.
- **Type Safety**: End-to-end TypeScript implementation.

---

## 📂 Documentation

Detailed documentation is available in the `backend/docs/` directory:

-   **[Backend Overview](backend/docs/backend_overview.md)**: Architecture, Tech Stack, and Project Structure.
-   **[Authentication System](backend/docs/authentication_system.md)**: Deep dive into the Redis-backed Auth flow and Security.
-   **[API Reference](backend/docs/api_reference.md)**: Complete list of API endpoints.

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Running the Backend

1.  **Clone & Install**
    ```bash
    git clone <repository-url>
    cd real-time-task-manager/backend
    npm install
    ```

2.  **Configure Environment**
    ```bash
    cp sample.env .env
    # Update .env with your credentials
    ```

3.  **Start Infrastructure**
    ```bash
    docker-compose up -d
    ```

4.  **Run Migrations & Start**
    ```bash
    npx prisma migrate dev
    npm run dev
    ```

For detailed setup instructions, see [Backend Overview](backend/docs/backend_overview.md).

---

## 🤝 Contributing

We welcome contributions! Please fork the repository and submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
