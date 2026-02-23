# Real-Time Task Manager - Frontend

> **Last Updated at:** 2026-02-23

This is the frontend implementation of the Real-Time Task Manager, built with a modern, high-performance tech stack focused on scalability and developer experience.

## 🚀 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Networking:** [Axios](https://axios-http.com/) & [Socket.io-client](https://socket.io/docs/v4/client-api/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📂 Project Structure

- `src/app`: Next.js App Router routes and layouts.
- `src/components`: Reusable UI components.
  - `common`: Atom-level primitives (Buttons, Inputs).
  - `layout`: Structural components (Navbar, Sidebar).
  - `modules`: Feature-specific logic.
- `src/lib`: Core utilities (API client, Providers).
- `src/store`: Global state management.
- `src/hooks`: Custom React hooks.
- `src/types`: Shared TypeScript interfaces.
- `docs/`: Detailed architectural and screen-specific documentation.

## 📖 Documentation

For detailed specifications, refer to the following:
- [Frontend Overview](./docs/frontend_overview.md)
- [UI Standards & Design System](./docs/ui_standards.md)
- [Authentication Flows](./docs/auth_screens.md)
- [Projects Dashboard](./docs/projects_screen.md)
- [Task Management](./docs/tasks_screen.md)
- [AI Design Prompts](./docs/prompts/)

## 🔗 Backend Integration

The frontend communicates with the Node.js backend located in the `/backend` directory.
- **Base URL:** `http://localhost:3000/api/v1` (configurable via `.env`)
- **Authentication:** Secure cookie-based session management (`withCredentials: true`).
- **Real-Time:** WebSockets for live task and project updates.
- **API Specification:** Refer to the [OpenAPI Specification](../backend/docs/openapi.yaml) for detailed endpoint schemas and request/response structures.

## 🛠 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result. (Default port may vary if 3000 is occupied by the backend).

### Build

```bash
npm run build
```
