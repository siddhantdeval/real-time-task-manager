# UI Standards & Design System

> *Last updatedAt: 2026-02-23*

This document defines the strict rules and design tokens that all frontend code and AI code-generation agents MUST adhere to when building the Real-Time Task Manager UI. Consistency across screens is paramount.

## 🎨 Design Tokens (Tailwind CSS)

### Color Palette
- **Primary Brand**: Indigo (`bg-indigo-600`, `text-indigo-600`, `ring-indigo-500`)
- **Secondary**: Slate/Gray (`text-slate-900`, `bg-slate-50`)
- **Success**: Emerald (`bg-emerald-100`, `text-emerald-700`)
- **Warning**: Amber/Yellow (`bg-amber-100`, `text-amber-700`)
- **Error/Destructive**: Rose/Red (`bg-rose-500`, `text-rose-600`)
- **Background**: Neutral Light (`bg-gray-50`)
- **Surface**: Pure White (`bg-white`) with subtle borders (`border-gray-200`)

### Typography
- **Font Family**: Inter (sans-serif)
- **Headings**: `font-bold text-slate-900 tracking-tight`
- **Body Text**: `text-slate-600`
- **Micro Text (Timestamps, labels)**: `text-xs text-slate-400 font-medium`

### Spacing & Layout
- **Page Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Standard Gap**: `gap-4` or `gap-6` for distinct sections.
- **Card Padding**: `p-6` for main content areas, `p-4` for denser grids.
- **Radius**: Medium-to-Large rounding on interactive elements (`rounded-lg`, `rounded-xl` for cards).
- **Shadows**: Subtle shadows for depth (`shadow-sm` for cards, `shadow-md` for modals and dropdowns).

## 🧩 Component Standardization

### Forms & Inputs
- All inputs must have a visible `<label>` (`text-sm font-medium text-slate-700`).
- Inputs should have a consistent border and focus ring (`border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500`).
- Error states must turn the border red (`border-rose-500`) and display a small, red validation message immediately below the field.

### Buttons
- **Primary Action**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md px-4 py-2 transition-colors`
- **Secondary Action**: `bg-white hover:bg-gray-50 text-slate-700 border border-gray-300 font-medium rounded-md px-4 py-2`
- **Destructive Action**: `bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-md px-4 py-2`
- **Disabled State**: `opacity-50 cursor-not-allowed`

### Loaders & Skeletons
- Avoid full-page blocking spinners unless absolutely necessary.
- Use Skeleton loaders (`animate-pulse bg-gray-200 rounded`) for fetching initial data.
- Use inline button spinners when mutating data (e.g., submitting a form).

## ⚠️ Error Handling Patterns
- **Global Errors**: Toast notifications (top-right) for server failures (e.g., "500 Internal Server Error", "Network Disconnected").
- **Form Errors**: Inline below the respective input field. Extracted directly from backend Joi Validation `400 Bad Request` messages.
- **Unauthorized (401)**: Immediately redirect the user to `/auth/login`.

## 🤖 Instructions for AI Design Agents
When writing code for this project, you MUST:
1. Exclusively use these Tailwind classes to build components. Do not introduce custom CSS files unless absolute necessary for complex animations.
2. Rely on standard HTML5 semantics (`<nav>`, `<main>`, `<article>`, `<header>`).
3. Build for accessibility (a11y) first: include `aria-labels` on icon buttons and ensure focus states are visible.
