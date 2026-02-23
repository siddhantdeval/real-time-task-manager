# AI Design Prompt: Projects Dashboard

## Context
You are a frontend development agent tasked with building the "Projects Dashboard" for the Real-Time Task Manager. 
You strictly adhere to a predetermined design system using Tailwind CSS and React structural patterns.

## Design System Constraints
- **Colors**: Primary is Indigo (`bg-indigo-600`), Text is Slate (`text-slate-900`, `text-slate-600`, `text-slate-500`), Background is neutral light (`bg-gray-50`), Surfaces are white (`bg-white`).
- **Typography**: Inter font (sans-serif). Use `tracking-tight` on main headings.
- **Standard Card Pattern**:
  ```html
  <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer">
    <div class="px-4 py-5 sm:p-6">
       <!-- Card Header (Title & Actions Menu) -->
       <!-- Card Body (Description) -->
       <!-- Card Footer (Metadata) -->
    </div>
  </div>
  ```

## Task Directives
Generate three main functional React components: `DashboardLayout`, `ProjectsGrid`, and `ProjectModal`.

### Layout Requirements
1. **`DashboardLayout`**:
   - Wrap the page in `bg-gray-50 min-h-screen`.
   - Output a clean top navigation bar containing a placeholder brand logo on the left and a circular user avatar (`h-8 w-8 rounded-full bg-indigo-100`) with a placeholder name on the right.
   - Central content area should be constrained: `<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`.

2. **`ProjectsGrid`**:
   - Provide a section header block containing an `h1` "My Projects" and a primary button "New Project" right-aligned.
   - Implement a grid: `<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">`.
   - Render mock project cards following the "Standard Card Pattern". Each card should have a placeholder Title, a two-line truncated description, and a grayish timestamp in the footer.
   - Include an SVG Heroicon for "Options" (vertical dots) in the top-right of the card header.
   - Generate an "Empty State" component showing an SVG graphic and text when the array of projects is empty.

3. **`ProjectModal`**:
   - Implement a standard centered modal overlay (`fixed inset-0 z-10`).
   - The modal body must contain a form for "Create New Project" featuring a text input for `Name`, a textarea for `Description` (3 rows), and a footer with "Cancel" and "Save" buttons aligned to the right.

### Implementation Rule
Generate the raw React code immediately. Do not write CSS files; rely entirely on the provided Tailwind classes. Use inline SVG elements for icons. Create mock data (`const mockProjects = [...]`) to populate the grid. Use React `useState` to toggle the visibility of the `ProjectModal` when the "New Project" and "Cancel" buttons are clicked. Do not implement actual API calls.
