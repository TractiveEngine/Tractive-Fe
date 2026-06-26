# Tractive — Project Status Report

_Audit of all four user roles (Buyer, Transporter, Admin, Agent) plus shared infrastructure (auth, API client, route guards, service wiring)._

**Backend:** `https://tractive-be.vercel.app` (live, deployed)
**Overall:** ~75% wired to the real backend. Transactional core of every role works. Main gaps: all dashboard home pages are mock, ~6 stubbed action buttons, and the buyer tracking page is blocked on backend data. _(Server-side route protection + auth-correctness gaps resolved in Phase 1.)_

---

## ✅ Section 1 — 100% Done (connected & working)

These features are fully wired to real APIs with working mutations and loading/error/empty states.

### Infrastructure
- **Authentication** — NextAuth (JWT) + CredentialsProvider against real `/api/auth/login`, `/api/profile`. Signup/OTP flow real (`/api/auth/register`, `/verify-code`, `/resend-verification`).
- **Role switching / multi-role** — `useAvailableRoles`, `useSwitchRole`, `useAddAccount` all wired; session re-syncs after switch.
- **Token handling** — in-memory `tokenManager`, 401 refresh-and-retry with dedup, force-logout fallback.
- **API client** — single axios instance with Bearer injection + response interceptors, env-driven base URL.
- **React Query** — tuned caching (2 min stale, 15 min gc, retry 1) for slow networks.
- **Client-side role guards** — all 4 dashboards gated via layout `useRoleGuard`.

### Buyer
- Product detail (`product/[id]`) — fetch, wishlist add/remove (optimistic), seller follow, reviews, similar products, **MakeBid** fully wired.
- Sellers list + seller store — list, detail, store products, infinite scroll, server-side filters.
- My Biddings — pending/countered/rejected bids, won-bid checkout (creates order + transaction), fleet bids, counter/accept/reject mutations.
- My Orders — awaiting-transport & shipping lists, confirm-receipt mutation, tracking query.
- Wish List — fetch, add/remove with invalidation, pagination.
- Track Orders — fully wired to `useOrders()` (only blocked on backend data, see Section 3).

### Transporter
- **Booking Trips board** (`BookingTripsView`) — the strongest feature: list with debounced search, tabbed by status, trip tracking poll, create-trip + status-advance mutations.
- Fleet List — `useGetFleets`, add/edit/delete fleet, status update, Cloudinary upload.
- Drivers — full CRUD + assign-fleet mutations.
- Customers — list + detail with pagination.
- Negotiations — list + accept/reject respond mutation.
- Reviews — list, rating distribution, summary.

### Admin
- All Users (list + tabs) — real `getUsers` with filters/search/pagination; status update + reactivate mutations.
- User Detail `[id]` — summary + history, suspend/remove/reactivate wired.
- Active / Suspended / Removed — single + bulk status mutations.
- Approvals (New) — pending agents/transporters, single + bulk approve/reject.
- Rejected — re-approve single/bulk with confirm modals.
- Transactions — list with filters, detail modal, approve/reject/refund all wired.
- Fleet Payments — list, approve/reject/refund, detail modal. Production-ready.

### Agent
- Farmers — list, create, edit, delete with confirmation.
- Produce-list / Stock — best-built feature: create/update/delete/bulk with optimistic updates, Cloudinary upload.
- Bids — list, accept/reject/counter, create bid, product search.
- Orders (New / Packed / Delivered) — list + mark-packed / mark-delivered mutations.

---

## 🟡 Section 2 — Needs Work (partial / stubbed)

These are connected to real data but have dead buttons, display bugs, or missing pieces.

### Security & correctness (high priority) → ✅ Phase 1 complete
- ✅ **`src/middleware.ts` added** — NextAuth `withAuth` now enforces auth server-side at the edge for `/admin`, `/agent`, `/transporter`, `/buyer`: no token → `/login`, no activeRole → `/register-as`, wrong role → own dashboard. Protected HTML no longer ships to unauthorized browsers. _(1.1)_
- ✅ **`customerService.ts` & `reviewService.ts` now authenticated** — both migrated to the shared `src/lib/axios.ts` instance (Bearer injection + 401 refresh/logout); the never-set `localStorage("authToken")` path is gone. _(1.2)_
- ✅ **`usePermission.canCreateProducts`** now uses the strict `activeRole` model, matching the route guards. _(1.4)_
- ✅ **Base URLs & secrets centralized** — new `src/lib/config.ts` (`API_BASE_URL`); removed the `NEXTAUTH_SECRET` dev fallback; fixed `/auth/refresh` & `/auth/logout` → `/api/...` path prefixes. _(1.3)_

### Agent
- ✅ **Transaction approve wired** (`agent/pending`, `agent/received`) — action menu now offers **Approve** (+ Customer Care), calling `updateTransactionStatus(id, {status:"approved"})` via a new `useUpdateTransactionStatus` mutation. All 4 transaction tables now read through the `useAgentTransactions` React Query hook; approving invalidates the `["agentTransactions"]` cache so both tabs refetch and badges resync. _(2.1)_ · ⚠️ Reject/mark-received intentionally omitted — agent endpoint only supports `pending|approved` (reject/refund are admin-only).
- Customers — uses raw `fetch` instead of axios/React Query; leftover `testApiEndpoint()` on mount; ✅ errors now use `toast.error` _(fixed 0.6)_; `month` filter never sent.
- Reviews — reply not wired (service exists, UI shows static count); ✅ like-error now uses `toast.error` _(fixed 0.6)_.
- CustomerCareModal — mock hardcoded phone numbers, doesn't call `contactCustomerCare`.
- Order action menus — "Buyer Info" / "Customer Care" are `alert()` stubs.

### Buyer
- Home — category/sub-category navigation is **hardcoded** (no taxonomy endpoint); sub-categories duplicated.
- ✅ Transactions — "View receipt" now opens a real `ReceiptModal`; "Report issue" stub removed. _(fixed 0.5)_ · "Live Chat" button inside modal still a no-op; payment method hardcoded to "Bank transfer".
- ✅ MyBids — dead "Delete" button removed (no backend endpoint; checkboxes control checkout). _(fixed 0.5)_ · star ratings still hardcoded to 5.
- Product detail — `ProPaymentMethod` is display-only (no selection state).
- Booking flow — unclear Redux-vs-API truck-source precedence; localStorage-based cost calc with no server validation.
- Wish List — no explicit error-state UI.

### Transporter
- ✅ Negotiations — Amount column now renders the real `amount` field (`₦{amount.toLocaleString()}`). _(fixed 0.1)_
- ✅ Pending — "KG" & "Payment" columns now render real values (all 4 pending/received tables). _(fixed 0.3)_ · no approve/reject mutation yet (read-only).
- Fleet List — **"Track" action is a TODO/`alert()` stub** (`ALLTransit.tsx:158`).
- AddFleet — status enum mismatch (form emits "Active/Inactive" vs API "available/under_maintenance"), no conversion layer.
- SupportModal / CustomerCareModal — hardcoded contact info.

### Admin
- Track-transporter — real data, but all action-menu items ("Buyer Info", "Transporter Info", "Track Order") are `console.log` stubs.
- Approvals — rejection reasons hardcoded ("Approved by admin"); admin can't enter a reason. Fetch errors swallowed silently.
- Removed page — capped at `limit:100` with no pagination footer.
- Tab count badges in `AllUserTypeContainer` computed from a mock array (counts are fake, tables are real).

### Known bugs
- ✅ `agent/delivered/page.tsx:91` — added `[]` dependency array; 30s interval now registers once on mount. _(fixed 0.4)_
- ✅ `FarmerService.ts:81` — revenue interpolation fixed (`₦₦{...}` → `₦${...}`). _(fixed 0.2)_
- ✅ Hardcoded `tractive-be.vercel.app` URLs in `auth.ts`, `signupAuth.ts`, `sellerApi.ts`, password APIs now route through `src/lib/config.ts`. _(fixed 1.3)_
- ✅ `transactionService.ts` — removed the hardcoded `mockProductImages`/`getRandomDescription` pickers. `getTransactions` now derives the Item name/description/image from the real populated `order.products[0].product`, and keeps the full populated order so the new **TransactionDetailsModal** (click any agent transaction row) can show product, transaction, and buyer details. _(2.1 follow-up)_
- ✅ Refresh/logout path prefix mismatch fixed (`/auth/refresh` → `/api/auth/refresh`; `/auth/logout` → `/api/auth/logout`). _(fixed 1.3)_
- ✅ Debug `console.log`s removed from `auth.ts`, `customerService.ts`, `reviewService.ts`, `signupAuth.ts`; `testApiEndpoint()` mount call + dead debug helpers removed. _(fixed 0.7)_

---

## 🔴 Section 3 — Not Done (fully mock / blocked)

### Fully mock (frontend work, no backend dependency confirmed)
- **All 4 dashboard home pages** are 100% hardcoded — no analytics endpoints exist yet:
  - **Admin home** — `AdminOverview`, `AdminRevenueChart`, `TopBuyer`, `TopAgents`, `TopTransporter`.
  - **Transporter home** — `TransporterOverview`, `RevenueChart`, `MostHired`, `TopCustomers`, `TransitTable`.
  - **Agent home** — `FarmerOverview`, `RevenueChart`, `OutOfStock`, `TopCustomers`, `MostSoldCategoryPieChart`, `MostSoldItem`.
- **Agent Track Order page** (`agent/delivered/trackorder/[productId]`) — fully static with a fake 5s loading delay; never reads the `productId` param. `OrderService.getOrderTracking` already exists, just needs wiring.
- **Admin track-agent page** — hardcoded `TrackAgentData`, no API at all; action handlers are `console.log` stubs.
- **Transporter `received/` page** — abandoned mock duplicate of `pending/` showing fake 15/15 counts and static rows. Either delete or wire.

### Blocked on backend (frontend is ready — see `API-FEEDBACK-FOR-BACKEND.md`)
- **Buyer Track Orders** shows "N/A" everywhere because `/api/orders` doesn't populate: `transporter`, `fleet`, timeline dates (`pickedAt`/`onTransitAt`/`deliveredAt`), `estDeliveryDate`, `fromLocation`/`toLocation`, and live `currentLocation` (feedback items 5 & 6 — highest priority).
- **Trip board** shows "EST —" — `estDeliveryDate` is never set backend-side (item 7).
- **Live tracking map** — frozen placeholder until `/api/orders/{orderId}/tracking` returns `currentLocation` (item 5).

### Dead code to remove
- Orphaned hardcoded demo files under transporter `new/picked/on-transit/delivered/_components` (`*OrderTracking.tsx`, `MapTrackingTimeline`, `TabTitles`).
- `transporter/drivers/_components/DriverDetailsForm.tsx` — misplaced fleet form with `console.log` + fake image URL.
- Unused mock files: `BiddingDatas.tsx`, mock helpers in `transactionService.ts`.

---

## Suggested order of attack
1. **Quick high-value:** unauthenticated services fix, agent transaction approve/reject, cheap display bugs (`₦0`, `₦₦`, KG/Payment columns, useEffect deps).
2. **Security:** add `middleware.ts` for server-side route protection.
3. **Wire existing endpoints:** agent track-order page, admin track-agent/transporter actions.
4. **Dashboards:** wire all 4 home pages once backend analytics endpoints are available.
5. **Backend follow-up:** populate order/tracking fields per `API-FEEDBACK-FOR-BACKEND.md`.
