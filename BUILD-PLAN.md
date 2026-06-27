# Tractive — Build Plan (Remaining Work)

_Phased plan to finish the project. Sequenced by priority, dependency, and effort. Each task lists the target files and acceptance criteria._

**Legend:** 🔴 critical · 🟠 high · 🟡 medium · ⚪ cleanup
**Effort:** S = <1h · M = half day · L = 1–2 days

---

## Phase 0 — Quick wins & bug fixes (1 day)
_No backend dependency. Ship these first to stop visible breakage._

| # | Task | Files | Effort |
|---|---|---|---|
| 0.1 | ✅ Fix negotiations Amount showing `₦0` — render the real `amount` field | `transporter/negotiations/page.tsx:52` | S |
| 0.2 | ✅ Fix `₦₦{...}` literal revenue interpolation | `services/FarmerService.ts:81` | S |
| 0.3 | ✅ Fix pending/received "KG" & "Payment" columns rendering literal strings | transporter `pending` tables (~lines 73-79) | S |
| 0.4 | ✅ Add missing dependency array → stops 30s interval re-registering every render | `agent/delivered/page.tsx:91` | S |
| 0.5 | ✅ Wire or remove dead buttons: MyBids "Delete" removed (no endpoint); "View receipt" wired to new `ReceiptModal`; "Report issue" removed (no endpoint) | `MyBids.tsx`, buyer transactions row menu | S |
| 0.6 | ✅ Replace `alert()` error handling with `sonner` toast (consistency) | `agent/customers`, `agent/reviews` | S |
| 0.7 | ✅ Remove debug `console.log`s + `testApiEndpoint()` mount call (also removed dead `testApiEndpoint`/`checkBackendHealth` debug helpers) | `auth.ts`, `customerService.ts`, `reviewService.ts`, `signupAuth.ts`, `agent/customers/page.tsx:155` | S |

**Acceptance:** no hardcoded currency/units in connected tables; no dead buttons; clean console. → ✅ **Phase 0 complete.**

---

## Phase 1 — Security & auth correctness (2 days) 🔴
_Highest-risk gaps. Do before any production deploy._ → ✅ **Phase 1 complete.**

### 1.1 — Server-side route protection (L) ✅
- ✅ Added `src/middleware.ts` using NextAuth `withAuth`.
- ✅ Gates `/admin`, `/agent`, `/transporter`, `/buyer` by token presence + `activeRole` match (matcher-scoped).
- ✅ Unauthorized → `/login` (via `authorized` callback + `pages.signIn`); no `activeRole` → `/register-as`; wrong-role → own `/{activeRole}` dashboard.
- **Acceptance:** hitting `/admin` without an admin token now returns a server redirect (edge middleware) before the protected bundle loads. ✅

### 1.2 — Fix unauthenticated services (M) ✅
- ✅ `customerService.ts` & `reviewService.ts` rewritten onto the shared `src/lib/axios.ts` instance — Bearer injection + 401 refresh/logout now applied. Removed the dead `localStorage("authToken")` token + duplicated header/handleResponse logic.
- ✅ Made the agent customers page catch axios-aware so backend error messages still surface.
- **Acceptance:** customer/review calls now carry `Authorization: Bearer …`. ✅

### 1.3 — Centralize base URLs & secrets (M) ✅
- ✅ New `src/lib/config.ts` exporting `API_BASE_URL` (single env-driven source; one documented prod fallback). Repointed `auth.ts`, `signupAuth.ts`, `sellerApi.ts`, `useLogout.ts`, and the 3 password APIs onto it.
- ✅ Removed `"development-secret-key"` fallback for `NEXTAUTH_SECRET`.
- ✅ Fixed path prefix mismatch: `/auth/refresh` → `/api/auth/refresh` (axios), `/auth/logout` → `/api/auth/logout` (useLogout).
- **Acceptance:** no hardcoded host literals remain in `src/` except the single `config.ts` fallback; changing `NEXT_PUBLIC_API_URL` repoints the whole app. ✅

### 1.4 — Reconcile permission logic (S) ✅
- ✅ `usePermission.canCreateProducts` now uses the strict `activeRole` model (`activeRole === "admin" || "agent"`), matching `useRoleGuard`.

---

## Phase 2 — Wire existing endpoints (2–3 days) 🟠
_Backend already supports these; only frontend wiring is missing._

### 2.1 — Agent: transaction approve/reject (M) ✅
- ✅ Added **Approve** action to the agent `TransactionActionMenu` (both `agent/pending` and `agent/received` copies), wired to `transactionService.updateTransactionStatus(id, { status: "approved" })`.
- ✅ Routed reads + the mutation through TanStack Query: new `useAgentTransactions` query (keyed by status/search/year/month) + `useUpdateTransactionStatus` mutation in `useTransactionQueries.ts`. On approve success it invalidates the `["agentTransactions"]` key family, so **both** the Pending and Approved tabs refetch and the tab-count badges resync. Replaced the old local-`useState`/`fetchTransactions` plumbing in all 4 table components.
- ✅ Approve button shows an "Approving…" disabled state during the mutation; success/error surface via `sonner` toast.
- ⚠️ **Reject / mark-received deliberately not added:** the agent endpoint (`/api/transactions/{id}/status`) and `FrontendTransaction.status` only support `"pending" | "approved"` — there is no `rejected`/`received` status for agent transactions (only the **admin** endpoint exposes reject/refund). Sending those would be an out-of-contract value. If the backend adds a reject status for agents, the menu can extend trivially (the mutation already takes a `status`).
- ✅ **Follow-ups during testing:** (a) hardened `getTransactions` for the real `{ success, data: [...] }` envelope with populated `order`/`buyer`; (b) wired the Item column + Sold/Commission to real product/amount data (removed the `mockProductImages`/random-description pickers — also clears a Phase 5.3 cleanup item); (c) added a **TransactionDetailsModal** (click any row) showing product(s), transaction summary, and buyer info; (d) switched the tab pages to React Query so tab-switching is cache-only (no refetch within staleTime).
- **Acceptance:** ✅ agent can approve a transaction and the list (both tabs) refetches via cache invalidation.

### 2.2 — Agent: Track Order page (M) ✅
- ✅ `getOrderById` now returns the full populated `OrderRecord` (unwraps `{ success, data }`); new `useOrderDetail(orderId)` React Query hook keyed by `orderKeys.detail(id)` (staleTime 3m, skips retry on 401/403/404).
- ✅ Page reads the `productId` param (= order `_id`), fetches via `useOrderDetail`, and maps the record with the **shared `orderToTrackOrder`** mapper. Real loading spinner + error/empty state replace the fake 5s `setTimeout`.
- ✅ Wired **all 5 subcomponents** to real data (removed `DeliveredProductData`/`PackagedProducts` mocks + hardcoded GIGM/driver/dates):
  - `OrderTrackingAndTransportInfo` — transporter card, status-driven Picked/Transit/Delivered timeline, fleet + product cards.
  - `MapTrackingTimeline` — real timeline dates, From/To, and live GPS via `useOrderTracking` (reuses buyer `LiveTrackingMap`, polls 30s while in motion; static map fallback).
  - `TransportInfoAndPackageProduct` — real transporter info + phone-driven call modal.
  - `PackagedTable` — real `packages` (empty-state row).
  - `TransportCallDetails` — graceful "no contact" when no phone.
- ✅ **Refactor/DRY:** moved the `OrderRecord → TrackOrder` mapper + helpers into `trackOrdersData.ts` (exported) and repointed the buyer page to it; added `transporter.phone` to the view-model.
- ✅ **Routing fix:** the Track Order links + back button used `/agents/...` (plural) — a dead route (folder is `agent`). Fixed across the 3 `DeliveredProductActionMenu` copies (new/packed/delivered) and the back button, so the page is actually reachable.
- ⚠️ **Backend-dependent fields** (transporter/fleet/timeline dates/`estDeliveryDate`/route) degrade to "N/A" until delivered — logged as **Item 7b** in `API-FEEDBACK-FOR-BACKEND.md` (same gap as buyer Item 6/5).
- **Acceptance:** ✅ real order data renders via TanStack cache; no artificial delay.

### 2.3 — Admin: track-transporter & track-agent actions (M) — ✅ track-transporter / ⛔ track-agent (backend-blocked)
- ✅ **track-transporter** — wired all three `TrackTransporterActionMenu` actions (data already real via `useFleetTrips`):
  - **Track Order** → reuses the existing self-fetching `TripDetailsModal` (map + timeline + packages + status form).
  - **Buyer Info** / **Transporter Info** → new read-only `TrackTransporterInfoModal` rendered straight from the loaded `FleetTripSummary` (no extra fetch), reusing `tripHelpers`.
  - Page keeps an id→trip `Map` so handlers resolve the row's full data; removed the `console.log`-only stub handlers and all debug logs in `TrackTransporterActionMenu`.
- ⛔ **track-agent** — **backend-blocked.** The board still uses the hardcoded `TrackAgentData`; there is **no agent-order tracking endpoint** (track-transporter has `/api/transporters/fleet-trips`; agents have no equivalent). Logged as **Item 9** in `API-FEEDBACK-FOR-BACKEND.md`. Frontend is ready to wire identically once the endpoint exists.
- **Acceptance:** ✅ admin can open Buyer Info / Transporter Info / Track Order on a transporter trip with real data; track-agent awaits backend.

### 2.4 — Agent: reviews reply (S) ✅
- ✅ New `useReviewQueries.ts` (TanStack): `useReviews` + `useReviewsSummary` queries (replaces the page's manual `useState`/`useEffect` fetching) and `useReplyToReview` + `useLikeReview` mutations. Reply/like success invalidates `reviewKeys.list()` so counts + new replies resync from cache.
- ✅ Reply control is now interactive: clicking **replies** opens a composer (textarea + Post/Cancel); submitting calls `ReviewService.replyToReview` and shows a "Posting…" disabled state. Existing `review.replies` now render under each review (was static count only).
- **Acceptance:** ✅ agent can post a reply; it appears and the list refetches via cache invalidation.

### 2.5 — Wire decorative filters (S) ✅
- ✅ **Bids page** — the Search input had no `value`/`onChange` and Year/Month set state but never reached `getBids`. Wired the search box (debounced 500ms), passed `search`/`year`/`month` (1-based) to `bidService.getBids` (signature extended with a `filters` arg), and added page-reset on filter change.
- ✅ **Customers page** — `month` was tracked in deps but never sent. Added `month?: number` to `GetCustomersParams` + the `getCustomers` query builder, and the page now sends the 1-based month alongside the already-working `search`/`year`.
- ✅ Per decision, params are **sent to the API** (not removed); backend filtering support is requested as **Item 8** in `API-FEEDBACK-FOR-BACKEND.md` (bids: none today; customers: `month` new).
- **Acceptance:** ✅ all rendered filter controls now post their values to the API; none are decorative.

### 2.6 — Fleet "Track" action (S) ✅
- ✅ Replaced the `alert()`/TODO stub in `ALLTransit.tsx` `handleTracking`: it now `router.push`es into the trip tracking view (`/transporter/on-transit`) with `?search=<fleet IOT or name>`.
- ✅ `BookingTripsView` now seeds its search box from the `?search=` param (`useSearchParams`), and since the search persists across the New/Picked/On transit/Delivered tabs (server-filtered per tab), the fleet's trip surfaces whatever stage it's in.
- **Acceptance:** ✅ clicking Track on a fleet opens the trip tracking board pre-filtered to that fleet; no `alert()`.

### 2.7 — AddFleet status enum mapping (S) ✅
- ✅ Added bidirectional `fleetStatusToApi` / `fleetStatusToLabel` helpers in `utils/Fleet.ts` (canonical map `available↔Available`, `under_maintenance↔Under Maintenance`, `on_transit↔On Transit`; legacy `Active→available`/`Inactive→under_maintenance` still convert).
- ✅ `AddFleet` now: options/default aligned to canonical labels (`Available`/`Under Maintenance`; `On Transit` excluded as trip-driven), edit-init maps the API enum → label for display, and submit maps label → API enum (`fleetStates` was previously sent raw as "Active", an out-of-contract value).
- **Acceptance:** ✅ the create payload sends a valid status enum; editing shows the correct label instead of the raw enum.

---

## Phase 3 — Dashboards (3–5 days, backend-dependent) 🟠
_All 4 home pages are 100% mock. Blocked on analytics endpoints — coordinate with backend first._

### 3.0 — Backend: define analytics endpoints (blocker)
Request from backend (one set, reusable per role with role scoping):
- `GET /api/{role}/dashboard/stats` — totals (revenue, counts, % change).
- `GET /api/{role}/dashboard/revenue?period=12m` — monthly series.
- `GET /api/{role}/dashboard/top?type=buyers|agents|transporters|customers|products` — ranked lists.

### 3.1 — Shared dashboard query hooks (M)
- New `useDashboardQueries.ts` + `dashboardService.ts`.

### 3.2 — Wire Admin home (M)
- `AdminOverview`, `AdminRevenueChart`, `TopBuyer`, `TopAgents`, `TopTransporter` + loading/error/empty states.
- Also fix tab count badges in `AllUserTypeContainer` (currently from mock array).

### 3.3 — Wire Transporter home (M)
- `TransporterOverview`, `RevenueChart`, `MostHired`, `TopCustomers`, `TransitTable`.

### 3.4 — Wire Agent home (M)
- `FarmerOverview`, `RevenueChart`, `OutOfStock`, `TopCustomers`, `MostSoldCategoryPieChart`, `MostSoldItem`.

**Acceptance per dashboard:** no hardcoded arrays; loading skeletons + empty/error states present.

---

## Phase 4 — Backend data completeness (backend-led) 🔴
_Frontend is ready; tracked in `API-FEEDBACK-FOR-BACKEND.md`. Frontend verifies once delivered._

| # | Need | Unblocks |
|---|---|---|
| 4.1 | `/api/orders` populate `transporter`, `fleet`, timeline dates, `fromLocation`/`toLocation` | Buyer track-orders (currently all "N/A") |
| 4.2 | `/api/orders/{id}/tracking` confirm `currentLocation` shape | Buyer live map (frozen placeholder) |
| 4.3 | Backend calculates `estDeliveryDate` | Trip board "EST —" + buyer ETA |
| 4.4 | Add `receiptConfirmedAt` flag to order record | Stops confirm-receipt button reappearing after refresh |
| 4.5 | Confirm `/fleet/{id}/bookings?status=confirmed` exists | Trip creation form |

---

## Phase 5 — Cleanup & polish (1 day) ⚪

| # | Task | Files | Status |
|---|---|---|---|
| 5.1 | ✅ Swapped transporter nav → real-data `pending/`; deleted mock `received/` folder + its mock arrays. (Plan said delete `received/`, but `received/` was the **nav-linked mock** page and `pending/` the **orphaned real-data** page — so removed the redundant "Received" nav item, since `pending/` already has both Pending + Approved/Received tabs.) | `transporter/received/**`, `TransporterAsideNav(.Mobile)`, `TransporterTransactionData.ts` | ✅ |
| 5.2 | ✅ Deleted 36 orphaned demo tracking components (`new/picked/on-transit/delivered/_components`). **Kept `TrackOrder.css`** — its classes are still used by the active `BookingTripsView`/`TripDetailsModal`. | transporter page `_components` | ✅ |
| 5.3 | ✅ Deleted orphaned `DriverDetailsForm.tsx` + `buyer/BiddingDatas.tsx`. `mockProductImages` already removed in a prior session. | various | ✅ |
| 5.4 | ✅ De-duplicated agent order tables: one shared React-Query `AgentOrderTable` + 3 shared ActionMenus in `agent/_components/`, reused by all 3 pages; deleted 9 triplicated tables + 9 triplicated menus; counts standardized on `useOrders`; advance-status invalidates `orderKeys.lists()` so rows + tab counts resync from cache. | `agent/_components/table/AgentOrderTable.tsx`, agent `new/packed/delivered` | ✅ |
| 5.5 | ⏭️ Skipped (per decision: accept static). SupportModal/CustomerCareModal keep placeholder contact info; no central config added. | transporter + agent modals | ⏭️ skipped |
| 5.6 | ✅ Added error-state UI (message + Retry) to buyer Wishlist (`isError`/`refetch` via `useGetWishlist`) and Transactions (`useOrders`). | buyer pages | ✅ |
| 5.7 | ⏭️ Skipped (per decision). Category taxonomy is backend-blocked (no endpoint); `ProPaymentMethod` selection deferred. | buyer home, product detail | ⏭️ deferred |
| 5.8 | ✅ Added client-side pagination (10/page, Prev/numbers/Next, range label) to admin `RemovedTable`; added an optional rejection-reason textarea to `ConfirmActionModal`, wired into admin approvals reject flow (falls back to "Rejected by admin"). | admin pages | ✅ |

---

## Suggested sequencing
1. **Week 1:** Phase 0 (quick wins) → Phase 1 (security). Ship-blocking items cleared.
2. **Week 2:** Phase 2 (wire existing endpoints) in parallel with sending Phase 3.0 + Phase 4 requests to backend.
3. **Week 3:** Phase 3 (dashboards) as backend endpoints land; Phase 5 cleanup.
4. **Ongoing:** Phase 4 verification as backend delivers each field.

## Rough effort total
- Frontend-only work (Phases 0, 1, 2, 5): **~8–10 dev-days.**
- Dashboards (Phase 3): **~3–5 days after backend endpoints exist.**
- Phase 4: backend-led; frontend verification ~1 day.
