# Task Management Screen

> *Last updated: 2026-02-27*

This document defines the intended frontend implementation of the Task Management view for a specific project. This is Phase 6 of the implementation plan and **has not yet been built** — it documents the target design based on the current backend capabilities and UI standards.

## 📌 Implementation Status

> **Status: Planned (Phase 6)**
> The tasks screen is not yet implemented. The backend endpoints for task CRUD and WebSocket events are ready. The frontend implementation below documents the target design that must be built.

---

## 🗺️ Route Overview

| Route | Type | Purpose |
|-------|------|---------|
| `/projects/[id]` | RSC | Project task board page |
| `/projects/[id]/tasks` | — | (May redirect to `/projects/[id]`) |

---

## 🏗️ Architecture (Target)

```
app/(dashboard)/projects/[id]/page.tsx  ← RSC
│   serverFetch('/projects/:id')         ← project details + progress
│   serverFetch('/tasks?project_id=:id') ← initial task list
└── <TaskBoardClient />                 ← Client Component
        manages Kanban columns + drag state
        opens <TaskModal /> for create/edit
        subscribes to WebSocket events
```

---

## 🎨 Screens & Components (Target)

### 1. Project Header Area
- A "← Back to Projects" link (`text-sm text-indigo-600 hover:text-indigo-800`).
- Project title (`text-2xl font-semibold text-slate-900 dark:text-white`) and truncated description.
- Label colour chip.
- Progress bar (`ProjectProgressBar`) showing `done / total` task percentage.
- Action bar: **List / Kanban** view toggle (left) + **New Task** button (right, primary indigo).

### 2. Kanban Board (Default View)
- **Layout**: Horizontally scrollable flex container (`flex space-x-6 overflow-x-auto pb-4`).
- **Columns**:
  1. `TODO` — tasks with `status: 'todo'`
  2. `IN_PROGRESS` — tasks with `status: 'in_progress'`
  3. `DONE` — tasks with `status: 'done'`
- **Column Header**: `font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide text-xs` + a count badge (`bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full px-2 py-0.5`).

### 3. Task Card Component
- **Base**: `bg-white dark:bg-slate-900 rounded-md shadow-sm border border-gray-200 dark:border-slate-800 p-4 mb-3 cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-indigo-300`
- **Priority Badge** (top-right):
  - `LOW`: `bg-emerald-100 text-emerald-700`
  - `MEDIUM`: `bg-amber-100 text-amber-700`
  - `HIGH`: `bg-rose-100 text-rose-700`
- **Title**: `text-base font-medium text-slate-900 dark:text-white line-clamp-2 mb-1`
- **Due Date**: `text-xs text-slate-500 dark:text-slate-400` with clock icon (if present)
- **Assignee Avatar**: Small circular avatar (`w-6 h-6 rounded-full`) bottom-right corner

### 4. Task Create/Edit Modal
- **Fields**:
  - `Title` (Input, required)
  - `Description` (Textarea)
  - `Status` (Dropdown: Todo / In Progress / Done)
  - `Priority` (Dropdown: Low / Medium / High)
  - `Due Date` (Date Picker)
  - `Assignee` (Select from project members list, optional)
- **Actions**: Cancel (secondary) + Save (primary, shows spinner while pending)

---

## 🔌 API Integration

| Action | Endpoint | Approach |
|--------|----------|----------|
| Load project header | `GET /projects/:id` | RSC via `serverFetch` |
| Load tasks | `GET /tasks?project_id=:id` | RSC via `serverFetch` |
| Create task | `POST /tasks` | Server Action (`createTaskAction`) |
| Update task / status | `PUT /tasks/:id` | Server Action (`updateTaskAction`) |
| Delete task | `DELETE /tasks/:id` | Server Action (`deleteTaskAction`) |
| Real-time updates | WebSocket events | `SocketProvider` Client Component |

---

## ⚡ Optimistic Updates

When dragging a task card across columns:
1. Immediately update local React state to move the card visually.
2. Fire Server Action or `clientFetch` with `PUT /tasks/:id { status: 'new_status' }`.
3. If the request fails, show a toast error and revert the card to its original column.

---

## 🔴 Real-Time Integration (Target)

A `<SocketProvider>` Client Component must:
1. Connect to the backend Socket.IO server on mount (using the project ID as the room).
2. Listen for events:
   - `TASK_CREATED` → append task to the appropriate column
   - `TASK_UPDATED` → update the task in-place
   - `TASK_DELETED` → remove the task card
   - `TASK_MOVED` → move the card to the new column
3. On unmount, unsubscribe from all listeners and disconnect.

```typescript
// Target pattern
useEffect(() => {
  const socket = io(API_URL, { withCredentials: true });
  socket.emit('join_project', projectId);

  socket.on('TASK_UPDATED', (payload) => {
    // merge into local task state
  });

  return () => {
    socket.off('TASK_UPDATED');
    socket.disconnect();
  };
}, [projectId]);
```

---

## 🔗 Related
- Backend WebSocket events: configured to emit on task REST mutations
- Progress bar component: reusable `ProjectProgressBar` already exists in `components/modules/projects/`
