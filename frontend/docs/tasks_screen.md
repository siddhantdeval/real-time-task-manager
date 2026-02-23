# Task Management Screen

> *Last updatedAt: 2026-02-23*

This document defines the frontend representation of the Task Management view for a specific project. This is the core interactive screen of the application.

## 🗺️ Flow Overview

1. User clicks a project card from the dashboard and navigates to `/projects/:id`.
2. A `GET /api/v1/projects/:id` request fetches the project details (Name, Description) for the header.
3. A `GET /api/v1/tasks?project_id=:id` request fetches all tasks associated with this project.
4. The UI renders the tasks in a Kanban Board (columns based on status) or a List View.
5. Users can drag-and-drop tasks to change statuses (`PUT /api/v1/tasks/:id`).
6. Users can click "New Task" to open a creation modal (`POST /api/v1/tasks`).
7. Real-time updates push changes from other users viewing the same project.

## 🎨 Screens & Components

### 1. Project Header Area
- **Location**: Top of the screen, below the main site navigation.
- **Content**: 
  - A subtle "Back to Projects" link (`text-sm text-indigo-600 hover:text-indigo-800 flex items-center mb-4`).
  - Project Title (`text-3xl font-bold text-slate-900`) and a truncated description below it.
  - Action Bar: "List View" / "Kanban View" toggle on the left, and a primary "New Task" button on the right.

### 2. Kanban Board (Default View)
- **Layout**: A horizontally scrolling flex container (`flex space-x-6 overflow-x-auto pb-4`).
- **Columns**: Three primary columns representing the status enums:
  1. `TODO` (Left)
  2. `IN_PROGRESS` (Middle)
  3. `DONE` (Right)
- **Column Header**: Column Name (`font-semibold text-slate-700 uppercase tracking-wide text-xs`) and a small count badge indicating the number of tasks in that column (`bg-gray-200 text-gray-600 rounded-full px-2 py-0.5`).

### 3. Task Card Component
- **Styles**: White card (`bg-white rounded-md shadow-sm border border-gray-200 p-4 mb-3 cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-300`).
- **Data Display**:
  - **Priority Badge**: Top-right corner.
    - `LOW`: Green (`bg-emerald-100 text-emerald-700`)
    - `MEDIUM`: Yellow (`bg-amber-100 text-amber-700`)
    - `HIGH`: Red (`bg-rose-100 text-rose-700`)
  - **Title**: `text-base font-medium text-slate-900 line-clamp-2 mb-1`.
  - **Meta**: Due Date (if present) formatted nicely (`text-xs text-slate-500 flex items-center`), with a clock icon.
  - **Assignee Avatar**: Small circular avatar (`w-6 h-6 rounded-full bg-indigo-100`) bottom-right corner.

### 4. Modals
- **Task Create/Edit Modal**:
  - **Fields**:
    - `Title` (Input, required)
    - `Description` (Textarea)
    - `Status` (Dropdown: Todo, In Progress, Done)
    - `Priority` (Dropdown: Low, Medium, High)
    - `Due Date` (Date Picker)
    - `Assignee` (Select from user list, optional)

## 🔌 API Integration Constraints
*Note: Refer to backend `api_reference.md` for exact payload schemas.*

- **Optimistic Updates**: When dragging a card from `TODO` to `DONE`:
  1. Immediately update the React State / Cache to move the card visually.
  2. Fire `PUT /api/v1/tasks/:id` with `{ status: 'done' }`.
  3. If the request fails, show a toast error and revert the card to the `TODO` column instantly.
- **Real-Time Hook**: The component must initialize a listener (e.g., `socket.on('task_updated', (payload) => { ... })`) upon mount to listen for changes pushed from Redis Pub/Sub, and intelligently merge them into the local query cache. Ensure the listener is properly unsubscribed when the component unmounts.
