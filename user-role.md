# Frontend Role-Based Authentication & Account Management Prompt

## PURPOSE

You are a **Frontend AI Engineer** working on an existing **Next.js role-based application**.

Your task is to **implement and refactor frontend authentication, onboarding, and role-switching logic** using the provided APIs, while strictly preserving:

- Existing UI design
- Existing layouts and components
- Existing user experience flow

This is a **logic and architecture task only**, not a redesign.

---

## ABSOLUTE RULES (NON-NEGOTIABLE)

- ❌ DO NOT change UI design, styling, spacing, colours, or layouts
- ❌ DO NOT modify existing component visuals
- ❌ DO NOT change backend APIs or payload formats
- ❌ DO NOT invent endpoints, fields, or responses
- ❌ DO NOT store auth/session data in Local Storage
- ❌ DO NOT bypass role logic or hardcode roles

If something is unclear, **pause and flag it** instead of guessing.

---

## TECH STACK EXPECTATION

Use the following tools correctly and intentionally:

- **NextAuth** → Authentication & session handling (JWT-based)
- **Redux Toolkit** → Global user/profile state
- **TanStack React Query** → All API calls
- **Zustand** → Optional, only for transient UI state (not auth)

---

## AVAILABLE AUTH & PROFILE APIs (SOURCE OF TRUTH)

### 1. Add New Account / Role
**POST** `/api/auth/add-account`

Used to create a **new role/account** for an existing or newly registered user.

```json
{
  "role": "buyer",
  "phone": "+2348011223344",
  "address": "78 Market Street, Abuja",
  "country": "Nigeria",
  "state": "Abuja"
}


2. Get User Profile

GET /api/profile

Returns the authenticated user details.

{
  "user": {
    "_id": "696f7f7ab3e9c64e9697d0b9",
    "email": "490wms5p3b@bwmyga.com",
    "roles": [],
    "activeRole": null,
    "isVerified": true,
    "name": "Agent new",
    "status": "active",
    "createdAt": "2026-01-20T13:13:30.723Z"
  }
}

3. Update Profile (Onboarding)

PATCH /api/profile

Used during onboarding and profile updates.

{
  "name": "Enrico Tester",
  "phone": "+2348011223344",
  "address": "78 Market Street, Abuja",
  "country": "Nigeria",
  "state": "Abuja",
  "interests": ["Grains", "Vegetables"]
}

4. Get Available Roles for Switching

GET /api/profile/switch-role

Returns roles the user can switch to.

{
  "activeRole": null,
  "availableRoles": []
}

5. Switch Active Role

PATCH /api/profile/switch-role

Used to switch the user’s active role.

{
  "activeRole": "buyer"
}


After switching:

Re-fetch /api/profile

Update session + Redux

Redirect based on activeRole

REQUIRED USER FLOWS (MUST BE FOLLOWED EXACTLY)
A. New User Flow

User signs up

User verifies email via code

User logs in

User is redirected to Register-As page

User selects a role (buyer / agent / transporter)

User must click Submit to confirm selection

⚠️ Role must NOT be set instantly on click

User is redirected to Onboarding page

User completes onboarding form

Profile is updated via /api/profile

User is redirected based on selected role

B. Existing User Login Flow

User logs in

Fetch /api/profile

Detect activeRole

Redirect user to the correct dashboard based on activeRole

C. Role Switching Flow (Navbar)

Fetch /api/profile/switch-role

Display:

Available roles → selectable

Unavailable roles → tagged as “Not created”

User selects an available role

Call /api/profile/switch-role (PATCH)

Re-fetch /api/profile

Update session + Redux

Redirect based on new activeRole

D. Creating a Missing Role

User clicks a role marked Not created

Redirect to Create Account / Role page

Role is selected explicitly

Call /api/auth/add-account

Use role + profile-derived data

On success:

Re-fetch /api/profile

Detect activeRole

Redirect accordingly

STATE MANAGEMENT RULES

NextAuth session is the source of authentication truth

Redux Toolkit stores:

User profile

Roles

Active role

Session data must be synchronised into Redux

Role detection must always rely on API responses

ROUTING & GUARDS

Routes must be protected by:

Authentication status

Active role

Redirection logic must be centralised

No role-based hardcoding in components

UI CONSTRAINTS (VERY IMPORTANT)

Keep all existing UI components

Keep all existing pages

Keep existing layouts and styling

Only modify:

Logic

State handling

API integration

EXPECTED OUTPUT FROM YOU

You must produce:

Clean, maintainable frontend logic

Correct API integration via React Query

Proper session + Redux synchronisation

Accurate role-based routing

Zero UI changes

If a requirement is unclear, explicitly ask or flag it instead of assuming.

FINAL WARNING

This task prioritises:

Correctness

Stability

Scalability

Discipline

Creativity, shortcuts, and assumptions are not welcome here.