# UI Standards & Design System

> *Last updated: 2026-02-27*

This document defines the strict rules and design tokens that all frontend code and AI code-generation agents MUST adhere to when building the Real-Time Task Manager UI.

## 🛠 Confirmed Implementation Details

- **Framework**: Next.js 15 App Router
- **Styling**: Tailwind CSS v4
- **Fonts**: **Geist Sans** + **Geist Mono** (loaded via `next/font/google`, CSS variables `--font-geist-sans`, `--font-geist-mono`)
- **Theming**: Dark mode via `dark:` Tailwind variant. Theme state stored in `localStorage`, toggled via `ThemeProvider` context. A blocking inline script in `root layout.tsx` applies the `dark` class before hydration to prevent FOUC.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Primitives**: [Radix UI](https://www.radix-ui.com/)

---

## 🎨 Design Tokens (Tailwind CSS)

### Color Palette
- **Primary Brand**: Indigo (`bg-indigo-600`, `text-indigo-600`, `ring-indigo-500`, `hover:bg-indigo-700`)
- **Secondary**: Slate/Gray (`text-slate-900 dark:text-white`, `text-slate-500 dark:text-slate-400`)
- **Success**: Emerald (`bg-emerald-100 text-emerald-700`)
- **Warning**: Amber (`bg-amber-100 text-amber-700`)
- **Error/Destructive**: Rose (`bg-rose-500 text-rose-600`, `border-rose-500`)
- **Background (Light)**: `bg-gray-50` / `bg-white`
- **Background (Dark)**: `bg-slate-950` / `bg-slate-900`
- **Surface (Light)**: `bg-white border-gray-200`
- **Surface (Dark)**: `bg-slate-900 border-slate-800`

### Typography
- **Font Family**: Geist Sans (`var(--font-geist-sans)`)
- **Page Headings**: `text-2xl font-semibold text-slate-900 dark:text-white tracking-tight`
- **Section Headings**: `text-lg font-semibold text-slate-900 dark:text-white`
- **Body Text**: `text-slate-600 dark:text-slate-300`
- **Muted/Meta Text**: `text-sm text-slate-500 dark:text-slate-400`
- **Micro Text (timestamps, badges)**: `text-xs text-slate-400 dark:text-slate-500 font-medium`

### Spacing & Layout
- **Dashboard Container**: `max-w-[1400px] mx-auto p-6 md:p-8`
- **Standard Gap**: `gap-4` or `gap-6` between distinct sections
- **Card Padding**: `p-6` for main content, `p-4` for denser grids
- **Radius**: `rounded-lg` for inputs/buttons, `rounded-xl` for cards
- **Shadows (Light)**: `shadow-sm` for cards, `shadow-md` for modals
- **Dark mode surfaces**: rely on border colour (`border-slate-800`) instead of shadows

---

## 🧩 Component Standardization

### Inputs & Forms
- All inputs must have a visible `<label>` (`text-sm font-medium text-slate-700 dark:text-slate-300`).
- Input base: `border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500`.
- **Error state**: `border-rose-500 focus:ring-rose-500`. Error message rendered inline below the field in `text-sm text-rose-600`.
- Forms use `useActionState` + Server Actions. Never use `onSubmit` with client-side `fetch` for mutations.

### Buttons
- **Primary**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 transition-colors`
- **Secondary / Outline**: `bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-slate-700 dark:text-white border border-gray-300 dark:border-slate-700 font-medium rounded-lg px-4 py-2`
- **Destructive**: `bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg px-4 py-2`
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Loading state**: Replace label with an inline spinner (`animate-spin`) while a Server Action is pending (`useFormStatus`).

### Cards
- **Light**: `bg-white border border-gray-200 rounded-xl shadow-sm`
- **Dark**: `bg-slate-900 border border-slate-800 rounded-xl`
- **Hover**: `hover:shadow-md transition-shadow` (light) / `hover:border-slate-700` (dark)

### Loaders & Skeletons
- No full-page blocking spinners.
- Use `animate-pulse bg-gray-200 dark:bg-slate-800 rounded` skeleton blocks.
- Use `animate-spin` inline button spinners for form mutations via `useFormStatus`.

### Theme Toggle
- Component: `ThemeToggle` (`components/theme/ThemeToggle.tsx`).
- Uses `useTheme()` from `ThemeProvider`.
- **Hydration safety**: renders a placeholder `<button>` (no icon) during SSR; swaps to Sun/Moon icon after `useEffect` mount to avoid hydration mismatch.
- Icons: `<Sun />` (amber, shown in dark mode) / `<Moon />` (slate, shown in light mode).

---

## ⚠️ Error Handling Patterns
- **Form Errors**: Inline below the respective input field. Extracted from `fieldErrors` returned by `useActionState`.
- **Server / Network Errors**: Top-level `error` string from `useActionState`, shown as a red alert box above the form.
- **401 Unauthorized**: `logoutAction` clears the cookie and redirects to `/login`.
- **Toast notifications**: Planned for global errors (network disconnected, server 500). Not yet implemented.

---

## 🌗 Dark Mode Implementation
1. A blocking `<script>` in `app/layout.tsx` runs before hydration — reads `localStorage.theme` or `prefers-color-scheme` and adds/removes the `dark` class on `<html>`.
2. `ThemeProvider` provides `{ theme, toggleTheme }` via React context.
3. `toggleTheme` updates `localStorage.theme` and flips the `dark` class on `document.documentElement`.
4. All components use `dark:` Tailwind variants — no separate CSS files for theming.

---

## 🤖 Instructions for AI Design Agents
When writing code for this project, you MUST:
1. Use `dark:` variants on every colour and background class — every light mode style needs a dark equivalent.
2. Use Geist Sans as the font family (it is loaded globally via `layout.tsx`).
3. Rely on standard HTML5 semantics (`<nav>`, `<main>`, `<article>`, `<header>`).
4. Build for accessibility: include `aria-label` on icon-only buttons, ensure visible focus states.
5. Use `useActionState` + Server Actions for all mutations. Never use client-side `fetch` directly in event handlers for CRUD operations.
6. Never manage `sessionId` or any auth token in component state or `localStorage`.
