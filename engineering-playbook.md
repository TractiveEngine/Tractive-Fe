# Engineering Playbook
## Next.js + Redux Frontend System

> This document defines **non-negotiable engineering rules** for this project.
> Any human or AI (including Antigravity) must follow this playbook before making changes.

---

## 1. Project Philosophy

This project prioritizes:
- Predictability over cleverness
- Stability over premature optimization
- Clear ownership of state
- Minimal architectural churn

**Rule:**  
If a change introduces uncertainty, it must be rejected or explicitly approved.

---

## 2. Core Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Data Fetching:** Axios (centralized)
- **Styling:** Tailwind / SCSS (project-specific)
- **Auth Strategy:** Client-side, layout-based control
- **AI Tooling:** Antigravity (must respect this file)

---

## 3. Rendering Model (CRITICAL)

### 3.1 Server vs Client Components
- Server Components are default
- `"use client"` only when needed:
  - Hooks
  - Redux
  - Browser APIs
- No browser logic in Server Components

### 3.2 Hydration Safety Rules
**Never do the following in Server Components:**
- `Date.now()`
- `Math.random()`
- `typeof window !== "undefined"`
- Locale-dependent date formatting
- External data without a snapshot

**HTML rules:**
- `<html>` and `<body>` only exist in `RootLayout`
- Fonts must be loaded consistently (no client-only font logic)

---

## 4. Authentication & Authorization

### 4.1 Auth Source of Truth
- Redux is the **only** source of truth
- No auth logic from `localStorage`
- No cookie parsing inside components

### 4.2 Routing Strategy
- Role-based access handled in **layout components**
- Redirects use `useRouter().replace()`
- ❌ No Next.js middleware for auth (explicit decision)

> Note: Layout already acts as the access gate.

---

## 5. Redux Rules

- Redux stores:
  - Auth state
  - User roles
  - Session status
- No duplicated auth state anywhere else
- Async logic handled via:
  - Thunks or RTK Query
- Reducers must be pure
- No side effects inside reducers

---

## 6. API & Axios Architecture

### 6.1 Axios Rules
- One centralized Axios instance
- Base URL from environment variables
- Auth headers injected via interceptors
- No raw Axios calls in components

### 6.2 Timeout Policy
- ❌ No global Axios timeout
- Timeouts only where **explicitly justified**
- Auth, CRUD, and fetch calls **must not timeout**

### 6.3 Error Handling
- All API errors must be:
  - Parsed
  - Categorized
  - Displayed professionally
- User-friendly messages
- Developer-friendly logs

---

## 7. Performance & Latency

- Avoid unnecessary re-renders
- Memoize expensive components
- Use loading states properly
- No blocking logic in layouts
- Avoid redundant API calls

**Rule:**  
Performance fixes must not introduce architectural changes.

---

## 8. Cleanup & Refactor Policy

### 8.1 Allowed Removals
- Legacy logic that has been **fully replaced**
- Duplicate API logic
- Old localStorage auth logic
- Deprecated Axios instances

### 8.2 Forbidden Removals
- Active Redux slices
- Layout-based auth logic
- Current API abstraction
- Role routing logic

**Golden Rule:**  
Remove duplicates, not features.

---

## 9. Common Failure Scenarios

### 9.1 Hydration Errors
Check:
- Fonts
- Random values
- Client-only conditions
- HTML/body duplication

### 9.2 Invalid URL Errors
- Validate env variables
- Guard `new URL()`
- Ensure base URLs exist

### 9.3 405 / API Errors
- Confirm HTTP method matches backend
- Verify route exists
- Ensure body expectations match backend

---

## 10. AI Usage Rules (Antigravity Included)

Any AI working on this project must:
1. Read this document first
2. Preserve existing architecture
3. Make minimal changes
4. Avoid refactoring unless asked
5. Never introduce new patterns silently

**AI must NOT:**
- Reintroduce localStorage auth
- Add middleware for auth
- Change routing strategy
- Add timeouts globally

---

## 11. Change Workflow

Before making changes:
1. Identify the scope
2. Verify no existing logic already handles it
3. Implement the smallest fix
4. Validate against this playbook
5. Test hydration, auth, and routing

---

## 12. Final Principle

> Stability is a feature.

If something works and is aligned with this playbook, **do not touch it**.

---

**Last Updated:** _(maintained manually)_  
**Owner:** Frontend Engineering
