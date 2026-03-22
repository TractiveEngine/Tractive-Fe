## CRITICAL TASK: Project Recovery, Recap & Corrective Refactor

### READ FIRST — DO NOT SKIP
You previously reverted some code incorrectly based on a misunderstanding.
This task is to **recap, reconcile, and correct** the project state.

DO NOT blindly revert or rewrite files.
DO NOT assume old implementations are valid.
Work **incrementally and carefully**.

---

## 1️⃣ AUTHORITATIVE PROJECT STATE (SOURCE OF TRUTH)

The project has already been intentionally refactored to use:

- Next.js (App Router)
- NextAuth (session-based authentication)
- Redux Toolkit (client state)
- TanStack React Query (server state)
- Layout-level authentication guards
- Role-based routing using `session.activeRole`

Anything outside this stack that duplicates auth or API handling is **obsolete**.

---

## 2️⃣ WHAT WAS INTENTIONALLY REMOVED (DO NOT RESTORE)

The following are **deprecated** and must NOT be reintroduced:

- localStorage-based authentication
- Manual token persistence (set/get token)
- Manual cookie auth handling
- Axios auth interceptors for tokens
- Page-level auth guards duplicating layout logic
- Auth checks based on `localStorage` or `window`

If any of these were reintroduced → **remove them again safely**.

---

## 3️⃣ WHAT MUST EXIST AND BE PRESERVED

Ensure these remain intact and working:

### Authentication
- NextAuth session handling
- Session refresh logic
- Logout API integration
- Layout-based route protection
- Role-based access via `session.activeRole`

### Data & State
- Redux Toolkit slices (still in use)
- React Query hooks and mutations
- Optimistic updates
- No excessive refetching

### Pages Already Implemented
- Agent / Farmers flow
- Products / Add To Store
- Produce List
- Bulk actions
- Out-of-stock handling (separate endpoint)

---

## 4️⃣ SPECIFIC CORRECTIONS TO APPLY NOW

### A. Undo Wrong Reverts
- Identify files that were reverted incorrectly today
- Restore them to match:
  - Session-based auth
  - Redux + React Query architecture
- Do NOT restore old localStorage or Axios auth logic

### B. Remove Redundant Legacy Code (Carefully)
- Remove ONLY duplicated logic that has a modern replacement
- If unsure, **comment instead of deleting**
- Ensure no active imports break

### C. API Handling Rules
- No arbitrary timeouts on API calls
- No repeated auth checks
- Use React Query loading & error states
- Professional error messages for all scenarios

---

## 5️⃣ EXECUTION STRATEGY (MANDATORY)

You must proceed in this exact order:

1. Audit the current codebase
2. Identify incorrect reverts
3. Restore correct implementations
4. Remove redundant legacy logic
5. Verify:
   - Login works
   - Session persists
   - Role switching works
   - Pages load correctly
6. Only then continue with new tasks

---

## 6️⃣ OUTPUT REQUIRED

At the end, provide a short summary:
- What was corrected
- What was removed
- What was intentionally kept
- Any risky areas that need manual review

---

## HARD RULES
- Do NOT change UI design
- Do NOT add new APIs
- Do NOT invent logic
- Do NOT reintroduce localStorage auth
- Do NOT guess — verify usage before changes
