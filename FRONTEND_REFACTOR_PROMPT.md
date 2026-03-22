# Frontend Architecture Refactor – Role-Based Next.js Application

## GOAL

Refactor an existing **Next.js frontend project** by changing the **implementation approach only**, not the business logic, user flow, or UI design.

The objective is to replace:
- React Context
- Local Storage–based session handling
- Ad-hoc authentication logic

with a **scalable, production-ready architecture** using:
- **NextAuth** for authentication (role-based)
- **Redux Toolkit** for global state management
- **Zustand** only where it is clearly the better option
- **TanStack React Query** for API communication

All existing behaviours, flows, routes, and UI designs must remain intact.

---

## ROLE & MISSION

You are a **Senior Frontend Engineer** with strong expertise in:

- Next.js (App Router & Pages Router)
- Role-based authentication systems
- NextAuth (Credentials provider, JWT strategy)
- Redux Toolkit (advanced usage)
- Zustand (selective, justified usage)
- TanStack React Query
- Large-scale frontend architecture

Your mission is to:
- Review the existing codebase
- Preserve all business logic and UX flows
- Re-implement authentication, session handling, and state management using best practices
- Improve structure, scalability, and maintainability

---

## CRITICAL RULES (MUST NOT BE VIOLATED)

- ❌ **DO NOT change the UI design**
- ❌ **DO NOT modify layouts, styling, spacing, colours, or components**
- ❌ **DO NOT change user journeys or screen behaviour**
- ❌ **DO NOT alter backend APIs**
- ❌ **DO NOT store auth/session data in Local Storage**
- ❌ **DO NOT invent new endpoints or responses**

This task is a **technical refactor only**, not a redesign.

---

## PROJECT CONTEXT (EXISTING SYSTEM)

- Frontend-only refactor
- Backend APIs already exist and are correct
- Current implementation uses:
  - React Context
  - Local Storage for session/profile
  - Zod for validation
- Application structure and flow are already good and must be respected

---

## APPLICATION DOMAIN

An **agricultural role-based platform** with the following roles:

### Roles

- **Admin**
  - Full system oversight
  - Manages users, products, listings, and activity
- **Agent**
  - Creates products
  - Registers farmers
- **Buyer**
  - Registers and buys products
- **Transporter**
  - Registers as a logistics provider

Each role has:
- Its own dashboard
- Its own protected routes

---

## AUTHENTICATION & ONBOARDING FLOW (MUST REMAIN EXACTLY THE SAME)

### 1. Sign-Up
- User enters name, email, password
- Verification code is sent
- User verifies account

### 2. Login
- User logs in with verified credentials

### 3. Role Check
- If the user has **no active role**:
  - Redirect to **Role Selection (Register) page**
  - User selects one role:
    - Buyer
    - Agent
    - Transporter
  - Role is assigned via `addAccount` API

### 4. Post-Role Redirect
- Buyer → Buyer dashboard
- Agent → Agent dashboard
- Transporter → Transporter dashboard
- Admin → Admin dashboard

⚠️ These flows must not be altered—only the internal implementation should change.

---

## TECHNICAL REQUIREMENTS

### Authentication
- Use **NextAuth** as the primary authentication system
- Implement role-aware sessions
- Use **JWT strategy**
- No Local Storage–based auth handling

### State Management
- Use **Redux Toolkit** for:
  - User profile
  - Auth-related global state
- Sync authenticated user data from **NextAuth session → Redux**
- Use **Zustand only when justified**, e.g.:
  - Temporary UI state
  - Non-global, non-persistent state

### API Communication
- Use **TanStack React Query**
- All API calls must go through React Query hooks
- No direct `fetch` or `axios` calls inside components

### Routing & Guards
- Role-based route protection
- Clean redirects based on:
  - Authentication status
  - Assigned role

### Architecture
- Clear, scalable folder structure
- Strong separation of concerns
- Production-ready patterns

---

## CONSTRAINTS & NON-GOALS

- No backend changes
- No UI changes
- No business logic changes
- No new authentication providers
- No fabricated data or assumptions
- No optimisation for speed over correctness

---

## ASSUMPTIONS

- Backend APIs for:
  - Login
  - Registration
  - Verification
  - Role assignment (`addAccount`)
  already exist and are stable
- Role information is returned by the backend
- Project uses **TypeScript**
- UI and routing are already implemented

If any assumption is invalid, it must be **explicitly flagged**, not guessed.

---

## EXPECTED OUTPUT FROM THE AI

The AI must produce:

- A **recommended architecture**, explaining:
  - Why NextAuth is used
  - How Redux Toolkit is structured
  - Where Zustand fits (if at all)
- A **step-by-step refactor plan**
- Folder and file structure suggestions
- Key implementation snippets:
  - NextAuth configuration
  - Role-based guards
  - Session → Redux sync
- Best practices for scaling and maintenance

All outputs must be:
- Clear
- Structured
- Production-grade
- Free from invented details
