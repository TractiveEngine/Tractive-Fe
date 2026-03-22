# Frontend Role-Based Authentication, Onboarding & Guards

## PURPOSE

You are an **AI Frontend Engineer** working on an existing **Next.js application** with **role-based access control**.

Your responsibility is to **implement, refactor, and enforce authentication, onboarding, role creation, role switching, and route protection (guards)** using the provided APIs and tools — **without changing the UI**.

This document is the **single source of truth** for how users move through the system and how frontend guards must behave.

---

## NON-NEGOTIABLE RULES

* ❌ Do NOT change UI design, layout, spacing, colors, or components
* ❌ Do NOT invent APIs, payloads, fields, or responses
* ❌ Do NOT store auth/session data in Local Storage
* ❌ Do NOT hardcode roles or bypass role logic
* ❌ Do NOT move logic into middleware unless explicitly stated

If something is unclear → **pause and flag it**.

---

## TECH STACK (MANDATORY)

* **Next.js App Router**
* **NextAuth (JWT-based)** → authentication & session
* **Redux Toolkit** → persistent global user/profile/role state
* **TanStack React Query** → ALL API calls
* **Client-side route guards** (layout-based, not middleware)

---

## AUTH & PROFILE APIS (SOURCE OF TRUTH)


Note: add a lga input field to the onboarding page that will be use for the add-account api call and give it a label "Local Government Area" 

### 1. Create Role / Account

**POST** `/api/auth/add-account`

Used **after onboarding** to create a role for an existing user.

```json
{
  "role": "buyer",
  "name": "Enrico Tester",
  "phone": "+2348011223344",
  "address": "78 Market Street, Abuja",
  "country": "Nigeria",
  "state": "Abuja",
  "lga": "Municipal"
}
```

---

### 2. Get Profile

**GET** `/api/profile`

```json
{
  "user": {
    "_id": "...",
    "email": "user@email.com",
    "roles": [],
    "activeRole": null,
    "isVerified": true,
    "name": "Agent new",
    "status": "active"
  }
}
```

This endpoint is the **authoritative source** for:

* roles
* activeRole
* onboarding state

---

### 3. Update Profile (Onboarding)

**PATCH** `/api/profile`

```json
{
  "name": "Enrico Tester",
  "phone": "+2348011223344",
  "address": "78 Market Street, Abuja",
  "country": "Nigeria",
  "state": "Abuja",
  "interests": ["Grains", "Vegetables"]
}
```

---

### 4. Get Switchable Roles

**GET** `/api/profile/switch-role`

```json
{
  "activeRole": null,
  "availableRoles": []
}
```

---

### 5. Switch Active Role

**PATCH** `/api/profile/switch-role`

```json
{ "activeRole": "buyer" }
```

After switching:

* Re-fetch `/api/profile`
* Sync Redux + Session
* Redirect by role

---

## REQUIRED USER FLOWS (STRICT)

### A. New User Flow

1. User registers
2. User verifies email (code)
3. User logs in
4. Fetch `/api/profile`
5. `roles.length === 0` and `activeRole === null`
6. Redirect → **Register-As page**
7. User selects role (buyer / agent / transporter)
8. User clicks **Submit** (role NOT created yet)
9. Redirect → **Onboarding page**
10. User completes onboarding form
11. Call `PATCH /api/profile`
12. Call `POST /api/auth/add-account`
13. Re-fetch `/api/profile`
14. Redirect → role dashboard

---

### B. Existing User Login Flow

1. User logs in
2. Fetch `/api/profile`
3. If `activeRole !== null`

   * Redirect → role dashboard
4. If `activeRole === null` but roles exist

   * Redirect → role selection page

---

### C. Role Switching Flow (Navbar)

1. Fetch `/api/profile/switch-role`
2. Display roles:

   * Available → selectable
   * Missing → marked "Not created"
3. User selects available role
4. Call `PATCH /api/profile/switch-role`
5. Re-fetch `/api/profile`
6. Update Redux + session
7. Redirect → new role dashboard

---

### D. Creating a Missing Role

1. User clicks role marked "Not created"
2. Redirect → Create Role page
3. User confirms role
4. Call `POST /api/auth/add-account`
5. Re-fetch `/api/profile`
6. Redirect → role dashboard

---

## FRONTEND GUARDS (CRITICAL)

### Guard 1: Authentication Guard

Applied at **root protected layout**

* If no NextAuth session → redirect to `/login`

---

### Guard 2: Profile Loaded Guard

* Always fetch `/api/profile` after login
* UI must wait until profile is resolved
* Do NOT guess user state

---

### Guard 3: Role Existence Guard

* If `roles.length === 0`
  → redirect to Register-As

---

### Guard 4: Active Role Guard

* If `activeRole === null`
  → redirect to role selection

---

### Guard 5: Role-Based Route Guard

Each dashboard layout must enforce:

* buyer → `/buyer/**`
* agent → `/agent/**`
* transporter → `/transporter/**`

If mismatch → redirect to correct dashboard

---

## STATE MANAGEMENT RULES

* NextAuth session = authentication truth
* Redux stores:

  * user profile
  * roles
  * activeRole
* Redux must sync from `/api/profile`
* Never infer role locally

---

## UI CONSTRAINTS

* Keep all existing UI and components
* No redesigns
* No layout changes
* Logic-only changes allowed

---

## EXPECTED AI OUTPUT

You must:

* Follow flows exactly
* Implement client-side guards via layouts
* Use React Query for all API calls
* Keep Redux and session in sync
* Avoid assumptions

If anything is unclear → **ask before coding**.

---

## FINAL NOTE

This system prioritizes:

* correctness
* predictability
* scalability

Shortcuts are unacceptable.
