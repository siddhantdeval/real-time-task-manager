---
description: Update frontend learning documentation and technical docs based on recent changes. Strict scope: Frontend only.
---

1. **Analyze Frontend Changes**:
   - Review conversation history and file changes **strictly within the `frontend/` directory**.
   - Ignore backend or root-level configuration changes unless they directly impact the frontend.
   - Identify key frontend architectural decisions, new patterns (e.g., in `frontend/src/components`, `frontend/src/app`, `frontend/src/lib`), or configuration changes (e.g., `next.config.ts`, `tailwind.config.ts`).

2. **Update Frontend Learning Documentation**:
   - Target Directory: `learning/` at the repo root (e.g., `nextjs_learning.md`, `react_learning.md`).
   - Action:
     - Check if a relevant markdown file exists in `learning/`.
     - Append new learnings using the following strict format:
       - **Topic/Concept**
       - **Context** (Frontend-specific reasoning — why this decision was made in this project)
       - **Implementation** (Reference `frontend/src/...` files)
       - **Gotchas** (Frontend-specific edge cases, e.g., SSR vs. client hydration quirks, cookie forwarding in Server Components)

3. **Update Frontend Technical Documentation**:
   - Target Directory: `frontend/docs/`.
   - Action:
     - Update `frontend/docs/frontend_overview.md` if the folder structure, tech stack, or key architectural decisions changed.
     - Update `frontend/docs/ui_standards.md` if design tokens, theming, component conventions, or Tailwind usage changed.
     - Update `frontend/docs/auth_screens.md` if `frontend/src/app/(auth)/` routes, Server Actions, or session-handling logic changed.
     - Update `frontend/docs/projects_screen.md` if `frontend/src/app/(dashboard)/projects/` pages, components, or Server Actions changed.
     - Update `frontend/docs/tasks_screen.md` if `frontend/src/app/(dashboard)/projects/[id]/tasks/` pages or the Kanban board changed.
     - Create a new doc in `frontend/docs/` if an entirely new screen or major feature area was introduced.

4. **Ask to Verify Frontend correctness (Optional Command)**:
   - If unsure about a change, verify by running a type-check in the frontend directory:
   - // turbo
     ```bash
     cd frontend && npx tsc --noEmit
     ```

5. **Ask to Commit Changes**:
   - Commit message must be prefixed with `docs(frontend):`.
