# Projects Screen

> *Last updatedAt: 2026-02-23*

This document defines the frontend representation of the main user dashboard, where users view, create, edit, and delete their managed projects.

## 🗺️ Flow Overview

1. After login, authenticated users land on `/projects`.
2. A `GET /api/v1/projects` request fetches all projects accessible to the user.
3. Users are presented with a grid of project cards.
4. Clicking a project card routes the user to the Tasks view for that specific project (`/projects/:id`).
5. A "New Project" button opens a modal to execute a `POST /api/v1/projects`.

## 🎨 Screens & Components

### 1. Unified Authenticated Layout
- **Purpose**: A structural shell for all internal views.
- **Top Navigation Bar**:
  - Left: Logo / Brand Name.
  - Right: User Profile Dropdown (containing "Sign out" action calling `POST /api/v1/auth/logout`) and an Avatar based on the user's fetched details.
- **Main Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`.

### 2. Projects Dashboard (`/projects`)
- **Header Section**:
  - **Title**: "My Projects" (`text-3xl font-bold tracking-tight text-slate-900`).
  - **Action**: "New Project" button (Primary Indigo) floated right.
- **Empty State**:
  - Displayed when the fetched projects array is empty.
  - Features an illustration/icon (e.g., Heroicons `FolderPlus`), a brief descriptor ("No projects found"), and a secondary "Create your first project" button to launch the modal.
- **Project Grid**:
  - A responsive CSS grid (`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`).
  - **Project Card (`components/modules/ProjectCard`)**:
    - **Styles**: White background, faint border (`border-gray-200`), rounded corners (`rounded-xl`), slight shadow (`shadow-sm hover:shadow-md transition-shadow`).
    - **Header**: Project Name (`text-lg font-semibold text-slate-900`) and a generic "More Options" (`...`) dropdown menu for Edit/Delete actions.
    - **Body**: Truncated Description (`line-clamp-2 text-sm text-slate-500`) and the `created_at` timestamp formatted relative to now (e.g., "Created 2 days ago").
    - **Interaction**: The entire card (excluding the menu) is clickable and wraps a `<Link>` to the specific tasks view.

### 3. Modals
- **Create/Edit Project Modal**:
  - Fixed semi-transparent background (`bg-gray-500 bg-opacity-75 backdrop-blur-sm`).
  - Centered white dialog box (`bg-white rounded-lg shadow-xl max-w-lg w-full`).
  - **Fields**:
    - `Name` (Text input, required).
    - `Description` (Textarea, optional row count: 3).
  - **Actions**: "Cancel" (Secondary button) and "Save changes" (Primary Button, implements loading spinner during submission).

## 🔌 API Integration Constraints
*Note: Refer to backend `api_reference.md` for exact payload schemas.*

- **Data Fetching**: Use React Query (or similar tool) to query `GET /api/v1/projects` and cache the response.
- **Mutations**:
  - **Create**: `POST /api/v1/projects` payload `{ name, description, owner_id }`. On success (`201`), invalidate the `['projects']` query cache to refetch the grid, then close the modal.
  - **Delete**: `DELETE /api/v1/projects/:id`. Optimistically remove the card from the UI, then execute the request. If the request fails, revert the UI and show a generic toast error.
