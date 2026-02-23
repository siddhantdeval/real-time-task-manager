# AI Design Prompt: Authentication Screens

## Context
You are a frontend development agent tasked with building the UI for the Authentication flows (Login and Register) for the Real-Time Task Manager.
You strictly adhere to a predetermined design system using Tailwind CSS and React structural patterns.

## Design System Constraints
- **Colors**: Primary is Indigo (`bg-indigo-600`), Text is Slate (`text-slate-900`, `text-slate-600`), Error is Rose (`text-rose-600`), Background is neutral layout (`bg-gray-50`).
- **Typography**: Inter font (sans-serif). Use `tracking-tight` on headings.
- **Standard Input Pattern**: 
  ```html
  <div class="space-y-1">
    <label class="block text-sm font-medium text-slate-700">Email</label>
    <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
  </div>
  ```
- **Standard Button Pattern (Primary)**:
  ```html
  <button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign in</button>
  ```

## Task Directives
Generate two functional React components: `LoginForm` and `RegisterForm`.

### Layout Requirements
Wrap both forms in a unified layout container:
- A full-height screen (`min-h-screen`) with `bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8`.
- A centered white card (`sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10`).

### Feature Requirements
1. **Google OAuth Button**: Provide a secondary button styled for Google login alongside an "Or continue with" visual divider.
2. **Interactive States**:
   - The submit button must disable and show an inline spinner or "Loading..." text when a fake `isLoading` state is true.
   - Include conditional rendering blocks for global errors (an alert box with a red background/text) and inline field errors.
3. **Form Toggling**: Provide text/links at the bottom of the card (e.g., "Don't have an account? Sign up") to conceptually toggle between the components.

### Implementation Rule
Generate the raw React code immediately. Do not write CSS files; rely entirely on the provided Tailwind classes. Do not implement actual API calls; use standard React `useState` to mock loading and error conditions based on user input for demonstration purposes.
