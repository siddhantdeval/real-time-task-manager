# Frontend Overview

> *Last updated: 2026-02-27*

## 📖 Introduction
The Frontend for the Real-Time Task Manager is a **Next.js 15 App Router** application. It is built as a Server-Component-first architecture where data fetching happens on the server and only interactive pieces are shipped as Client Components.

## 🛠 Tech Stack (Confirmed)
| Concern | Technology |
|---------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Fonts | Geist Sans + Geist Mono (via `next/font/google`) |
| Forms & Mutations | Native `<form action={...}>` + React 19 `useActionState` + Next.js Server Actions |
| Validation | [Zod](https://zod.dev/) (client & server) |
| API: Server | `serverFetch` — `src/lib/server-api.ts` (forwards `HttpOnly` session cookie) |
| API: Client | `clientFetch` — `src/lib/client-api.ts` (`credentials: 'include'`) |
| Theming | Custom `ThemeProvider` context + `localStorage` persistence (no third-party libs) |
| UI Primitives | [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/) |

> **Not used**: Zustand, React Query / SWR, Axios — intentionally excluded in favour of RSC + Server Actions.

## 📂 Actual Project Structure
```text
frontend/
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: ThemeProvider + dark mode script injection
│   │   ├── page.tsx            # Root redirect → /projects
│   │   ├── globals.css         # Global Tailwind + CSS variable tokens
│   │   ├── (auth)/             # Auth route group (no Header)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/        # Dashboard route group (Header included via layout)
│   │   │   ├── layout.tsx      # Wraps all dashboard pages with <Header />
│   │   │   └── projects/
│   │   │       ├── page.tsx    # RSC: fetches GET /projects/me → <ProjectGridClient />
│   │   │       ├── new/        # Project creation page
│   │   │       └── [id]/edit/  # Project edit page
│   │   ├── actions/
│   │   │   ├── auth.actions.ts     # loginAction, signupAction, logoutAction, forgot/reset
│   │   │   └── project.actions.ts  # createProjectAction, archiveProjectAction
│   │   └── settings/
│   │       └── profile/        # User profile settings page
│   ├── components/
│   │   ├── auth/               # Auth form components
│   │   ├── common/             # Shared primitives
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Top navigation bar with ThemeToggle + user menu
│   │   │   └── AuthSplitLayout.tsx  # Split-panel layout for auth pages
│   │   ├── modules/
│   │   │   └── projects/
│   │   │       ├── ProjectCard.tsx         # Individual project card
│   │   │       ├── NewProjectCard.tsx      # "Create project" placeholder card
│   │   │       ├── ProjectGridClient.tsx   # Client grid wrapper (handles modals + actions)
│   │   │       ├── ProjectDetailsModal.tsx # Slide-over modal: members, activity, progress
│   │   │       ├── ProjectForm.tsx         # Create/Edit form (useActionState)
│   │   │       ├── ProjectColorPicker.tsx  # Label colour selector
│   │   │       ├── ProjectDangerZone.tsx   # Archive confirmation UI
│   │   │       ├── ProjectMembersList.tsx  # Member invite + role management
│   │   │       ├── ProjectProgressBar.tsx  # Progress bar component
│   │   │       └── RecentActivityFeed.tsx  # Activity log feed
│   │   ├── providers/
│   │   │   └── ThemeProvider.tsx   # Context: theme + toggleTheme
│   │   ├── theme/
│   │   │   └── ThemeToggle.tsx     # Sun/Moon icon toggle (hydration-safe)
│   │   ├── settings/           # Profile settings components
│   │   └── ui/                 # Low-level UI primitives (buttons, inputs, etc.)
│   ├── lib/
│   │   ├── server-api.ts       # serverFetch — Server Components / Actions only
│   │   ├── client-api.ts       # clientFetch — Client Components only
│   │   └── utils.ts            # Helpers: getSessionCookieName, cn(), etc.
│   └── types/                  # Shared TypeScript types (Project, User, Task, etc.)
└── docs/                       # This documentation
```

## 🚀 Key Architectural Decisions

1. **Server Components First**: Data fetching is done in RSCs using `serverFetch`, which reads the `HttpOnly` session cookie via `next/headers`. No data is fetched client-side unless interactivity requires it.
2. **Server Actions for Mutations**: `createProjectAction` and `archiveProjectAction` run on the server. After mutation, they call `revalidatePath` / `revalidateTag` to invalidate the Next.js cache and trigger a fresh RSC render.
3. **No Global State for Auth**: Auth state is not managed in client-side state. The session cookie is the source of truth, read server-side via `cookies()` from `next/headers`.
4. **Zod Validation in Server Actions**: All form data is validated with Zod schemas inside Server Actions before any API call is made, yielding typed `fieldErrors` returned via `useActionState`.
5. **Theme via Custom Context**: A `ThemeProvider` + `useTheme` hook manages dark/light mode in `localStorage`. A blocking inline script in `layout.tsx` prevents flash of un-themed content (FOUC).
6. **Cookie Forwarding**: `serverFetch` manually reads the `sessionId` cookie from `cookieStore` and re-attaches it to the outgoing `fetch` header — necessary because Next.js server-side `fetch` does not automatically forward cookies.
7. **Hydration-Safe ThemeToggle**: The `ThemeToggle` renders a placeholder `<button>` during SSR to avoid a client/server mismatch, then swaps to the real icon after `useEffect` mount.

## 🔗 Related Documentation
- [UI Standards & Design System](ui_standards.md)
- [Authentication Screens](auth_screens.md)
- [Projects Screen](projects_screen.md)
- [Task Management Screen](tasks_screen.md)
