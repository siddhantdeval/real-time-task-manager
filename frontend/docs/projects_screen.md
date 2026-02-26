# Projects Screen

> *Last updated: 2026-02-27*

This document defines the frontend representation of the main user dashboard, where users view, create, archive, and inspect their projects.

## 🗺️ Route Overview

| Route | Type | Purpose |
|-------|------|---------|
| `/projects` | RSC (Server Component) | Lists the user's non-archived projects |
| `/projects/new` | Page | Create a new project |
| `/projects/[id]/edit` | Page | Edit an existing project |

---

## 🏗️ Architecture

The Projects screen follows a **RSC → Client Component** handoff pattern:

```
app/(dashboard)/projects/page.tsx  ← RSC
│   serverFetch('/projects/me')     ← reads session cookie server-side
│   passes initialProjects[]
└── <ProjectGridClient />           ← Client Component
        manages modal state + actions
        renders <ProjectCard /> grid
        opens <ProjectDetailsModal /> on click
```

- **Data Fetching**: `page.tsx` is a React Server Component. It calls `serverFetch('/projects/me')` — which automatically forwards the session cookie — and passes the result as `initialProjects` prop.
- **Next.js Caching**: The fetch uses `{ next: { tags: ['projects'] } }`, enabling `revalidateTag('projects')` after mutations.
- **Mutations**: All writes (`createProject`, `archiveProject`) are Server Actions in `app/actions/project.actions.ts`.

---

## 🎨 Components

### `ProjectGridClient` (`components/modules/projects/ProjectGridClient.tsx`)
- **Type**: Client Component (`'use client'`)
- **Responsibilities**:
  - Renders a responsive grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`.
  - Always shows a `<NewProjectCard />` as the first cell.
  - Manages `selectedProjectId` state — when set, opens `<ProjectDetailsModal />`.
  - Handles `onArchive`: calls `archiveProjectAction`, then `router.refresh()`.
  - Handles `onEdit`: navigates to `/projects/${id}/edit`.
  - Handles `onCreate`: navigates to `/projects/new`.

### `ProjectCard` (`components/modules/projects/ProjectCard.tsx`)
- Displays: project name, description, label colour chip, member count, task count, status badge, relative timestamp.
- Has a `⋯` dropdown with **Edit** and **Archive** actions.
- Clicking the card body fires `onClick` → opens the `ProjectDetailsModal`.

### `NewProjectCard`
- A dashed-border card with a `+` icon.
- Clicking it navigates to `/projects/new`.

### `ProjectDetailsModal` (`components/modules/projects/ProjectDetailsModal.tsx`)
- Opens as a slide-over/dialog when a project card is clicked.
- **Tabs / Sections inside the modal**:
  - **Members** (`ProjectMembersList`): Lists current members, invite by email (role: LEAD/MEMBER/VIEWER), remove member.
  - **Activity** (`RecentActivityFeed`): Shows the last N activity entries from `GET /projects/:id/activity`.
  - **Progress** (`ProjectProgressBar`): Visual progress bar from `GET /projects/:id/progress`.
  - **Danger Zone** (`ProjectDangerZone`): Archive button (with confirmation).

### `ProjectForm` (`components/modules/projects/ProjectForm.tsx`)
- Used by both `/projects/new` and `/projects/[id]/edit`.
- Uses `useActionState` with `createProjectAction` / `updateProjectAction`.
- **Fields**: Name (required), Description (optional), Label Colour (via `ProjectColorPicker`).

### `ProjectColorPicker` (`components/modules/projects/ProjectColorPicker.tsx`)
- A palette of preset colours rendered as clickable swatches.
- Sets the `labelColor` field on the project form.

---

## 🔌 API Integration

| Action | Endpoint | Server Action | Cache Invalidation |
|--------|----------|---------------|--------------------|
| List projects | `GET /projects/me` | (RSC, no action) | `revalidateTag('projects')` |
| Create project | `POST /projects` | `createProjectAction` | `revalidatePath('/projects')` + `revalidateTag('projects')` |
| Archive project | `PATCH /projects/:id/archive` | `archiveProjectAction` | `revalidatePath('/projects')` + `revalidateTag('projects')` |
| View details | `GET /projects/:id` | (client fetch in modal) | — |
| View members | `GET /projects/:id/members` | (client fetch in modal) | — |
| View activity | `GET /projects/:id/activity` | (client fetch in modal) | — |
| View progress | `GET /projects/:id/progress` | (client fetch in modal) | — |

> **Security**: `owner_id` is **never** sent in `createProjectAction` payload — the backend derives it from the session (`req.user.id`).

---

## ⚠️ Known Patterns & Gotchas

- **No React Query**: Data is fetched via RSC + `serverFetch`. After a mutation, `router.refresh()` or `revalidatePath` triggers a full RSC re-render to update the grid — no client-side cache invalidation is needed.
- **Archive vs Delete**: The UI exposes **Archive** (soft delete, sets `status: ARCHIVED`). Only users with `OWNER` or `LEAD` role can archive. Hard delete is not surfaced in the UI.
- **Modal fetch**: `ProjectDetailsModal` fetches project details client-side using `clientFetch` (since it's a Client Component), which uses `credentials: 'include'` to send the session cookie from the browser.
