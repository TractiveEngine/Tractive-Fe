# Frontend Authentication, Onboarding & Role-Based Routing Prompt

## ROLE

Act as a **Senior Frontend Developer** working on a large-scale, production-ready Next.js application.

You are responsible for **authentication flow correctness**, **role-based routing**, **session management**, and **clean UI logic integration**, while respecting all existing designs and features.

---

## CORE OBJECTIVE

Implement and refine frontend logic so that:

- Role creation happens correctly during onboarding
- User profile data is correctly persisted into the session
- Role-based route protection is enforced
- Role switching and role creation UX is clean, scalable, and enterprise-grade

This is a **frontend logic and architecture task**, not a redesign.

---

## STRICT RULES (MUST FOLLOW)

- ❌ Do NOT change existing UI layouts or visual design
- ❌ Do NOT modify unrelated features
- ❌ Do NOT change backend APIs
- ❌ Do NOT hardcode roles or routes
- ❌ Do NOT store auth data in Local Storage
- ❌ Do NOT introduce new flows outside what is described

If something is unclear, **flag it explicitly** instead of guessing.

---

## ONBOARDING FLOW REQUIREMENTS

### Observed Change (Important)

On the **onboarding page**, you will notice changes that require:

1. **Calling `add-account` BEFORE updating the profile**
2. Only after the account/role is successfully added:
   - Proceed to update the user profile

### Required Sequence

1. User selects role
2. Call `add-account` API
3. On success:
   - Call `update profile` API
4. Once profile update succeeds:
   - Save the returned user data into the **authenticated session**
   - Sync session data into global state if applicable

This session data must be used for:
- Authentication checks
- Role-based routing
- Page access validation

---

## SESSION & AUTHENTICATION HANDLING

After profile update:

- Persist user data (roles, activeRole, profile info) into the session
- Session must be the **source of truth** for:
  - Who the user is
  - What role they can access
  - Which pages they are allowed to visit

Session updates must happen after:
- Profile updates
- Role switching
- Role creation

---

## ROLE-BASED ROUTE PROTECTION

Implement **best-practice auth guards** for all role-based pages.

### Rules

- An **Agent** can only access `/agent/*`
- A **Buyer** can only access `/buyer/*`
- A **Transporter** can only access `/transporter/*`
- An **Admin** can only access `/admin/*`

### Multiple Roles Handling

- If a user has multiple roles:
  - Route them based on their **activeRole**
- If no activeRole exists:
  - Redirect to role selection / register-as page
- When a user switches role:
  1. Update active role via API
  2. Update session
  3. Redirect immediately to the new role’s route

Never allow users to manually access routes outside their active role.

---

## ROLE SWITCHING & ROLE CREATION (NAVBAR)

### Navbar Dropdown Requirements

Improve the **role switcher UI** to reflect a **large-scale, enterprise application**, while still using the existing design language.

The dropdown should:

- Clearly list:
  - Existing roles (clickable)
  - Missing roles (disabled or tagged as “Not created”)
- Separate **Switch Role** and **Add New Role** actions clearly
- Avoid accidental role switching

---

## ADDING A NEW ROLE (NEW PAGE)

When a user wants to add a new role:

### UI Behaviour

- Navigate to a **dedicated page**
- Display:
  - The selected new role prominently
  - Existing roles visually blurred or disabled
- Show a form section below:
  - Auto-filled from existing profile data
  - Editable by the user

### Logic

1. Pre-fill form from profile API
2. Allow user to edit fields
3. On submit:
   - Call `add-account` API
4. On success:
   - Refresh profile
   - Update session
   - Redirect based on the new active role

---

## SCOPE LIMITATION

- Do NOT touch any features not mentioned here
- Do NOT refactor unrelated code
- Do NOT optimise or rewrite components unless necessary for this task

---

## OPTIONAL IMPROVEMENTS (ALLOWED)

If you identify improvements:

- Clearly label them as **Suggestions**
- Explain:
  - What can be improved
  - Why it matters
  - How to implement it safely
- Do NOT implement them automatically

---

## EXPECTED OUTPUT

You must deliver:

- Correct onboarding logic order
- Proper session persistence
- Secure role-based route protection
- Clean role switching & role creation UX logic
- Zero unintended side effects

---

## FINAL NOTE

This task values:
- Accuracy
- Stability
- Scalability
- Professional frontend standards

Avoid assumptions. Avoid shortcuts. Be explicit and deliberate.
