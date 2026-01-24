## Task: Review and Remove Unnecessary API Timeouts

### Context Reference (IMPORTANT)
This project uses:
- Session-based authentication (NextAuth)
- TanStack React Query for data fetching
- Layout-level auth handling
- Professional error and latency handling

This task is a continuation of previous work.  
Do NOT change UI design or API contracts.

---

### Problem Statement
There are **manual timeout implementations** added across multiple API calls.
These timeouts are causing:
- Premature request failures
- Poor UX on slow networks
- Unnecessary complexity

This approach is NOT aligned with frontend best practices.

---

### What You Must Do

#### 1. Remove Timeouts Where Not Needed
- Remove `setTimeout`, custom timeout wrappers, or forced aborts from:
  - Standard GET requests
  - CRUD mutations (POST, PUT, PATCH, DELETE)
  - Farmer, Product, Profile, and Auth-related calls
- Especially remove timeouts that are:
  - Arbitrary (e.g. 5s, 10s)
  - Applied globally
  - Blocking user actions

#### 2. Keep or Refactor Only Where Justified
Timeouts are ONLY acceptable if:
- It is an auth refresh or logout request
- It prevents a hanging session
- It is well-documented and intentional

If used:
- Explain clearly WHY
- Use AbortController instead of timers
- Do NOT fail silently

---

### Preferred Replacement Strategy

Use **best-practice alternatives instead of timeouts**:

- React Query:
  - `isLoading`, `isFetching`
  - `retry` with limits
  - `staleTime` and `cacheTime`
- UX:
  - Loading indicators
  - Disabled buttons during mutations
  - Informational messages for slow responses
- Cleanup:
  - Abort requests on component unmount
  - Avoid cancelling valid in-flight requests

---

### Error Handling Rules
- Errors must be:
  - Clear
  - User-friendly
  - Non-technical
- Differentiate between:
  - Network error
  - Server error
  - Authorization error
  - Slow response (not an error)

---

### DO NOT
- Do NOT reintroduce localStorage auth
- Do NOT add new APIs
- Do NOT change backend expectations
- Do NOT add timeouts “just in case”

---

### Deliverables
- Cleaned API layer with unnecessary timeouts removed
- Consistent fetching behavior
- Improved UX on slow networks
- Short summary explaining:
  - What was removed
  - What (if anything) was kept and why
