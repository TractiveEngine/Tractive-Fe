## Task: Remove Redundant Authentication & API Logic After Refactor

### Context Reference (MANDATORY)
This project has already been refactored to use:
- Next.js (App Router)
- Session-based authentication (NextAuth)
- Redux Toolkit for client state
- TanStack React Query for API calls
- Layout-level authentication guards

Previously, the project used:
- localStorage-based auth
- manual cookie handling
- direct Axios calls for auth/session
- duplicated auth guards across pages

Some of these **old implementations still exist** in the codebase and are now **redundant**.

---

### Objective
Carefully **remove only the obsolete logic** that was replaced during the refactor, without breaking any current functionality.

This is a **cleanup task**, not a feature rewrite.

---

### What You MUST Remove (If Redundant)

#### 1. localStorage-Based Auth
Remove ONLY where it duplicates NextAuth or Redux state:
- `localStorage.getItem('token')`
- `localStorage.setItem('user')`
- `localStorage.setItem('role')`
- Manual token persistence for auth/session
- Auth checks that depend on localStorage values

❗ Do NOT remove localStorage usage that is:
- Non-auth related
- UI preference related
- Still actively used and not replaced

---

#### 2. Old Axios Auth Calls
Remove or refactor:
- Direct login/register API calls that bypass NextAuth
- Manual token injection into headers for auth
- Axios interceptors created ONLY for auth tokens

If Axios is still used:
- Keep shared Axios instances
- Remove auth-specific logic handled by NextAuth/session

---

#### 3. Duplicate Auth Guards
Remove:
- Page-level auth checks duplicated across pages
- Route guards checking tokens manually
- Conditional redirects based on localStorage auth

Auth should rely on:
- Session from NextAuth
- Layout-level protection
- `session.activeRole` for routing

---

### What You MUST KEEP

DO NOT remove:
- NextAuth configuration
- Session usage (`useSession`)
- Redux slices still actively used
- React Query hooks
- Layout-level auth logic
- Any logic still referenced by active components

If unsure:
👉 **Leave the code and add a comment instead of deleting it**

---

### How to Do This Safely

1. Identify duplicated logic
2. Trace where it is currently used
3. Confirm it has a modern replacement
4. Remove it incrementally
5. Ensure:
   - Login still works
   - Role switching still works
   - Page access still works
   - No console or network errors

---

### Error Handling & Performance
- Ensure no broken imports after cleanup
- Remove unused utilities and helpers
- Keep API calls optimized
- Maintain professional error messaging

---

### Deliverables
- Cleaner auth & API layer
- No localStorage-based auth remnants
- No duplicated auth logic
- A short summary explaining:
  - What was removed
  - Why it was safe to remove
  - What was intentionally kept

---

### DO NOT
- Do NOT introduce new auth patterns
- Do NOT rewrite working features
- Do NOT remove logic without verifying usage
- Do NOT change UI or API contracts
