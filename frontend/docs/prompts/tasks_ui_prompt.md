# AI Design Prompt: Task Kanban Board

## Context
You are a frontend development agent tasked with building the "Task Management Kanban Board" for the Real-Time Task Manager. 
You strictly adhere to a predetermined design system using Tailwind CSS and React structural patterns.

## Design System Constraints
- **Colors**: Primary is Indigo (`bg-indigo-600`), Text is Slate (`text-slate-900`, `text-slate-600`), Background is neutral light (`bg-gray-50`/`bg-gray-100`), Surfaces are white (`bg-white`).
- **Typography**: Inter font (sans-serif). Use `tracking-tight` on main headings.
- **Priority Badge System Pattern**:
  ```html
  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">High</span>
  <!-- Replace classes for Medium (amber) and Low (emerald) -->
  ```
- **Task Card Container Pattern Pattern**:
  ```html
  <div class="bg-white p-4 rounded-md shadow-sm border border-gray-200 cursor-grab hover:ring-2 hover:ring-indigo-300 transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <!-- Title & Priority -->
    </div>
    <!-- Assignment / Metadata Footer -->
  </div>
  ```

## Task Directives
Generate three main functional React components: `ProjectViewLayout`, `KanbanBoard`, and `TaskModal`.

### Layout Requirements
1. **`ProjectViewLayout`**:
   - Wrap the page in `bg-gray-50 h-screen flex flex-col`.
   - Incorporate a clean top navigation bar containing a placeholder brand logo and a circular user avatar (`h-8 w-8 rounded-full`).
   - Include a secondary header below the navbar: `<header class="bg-white shadow-sm pt-6 pb-4 px-4 sm:px-6 lg:px-8">`. This should hold a fake "Project Title" `h1`, a subtle "Back to Projects" text link above the `h1`, and a "New Task" primary indigo button right-aligned.
   - The main content area should take up the remaining height (`flex-1 overflow-hidden p-6`).

2. **`KanbanBoard`**:
   - Container: `<div class="h-full flex gap-6 overflow-x-auto items-start">`.
   - Render three hardcoded columns (divs): "TODO", "IN PROGRESS", "DONE".
   - Each column should be a flex column with a fixed width (`w-80 flex-shrink-0 flex flex-col h-full bg-gray-100 rounded-lg p-3`).
   - Define a column header style: an uppercase `h3` (`text-sm font-semibold text-gray-700`) with a count badge next to it (`bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs`).
   - Inside each column, render a flex container for cards (`flex-1 flex flex-col gap-3 overflow-y-auto mt-3`).
   - Render mock task cards following the "Task Card Container Pattern". Each card should have a `Title`, a `Priority Badge`, and a placeholder square for an avatar at the bottom right.

3. **`TaskModal`**:
   - Implement a standard centered modal overlay (`fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center`).
   - The modal body must contain a robust form for "Create New Task" featuring:
     - `Title` (Text input)
     - `Description` (Textarea, 4 rows)
     - `Status` (Select dropdown)
     - `Priority` (Select dropdown)
   - Include a footer with "Cancel" and "Save Task" buttons aligned to the right, encased in a gray slab (`bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6`).

### Implementation Rule
Generate the raw React code immediately. Do not write CSS files; rely entirely on the provided Tailwind classes. Use inline SVG elements for icons. Create mock data (a single array of tasks with `id, title, status, priority` fields) and use React `filter()` to map them into the correct columns. Use React `useState` to toggle the visibility of the `TaskModal`. Do not implement actual API calls or complex drag-end-drop state logic; just visually construct the layout.
